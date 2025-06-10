// backend/routes/rating.routes.js
const controller = require('../controllers/rating.controller');
const authJwt = require('../middleware/authJwt');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });

  // Маршрут для создания новой оценки/отзыва (требует авторизации)
  app.post(
    '/api/ratings',
    [authJwt.verifyToken],
    controller.createRating
  );

  // Маршрут для получения всех отзывов для конкретного тренера (публичный)
  app.get(
    '/api/trainers/:trainerId/ratings',
    controller.getTrainerRatings
  );
};