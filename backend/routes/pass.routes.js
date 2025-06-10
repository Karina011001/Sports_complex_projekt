// src/routes/pass.routes.js
const controller = require('../controllers/pass.controller');
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authJwt');

// Marsruudid pääsmetele
router.post('/passes', [verifyToken, isAdmin], controller.createPass); // Loo pääse (ainult admin)
router.get('/passes', controller.getAllPasses); // Hanki kõik pääsmed (kõigile ligipääs)
router.get('/passes/:id', controller.getPassById); // Hanki pääse ID järgi (kõigile ligipääs)
router.put('/passes/:id', [verifyToken, isAdmin], controller.updatePass); // Uuenda pääset (ainult admin)
router.delete('/passes/:id', [verifyToken, isAdmin], controller.deletePass); // Kustuta pääse (ainult admin)

module.exports = router;