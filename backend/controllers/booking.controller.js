const db = require('../models');
const Booking = db.Booking;
const User = db.User;
const Training = db.Training;
const Hall = db.Hall;
const Trainer = db.Trainer;
const { Op } = require('sequelize');


const handleError = (res, error, message) => {
  console.error(message, error); 
  let errorMessage = message; 
  if (error.original && error.original.message) {
    errorMessage = error.original.message; 
    if (error.original.hint) {
        errorMessage += ` Vihje: ${error.original.hint}`;
    }
  } else if (error.message) {
    errorMessage = error.message; 
  }
  res.status(500).json({ message: `Serveri viga: ${errorMessage}`, error: error.message });
};

exports.createBooking = async (req, res) => {
  console.log('Backend: createBooking function entered.'); 
  console.log('Backend: Raw request body:', req.body); 
  try {
    const { trennId, SaaliID, bookingDate, bookingTime } = req.body;
    const userId = req.userId; 

    console.log(`Backend: Extracted from body: UserID: ${userId}, TreeningID (from trennId): ${trennId}, SaaliID: ${SaaliID}, Date: ${bookingDate}, Time: ${bookingTime}`);

    if (!userId) {
      console.log('Backend: User not authorized for booking.'); 
      return res.status(401).send({ message: 'Broneeringu loomiseks on vajalik autoriseerimine!' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log('Backend: User not found.'); 
      return res.status(404).send({ message: 'Kasutajat ei leitud!' });
    }

    if (!bookingDate) { 
      console.log('Backend: Missing bookingDate in request body. bookingDate:', bookingDate);
      return res.status(400).send({ message: 'Kuupäev on broneerimiseks kohustuslik.' });
    }

    let bookingData = {
      KasutajaID: userId,
      BroneeringuKuupäev: bookingDate,
      Staatus: 'Pending' 
    };

    let actualTreeningId = null;
    let actualSaaliId = null;

    if (trennId) { 
      if (!bookingTime) { 
        console.log('Backend: Missing bookingTime for training booking.');
        return res.status(400).send({ message: 'Kellaaeg on treeningu broneerimiseks kohustuslik.' });
      }
      const training = await Training.findByPk(trennId);
      if (!training) {
        console.log('Backend: Training not found for provided TreeningID.');
        return res.status(404).send({ message: 'Treeningut ei leitud!' });
      }
      actualTreeningId = trennId;
      actualSaaliId = training.SaaliID; 
      bookingData.BroneeringuKellaaeg = bookingTime; 
      console.log(`Backend: Booking specific training (ID: ${actualTreeningId}) in Hall (ID: ${actualSaaliId}).`); 
    } else if (SaaliID) { 
      const hall = await Hall.findByPk(SaaliID);
      if (!hall) {
        console.log('Backend: Hall not found for provided SaaliID.'); 
        return res.status(404).send({ message: 'Saali ei leitud!' });
      }
      actualSaaliId = SaaliID;
      actualTreeningId = null; 
      bookingData.BroneeringuKellaaeg = bookingTime || null;
      console.log(`Backend: Booking Hall directly (ID: ${actualSaaliId}). Time: ${bookingTime || 'Määramata'}.`); 
    } else {
      console.log('Backend: Neither TreeningID nor SaaliID provided. Cannot determine type of booking.'); 
      return res.status(400).send({ message: 'Broneeringu loomiseks on vaja määrata treeningu ID või saali ID.' });
    }

    bookingData.TreeningID = actualTreeningId;
    bookingData.SaaliID = actualSaaliId;
    const existingBooking = await Booking.findOne({
      where: {
        KasutajaID: userId,
        BroneeringuKuupäev: bookingData.BroneeringuKuupäev,
        BroneeringuKellaaeg: bookingData.BroneeringuKellaaeg === null ? { [Op.is]: null } : bookingData.BroneeringuKellaaeg,
        [Op.or]: [ 
            actualTreeningId ? { TreeningID: actualTreeningId } : { TreeningID: { [Op.is]: null } },
            actualSaaliId ? { SaaliID: actualSaaliId } : { SaaliID: { [Op.is]: null } }
        ]
      },
      schema: 'sports_complex_2' 
    });

    if (existingBooking) {
      console.log('Backend: Existing booking found for this user, date, time and item.'); 
      return res.status(409).send({ message: 'Olete selle aja ja elemendi juba broneerinud.' });
    }
    const newBooking = await Booking.create(bookingData, { schema: 'sports_complex_2' });

    console.log('Backend: Booking successfully created:', newBooking.toJSON()); 
    res.status(201).json({ message: 'Broneering edukalt loodud!', booking: newBooking });
  } catch (error) {
    console.error('Backend: Error in createBooking:', error); 
    handleError(res, error, 'Viga broneeringu loomisel.');
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const KasutajaID = req.userId; 

    if (!KasutajaID) {
      return res.status(401).send({ message: 'Broneeringute vaatamiseks on vajalik autoriseerimine!' });
    }

    const bookings = await Booking.findAll({
      where: { KasutajaID: KasutajaID },
      include: [
        {
          model: Training,
          as: 'training',
          attributes: ['TreeningID', 'Nimetus', 'Kirjeldus'], 
          required: false, 
          include: [
            {
              model: Hall,
              as: 'hall',
              attributes: ['Nimetus'] 
            },
            {
              model: Trainer,
              as: 'trainer',
              attributes: ['TreenerID'], 
              required: false, 
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['Eesnimi', 'Perekonnanimi'] 
                }
              ]
            }
          ]
        },
        {
          model: Hall,
          as: 'hall',
          attributes: ['Nimetus'], 
          required: false 
        }
      ],
      order: [['BroneeringuKuupäev', 'DESC'], ['BroneeringuKellaaeg', 'DESC']],
      schema: 'sports_complex_2'
    });

    const formattedBookings = bookings.map(booking => {
      const isTrainingBooking = booking.TreeningID !== null && booking.training !== null;
      const isHallBooking = booking.SaaliID !== null && booking.hall !== null && booking.TreeningID === null; 

      let name, date, time, hallName, trainerName;

      if (isTrainingBooking) {
        name = booking.training.Nimetus || 'N/A';
        date = booking.BroneeringuKuupäev || 'N/A'; 
        time = booking.BroneeringuKellaaeg || 'N/A'; 
        hallName = booking.training.hall ? booking.training.hall.Nimetus : 'N/A';
        trainerName = booking.training.trainer && booking.training.trainer.user ?
                      `${booking.training.trainer.user.Eesnimi} ${booking.training.trainer.user.Perekonnanimi}` : 'N/A';
      } else if (isHallBooking) { 
        name = `Saal: ${booking.hall.Nimetus || 'N/A'}`; 
        date = booking.BroneeringuKuupäev || 'N/A';
        time = booking.BroneeringuKellaaeg || 'N/A'; 
        hallName = booking.hall.Nimetus || 'N/A';
        trainerName = 'N/A (Saali broneering)';
      } else { 
        name = 'N/A (Broneeringu tüüp määramata)';
        date = booking.BroneeringuKuupäev || 'N/A';
        time = booking.BroneeringuKellaaeg || 'N/A';
        hallName = 'N/A';
        trainerName = 'N/A';
      }

      return {
        BroneeringuID: booking.BroneeringuID,
        Name: name,
        Date: date,
        Time: time,
        HallName: hallName,
        TrainerName: trainerName,
        Status: booking.Staatus
      };
    });

    res.status(200).json(formattedBookings);
  } catch (error) {
    handleError(res, error, 'Viga kasutaja broneeringute hankimisel.');
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const KasutajaID = req.userId; 

    const booking = await Booking.findByPk(id, { schema: 'sports_complex_2' });

    if (!booking) {
      return res.status(404).send({ message: 'Broneeringut ei leitud.' });
    }

    if (booking.KasutajaID !== KasutajaID) {
      return res.status(403).send({ message: 'Teil puudub õigus seda broneeringut tühistada.' });
    }

    if (booking.Staatus === 'Cancelled' || booking.Staatus === 'Completed') {
        return res.status(400).send({ message: 'Broneeringut ei saa praeguses staatuses tühistada.' });
    }

    booking.Staatus = 'Cancelled'; 
    await booking.save(); 

    res.status(200).json({ message: 'Broneering edukalt tühistatud!', bookingId: id });
  } catch (error) {
    handleError(res, error, 'Viga broneeringu tühistamisel.');
  }
};