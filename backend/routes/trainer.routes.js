const controller = require('../controllers/trainer.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.get(
    '/api/public/trainers', 
    controller.getAllTrainers
  );
};
