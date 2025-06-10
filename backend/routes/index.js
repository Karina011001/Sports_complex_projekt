const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const hallController = require('../controllers/hall.controller');
const trainerController = require('../controllers/trainer.controller');
const bookingController = require('../controllers/booking.controller'); 

const { verifyToken, isAdmin } = require('../middleware/authJwt');


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

router.get('/user/profile', [verifyToken], authController.userProfile);

router.get('/admin/halls', [verifyToken, isAdmin], hallController.getAllHalls);
router.post('/admin/halls', [verifyToken, isAdmin], hallController.createHall);
router.put('/admin/halls/:id', [verifyToken, isAdmin], hallController.updateHall);
router.delete('/admin/halls/:id', [verifyToken, isAdmin], hallController.deleteHall);

router.post('/admin/trainers', [verifyToken, isAdmin], trainerController.createTrainer);
router.get('/admin/trainers', [verifyToken, isAdmin], trainerController.getAllTrainers); 
router.put('/admin/trainers/:id', [verifyToken, isAdmin], trainerController.updateTrainer);
router.delete('/admin/trainers/:id', [verifyToken, isAdmin], trainerController.deleteTrainer);
router.post('/admin/trainers/:id/rating', [verifyToken, isAdmin], trainerController.addRating); 

router.get('/public/halls', hallController.getAllHallsPublic);
router.get('/public/trainers', trainerController.getAllTrainersPublic); 

router.post('/bookings', [verifyToken], bookingController.createBooking); 
router.get('/bookings/me', [verifyToken], bookingController.getUserBookings); 

module.exports = router;
