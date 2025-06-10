const controller = require('../controllers/hall.controller');
const authJwt = require('../middleware/authJwt');

module.exports = function(app) {

  console.log('Hall routes module loaded.');
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.get(
    '/api/admin/halls',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllHalls
  );

  app.post(
    '/api/admin/halls',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createHall
  );

  app.put(
    '/api/admin/halls/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateHall
  );

  app.delete(
    '/api/admin/halls/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteHall
  );
  app.get(
    '/api/public/halls', 
    (req, res, next) => { 
      console.log('Received request for /api/public/halls');
      next();
    },
    controller.getAllHallsPublic 
  );
};