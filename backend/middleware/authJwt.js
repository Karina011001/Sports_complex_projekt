const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.User;
const Role = db.Role;

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); 
  }

  if (!token) {
    console.log("verifyToken: Tokenit pole esitatud!");
    return res.status(403).send({ message: "Tokenit pole esitatud!" });
  }

  console.log("verifyToken: Saadud token: " + (token ? "JAH" : "EI"));

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.error("verifyToken: Tokeni kontrollimise viga:", err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ message: "Volitamata! Ligipääsutoken on aegunud!" });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: "Volitamata! Vigane allkiri või rikutud token!" });
      }
      return res.status(401).send({ message: "Volitamata!" }); 
    }

    req.userId = decoded.id;
    req.userRole = decoded.role; 
    console.log("verifyToken: Token dekodeeritud. Kasutaja ID:", req.userId, "Roll tokenist:", req.userRole);
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  const userId = req.userId;
  const userRoleFromToken = req.userRole;

  if (!userId) {
    console.error("isAdmin: Kasutaja ID-d ei leitud päringust pärast tokeni kontrollimist.");
    return res.status(401).send({ message: "Volitamata! Kasutaja ID-d ei leitud." });
  }

  console.log("isAdmin: Administraatori rolli kontrollimine...");
  console.log("isAdmin: Kasutaja ID tokenist:", userId);
  console.log("isAdmin: Kasutaja roll tokenist:", userRoleFromToken);

  try {
    if (userRoleFromToken === 'admin') {
      next();
      return;
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['RolliNimi']
      }]
    });

    if (!user) {
      console.error("isAdmin: Kasutajat ei leitud andmebaasist ID-ga:", userId);
      return res.status(404).send({ message: "Kasutajat ei leitud." });
    }

    if (user.role && user.role.RolliNimi === 'admin') {
      next();
    } else {
      console.error("isAdmin: Ligipääs keelatud. Kasutaja pole administraator. Roll:", user.role ? user.role.RolliNimi : 'N/A');
      return res.status(403).send({ message: "Nõutav administraatori roll!" });
    }
  } catch (error) {
    console.error("Viga administraatori rolli kontrollimisel isAdminis:", error);
    return res.status(500).send({ message: error.message || "Administraatori rolli ei saa kontrollida." });
  }
};
