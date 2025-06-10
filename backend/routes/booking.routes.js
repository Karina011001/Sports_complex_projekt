const controller = require('../controllers/booking.controller');
const authJwt = require('../middleware/authJwt');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.post(
    '/api/bookings',
    [authJwt.verifyToken], 
    controller.createBooking
  );
  app.get(
    '/api/users/me/bookings', 
    [authJwt.verifyToken],
    controller.getUserBookings
  );
  app.delete(
    '/api/bookings/:id',
    [authJwt.verifyToken],
    controller.cancelBooking
  );
};