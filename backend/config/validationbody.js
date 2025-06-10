const {body} = require('express-validator');

exports.loginValidator = [
  body('username', 'Invalid does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]

exports.createUserValidator = [
  body('username', 'username does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]