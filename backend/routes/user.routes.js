// backend/routes/user.routes.js
const controller = require('../controllers/user.controller');
const authJwt = require('../middleware/authJwt');

module.exports = function(app) { 
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.get(
    '/api/admin/users',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.post(
    '/api/admin/users',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createUser
  );

  app.put(
    '/api/admin/users/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUser
  );

  app.delete(
    '/api/admin/users/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
};