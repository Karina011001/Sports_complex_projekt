const db = require('../models');
const Rating = db.Rating;
const User = db.User;
const Trainer = db.Trainer;

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

exports.createRating = async (req, res) => {
  try {
    const { TreenerID, Rating: userRatingValue, Kommentaar } = req.body;
    const KasutajaID = req.userId; 

    if (!KasutajaID) {
      return res.status(401).send({ message: 'Autoriseerimine on tagasiside loomiseks vajalik!' });
    }

    const trainerExists = await Trainer.findByPk(TreenerID);
    if (!trainerExists) {
      return res.status(404).send({ message: 'Treenerit ei leitud.' });
    }

    const existingRating = await Rating.findOne({
      where: {
        KasutajaID: KasutajaID,
        TreenerID: TreenerID
      },
      schema: 'sports_complex_2'
    });

    if (existingRating) {
      return res.status(409).send({ message: 'Olete juba sellele treenerile tagasisidet andnud. Saate seda uuendada.' });
    }

    const newRating = await Rating.create({
      KasutajaID,
      TreenerID,
      Rating: parseInt(userRatingValue),
      Kommentaar,
      Kuupäev: new Date()
    }, { schema: 'sports_complex_2' });

    res.status(201).json({ message: 'Tagasiside edukalt lisatud!', rating: newRating });
  } catch (error) {
    handleError(res, error, 'Viga tagasiside loomisel.');
  }
};

exports.getTrainerRatings = async (req, res) => {
  try {
    const { trainerId } = req.params; 

    const trainerExists = await Trainer.findByPk(trainerId);
    if (!trainerExists) {
      return res.status(404).send({ message: 'Treenerit ei leitud.' });
    }

    const ratings = await Rating.findAll({
      where: { TreenerID: trainerId },
      include: [
        {
          model: User,
          as: 'user', 
          attributes: ['Eesnimi', 'Perekonnanimi'] 
        }
      ],
      order: [['Kuupäev', 'DESC']],
      schema: 'sports_complex_2'
    });

    res.status(200).json(ratings);
  } catch (error) {
    handleError(res, error, 'Viga treeneri tagasiside hankimisel.');
  }
};

exports.getAverageTrainerRating = async (req, res) => {
    try {
        const { trainerId } = req.params;

        const result = await Rating.findOne({
            attributes: [
                [db.sequelize.fn('AVG', db.sequelize.col('Rating')), 'averageRating'],
                [db.sequelize.fn('COUNT', db.sequelize.col('HinnangudID')), 'reviewCount']
            ],
            where: { TreenerID: trainerId },
            group: ['TreenerID'], 
            schema: 'sports_complex_2'
        });

        if (!result) {
            return res.status(200).json({ averageRating: '0.0', reviewCount: 0 });
        }

        res.status(200).json({
            averageRating: parseFloat(result.dataValues.averageRating).toFixed(1),
            reviewCount: parseInt(result.dataValues.reviewCount)
        });

    } catch (error) {
        handleError(res, error, 'Viga treeneri keskmise hinde hankimisel.');
    }
};
