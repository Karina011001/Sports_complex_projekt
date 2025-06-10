const db = require('../models');
const Trainer = db.Trainer;
const User = db.User;
const Rating = db.Rating;
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

exports.getAllTrainers = async (req, res) => {
  try {
    console.log('Üritatakse hankida treenerite andmeid koos hinnangutega...');
    const trainers = await Trainer.findAll({
      attributes: [
        'TreenerID',
        'Info'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['KasutajaID', 'Eesnimi', 'Perekonnanimi', 'TelNr', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: [
            'HinnangudID',
            'Rating',
            'Kommentaar',
            'Kuupäev'
          ],
          include: {
              model: User,
              as: 'user', 
              attributes: ['Eesnimi', 'Perekonnanimi']
          },
          order: [['Kuupäev', 'DESC']],
          required: false 
        }
      ],
      group: [
        'Treener.TreenerID',
        'user.KasutajaID',
        'user.Eesnimi',
        'user.Perekonnanimi',
        'user.TelNr',
        'user.email',
        'ratings.HinnangudID',
        'ratings.Rating',
        'ratings.Kommentaar',
        'ratings.Kuupäev',
        'ratings.KasutajaID',
        'ratings->user.KasutajaID',
        'ratings->user.Eesnimi',
        'ratings->user.Perekonnanimi'
      ],
      order: [['TreenerID', 'ASC']],
      schema: 'sports_complex_2'
    });

    console.log('Hangitud treenerid (enne vormindamist):', JSON.stringify(trainers, null, 2));

    const formattedTrainers = trainers.map(trainer => {
        const totalRating = trainer.ratings ? trainer.ratings.reduce((sum, r) => sum + r.Rating, 0) : 0;
        const ratingCount = trainer.ratings ? trainer.ratings.length : 0;
        const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0';

        const recentRatings = trainer.ratings ? trainer.ratings.slice(0, 3).map(r => ({
            HinnangudID: r.HinnangudID,
            Rating: r.Rating,
            Kommentaar: r.Kommentaar,
            Kuupäev: r.Kuupäev,
            userName: r.user ? `${r.user.Eesnimi} ${r.user.Perekonnanimi}` : 'Anonüümne'
        })) : [];

        return {
            TreenerID: trainer.TreenerID,
            Eesnimi: trainer.user ? trainer.user.Eesnimi : 'N/A',
            Perekonnanimi: trainer.user ? trainer.user.Perekonnanimi : 'N/A',
            Telefon: trainer.user ? trainer.user.TelNr : 'N/A',
            Email: trainer.user ? trainer.user.email : 'N/A',
            Info: trainer.Info,
            averageRating: averageRating,
            reviewCount: ratingCount,
            ratings: recentRatings
        };
    });

    console.log('Vormindatud treenerid (enne saatmist):', JSON.stringify(formattedTrainers, null, 2));

    res.status(200).json(formattedTrainers);
  } catch (error) {
    handleError(res, error, 'Viga treenerite hankimisel.');
  }
};
