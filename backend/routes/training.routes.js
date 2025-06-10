const controller = require('../controllers/training.controller'); 

module.exports = function(app) {
  console.log('Training routes module loaded.'); 
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.get(
    '/api/public/classes',
    (req, res, next) => { 
        console.log('Received request for /api/public/classes');
        next();
    },
    controller.getAllPublicTrainings 
  );
};