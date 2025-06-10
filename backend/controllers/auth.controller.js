const db = require('../models');
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); 

// Function to register a new user
exports.signup = async (req, res) => {
  console.log('Backend: Registration request received.'); 
  try {
    const { email, password, eesnimi, perekonnanimi, telNr, RollID } = req.body; 
    
    console.log('Backend: req.body content:', req.body);
    console.log('Backend: received email (lowercase):', email); 
    console.log('Backend: received password (first 5 chars):', password ? password.substring(0, 5) + '...' : password); 
    console.log('Backend: received RollID:', RollID); 

    if (!eesnimi || typeof eesnimi !== 'string' || eesnimi.trim() === '') {
        console.error('Backend: First name is empty or missing. Value:', eesnimi); 
        return res.status(400).send({ message: 'First name cannot be empty.' }); 
    }
    if (!perekonnanimi || typeof perekonnanimi !== 'string' || perekonnanimi.trim() === '') {
        console.error('Backend: Last name is empty or missing. Value:', perekonnanimi); 
        return res.status(400).send({ message: 'Last name cannot be empty.' }); 
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      console.error('Backend: Email is empty or missing. Value:', email); 
      return res.status(400).send({ message: 'Email is required.' }); 
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      console.error('Backend: Password is empty or missing.'); 
      return res.status(400).send({ message: 'Password cannot be empty.' }); 
    }

    const SalasõnaHash = bcrypt.hashSync(password, 8); 
    let actualRollID;
    if (RollID !== undefined && RollID !== null) {
      console.log(`Backend: RollID provided in request: ${RollID}`);
      const selectedRole = await Role.findByPk(RollID);
      if (!selectedRole) {
          console.error(`Backend: Selected RollID ${RollID} not found in ROLLID table.`); 
          return res.status(400).send({ message: 'Invalid role selection.' }); 
      }
      actualRollID = RollID;
    } else {
      console.log('Backend: RollID not provided, attempting to use default "kasutaja" role.');
      const defaultRole = await Role.findOne({ where: { Nimetus: 'kasutaja' } });
      if (!defaultRole) {
          console.error('Backend: Default role "kasutaja" not found in ROLLID table.');
          return res.status(500).send({ message: 'Registration error: Default role "kasutaja" not found.' }); 
      }
      actualRollID = defaultRole.RollID;
    }


    const newUser = await User.create({
      Eesnimi: eesnimi.trim(),
      Perekonnanimi: perekonnanimi.trim(),
      Email: email.trim(), 
      Salasõna: SalasõnaHash, 
      TelNr: telNr ? telNr.trim() : null,
      RollID: parseInt(actualRollID) 
    });

    res.status(200).send({ message: 'User successfully registered!' });
  } catch (error) {
    console.error('Backend: Error during registration (signup function):', error); 
    let errorMessage = 'Registration error.'; // Registreerimisviga
    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Email address is already taken. Please use a different email address.'; 
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = 'Error: Cannot assign role. Ensure roles exist in the database.'; 
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.name === 'SequelizeValidationError' && error.errors && error.errors[0] && error.errors[0].type === 'notNull Violation') {
        errorMessage = `Required field "${error.errors[0].path}" cannot be empty.`; 
    }
    res.status(500).send({ message: errorMessage });
  }
};

exports.signin = async (req, res) => {
  console.log('Backend: Sign-in request received.'); 
  console.log('Backend: Request body email:', req.body.email); 
  console.log('Backend: Request body password (first 5 chars):', req.body.password ? req.body.password.substring(0, 5) + '...' : req.body.password); 

  try {
    const user = await User.findOne({
      where: {
        Email: req.body.email 
      }
    });

    if (!user) {
      console.log('Backend: User not found for email:', req.body.email);
      return res.status(404).send({ message: 'User not found.' }); 
    }

    console.log('Backend: User found. User ID:', user.KasutajaID);
    console.log('Backend: User password hash (first 5 chars):', user.Salasõna ? user.Salasõna.substring(0, 5) + '...' : user.Salasõna); 
    console.log('Backend: JWT secret (exists?):', !!config.secret); 

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.Salasõna 
    );

    if (!passwordIsValid) {
      console.log('Backend: Incorrect password for user:', user.Email); 
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid password!' 
      });
    }

    const userRole = await user.getRole();

    if (!userRole) {
        console.log('Backend: Role not found for user:', user.Email, 'User RollID:', user.RollID); 
        return res.status(500).send({ message: 'Error: User role not found.' }); 
    }
    console.log('Backend: User role found:', userRole.Nimetus); 


    const token = jwt.sign(
      { id: user.KasutajaID, role: userRole.Nimetus },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400 
      }
    );

    res.status(200).send({
      id: user.KasutajaID,
      eesnimi: user.Eesnimi,
      perekonnanimi: user.Perekonnanimi,
      email: user.Email, 
      telNr: user.TelNr,
      roll: userRole.Nimetus,
      accessToken: token
    });
  } catch (error) {
    console.error('Backend: Error during sign-in:', error); 
    res.status(500).send({ message: error.message });
  }
};

// NEW FUNCTION: Get all roles
exports.getAllRoles = async (req, res) => {
  console.log('Backend: Role retrieval request received (getAllRoles).'); 
  try {
    const roles = await Role.findAll({
      attributes: ['RollID', 'Nimetus'],
      order: [['Nimetus', 'ASC']], 
      schema: 'sports_complex_2' 
    });
    console.log('Backend: Roles successfully retrieved (getAllRoles). Number of roles:', roles.length); 
    res.status(200).json(roles);
  } catch (error) {
    console.error('Backend: Detailed error retrieving roles (getAllRoles):', error.message); 
    if (error.name === 'SequelizeConnectionError') {
      console.error('Backend: Database connection error during role retrieval.');
      res.status(500).send({ message: 'Database connection error during role retrieval.' }); 
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('Backend: Database error during role retrieval. Check table/column names or schema.');
      res.status(500).send({ message: 'Database error during role retrieval. Please check table/column names or schema.' }); 
    } else {
      res.status(500).send({ message: 'Error retrieving roles.' }); 
    }
  }
};
