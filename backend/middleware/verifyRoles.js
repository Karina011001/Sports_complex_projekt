const db = require("../models");
const User = db.User;
const Role = db.Role; 

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      console.log("VerifyRoles: Kasutajat ID-ga", req.userId, "ei leitud.");
      return res.status(403).send({ message: "Administraatori roll on vajalik! Kasutajat ei leitud." });
    }

    const role = await user.getRole();

    if (!role) {
      console.log("VerifyRoles: Rolli ei leitud kasutaja ID-le:", req.userId, "Kasutaja RollID:", user.RollID);
      return res.status(403).send({ message: "Administraatori roll on vajalik! Kasutaja rolli ei määratud." });
    }

    if (role.Nimetus === "admin") { 
      next();
    } else {
      console.log("VerifyRoles: Kasutaja ID", req.userId, "roll on", role.Nimetus, ", kuid vajalik on 'admin'.");
      res.status(403).send({ message: "Administraatori roll on vajalik!" });
    }
  } catch (error) {
    console.error("Viga administraatori rolli kontrollimisel:", error);
    res.status(500).send({ message: "Viga administraatori rolli kontrollimisel: " + error.message });
  }
};

exports.isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(403).send({ message: "Moderaatori roll on vajalik! Kasutajat ei leitud." });
    }
    const role = await user.getRole();
    if (role && role.Nimetus === "moderator") { 
      next();
    } else {
      res.status(403).send({ message: "Moderaatori roll on vajalik!" });
    }
  } catch (error) {
    console.error("Viga moderaatori rolli kontrollimisel:", error);
    res.status(500).send({ message: "Viga moderaatori rolli kontrollimisel." });
  }
};

exports.isTrainer = async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(403).send({ message: "Treeneri roll on vajalik! Kasutajat ei leitud." });
      }
      const role = await user.getRole();
      if (role && role.Nimetus === "treener") { 
        next();
      } else {
        res.status(403).send({ message: "Treeneri roll on vajalik!" });
      }
    } catch (error) {
      console.error("Viga treeneri rolli kontrollimisel:", error);
      res.status(500).send({ message: "Viga treeneri rolli kontrollimisel." });
    }
  };
