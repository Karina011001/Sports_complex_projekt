const controller = require('../controllers/userPass.controller');
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isUser } = require('../middleware/authJwt');

router.post('/user-passes', [verifyToken, isAdmin], controller.createUserPass); 
router.get('/user-passes', [verifyToken, isAdmin], controller.getAllUserPasses); 
router.get('/user-passes/:id', [verifyToken, isAdmin], controller.getUserPassById); 
router.put('/user-passes/:id/status', [verifyToken, isAdmin], controller.updateUserPassStatus); 
router.delete('/user-passes/:id', [verifyToken, isAdmin], controller.deleteUserPass); 

router.get('/user-passes/view/overview', [verifyToken, isAdmin], controller.getKasutajaPaasmedViewData); 


module.exports = router;