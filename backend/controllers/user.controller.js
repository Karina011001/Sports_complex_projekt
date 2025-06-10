const db = require('../models');
const User = db.User;
const Role = db.Role; 
const sequelize = db.sequelize; 
const bcrypt = require('bcryptjs'); 

const handleError = (res, error, message) => {
  console.error(message, error);
  let errorMessage = message;
  if (error.original && error.original.message) {
    errorMessage = error.original.message; 
  } else if (error.message) {
    errorMessage = error.message;
  }
  res.status(500).json({ message: `Serveri viga: ${errorMessage}`, error: error.message });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.sequelize.query(
      `SELECT * FROM sports_complex_2.get_all_users()`,
      {
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    const formattedUsers = users.map(user => ({
      KasutajaID: user.KasutajaID,
      Eesnimi: user.Eesnimi,
      Perekonnanimi: user.Perekonnanimi,
      TelNr: user.TelNr,
      Email: user.email, 
      role: {
        RollID: user.RollID,
        Nimetus: user['Rolli nimi'] || user.RolliNimi || user.Roll_Nimetus || 'Tundmatu' 
      }
    }));
    res.status(200).json(formattedUsers);
  } catch (error) {
    handleError(res, error, 'Viga kasutajate hankimisel funktsiooni kaudu.');
  }
};

exports.createUser = async (req, res) => {
  try {
    const { Eesnimi, Perekonnanimi, TelNr, email, Salasõna, RollID } = req.body;

    const hashedPassword = await bcrypt.hash(Salasõna, 10);

    await db.sequelize.query(
      `CALL sports_complex_2.add_kasutaja(:p_eesnimi, :p_perekonnanimi, :p_tel_nr, :p_email, :p_password_hash, :p_roll_id)`,
      {
        replacements: {
          p_eesnimi: Eesnimi,
          p_perekonnanimi: Perekonnanimi,
          p_tel_nr: TelNr,
          p_email: email,
          p_password_hash: hashedPassword,
          p_roll_id: parseInt(RollID) 
        },
        type: db.sequelize.QueryTypes.RAW 
      }
    );

    res.status(201).json({ message: 'Kasutaja edukalt loodud!' });
  } catch (error) {
    handleError(res, error, 'Viga kasutaja loomisel protseduuri kaudu.');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Eesnimi, Perekonnanimi, TelNr, email, Salasõna, RollID } = req.body;

    const currentUser = await User.findByPk(id, { schema: 'sports_complex_2' });
    if (!currentUser) {
        return res.status(404).send({ message: 'Kasutajat ei leitud!' });
    }

    if (email && email !== currentUser.Email) {
        const existingUserWithEmail = await User.findOne({ where: { Email: email }, schema: 'sports_complex_2' });
        if (existingUserWithEmail && existingUserWithEmail.KasutajaID !== currentUser.KasutajaID) {
            return res.status(409).send({ message: 'E-posti aadress on juba kasutusel teise kasutaja poolt!' });
        }
    }

    let hashedPassword = currentUser.Salasõna; 
    if (Salasõna) {
      hashedPassword = await bcrypt.hash(Salasõna, 10);
    }

    await db.sequelize.query(
      `CALL sports_complex_2.update_kasutaja(:p_kasutaja_id, :p_eesnimi, :p_perekonnanimi, :p_tel_nr, :p_email, :p_password_hash, :p_roll_id)`,
      {
        replacements: {
          p_kasutaja_id: parseInt(id), 
          p_eesnimi: Eesnimi,
          p_perekonnanimi: Perekonnanimi,
          p_tel_nr: TelNr,
          p_email: email,
          p_password_hash: hashedPassword, 
          p_roll_id: parseInt(RollID) 
        },
        type: db.sequelize.QueryTypes.RAW
      }
    );
    
    res.status(200).json({ message: 'Kasutaja edukalt uuendatud!' });
  } catch (error) {
    handleError(res, error, 'Viga kasutaja uuendamisel protseduuri kaudu.');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.sequelize.query(
      `CALL sports_complex_2.delete_kasutaja(:p_kasutaja_id)`,
      {
        replacements: { p_kasutaja_id: parseInt(id) }, 
        type: db.sequelize.QueryTypes.RAW
      }
    );
    res.status(200).json({ message: 'Kasutaja edukalt kustutatud!' });
  } catch (error) {
    handleError(res, error, 'Viga kasutaja kustutamisel protseduuri kaudu.');
  }
};
