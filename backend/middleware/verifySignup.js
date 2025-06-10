const db = require("../models");
const User = db.User;
const Role = db.Role;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        Email: req.body.email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Viga: E-post on juba kasutusel!"
      });
    }

    next();
  } catch (error) {
    console.error("Viga e-posti duplikaadi kontrollimisel:", error);
    res.status(500).send({
      message: "E-posti ei õnnestunud kontrollida!"
    });
  }
};

const checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    const roles = await Role.findAll();
    const availableRoles = roles.map(role => role.Nimetus);
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!availableRoles.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Viga: Roll ${req.body.roles[i]} puudub! Saadaolevad rollid: ${availableRoles.join(', ')}`
        });
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
