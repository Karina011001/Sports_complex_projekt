const db = require('../models');
const Hall = db.Hall;
const { Op } = require('sequelize');

const handleError = (res, error, message) => {
    console.error(message, error);
    let errorMessage = message;
    if (error.original && error.original.message) {
        errorMessage = error.original.message;
        if (error.original.hint) {
            errorMessage += ` Vihje: ${error.original.hint}`;
        }
    } else if (error.message) {
        errorMessage = error.message;
    }
    res.status(500).json({ message: `Serveri viga: ${errorMessage}`, error: error.message });
};

exports.getAllHalls = async (req, res) => {
    try {
        const halls = await db.sequelize.query(
            `SELECT * FROM sports_complex_2.get_all_halls()`,
            {
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(halls);
    } catch (error) {
        handleError(res, error, 'Viga saalide hankimisel funktsiooni kaudu.');
    }
};

exports.createHall = async (req, res) => {
    try {
        const { Nimetus, Kirjeldus, Mahtuvus, tunniHind, Pilt } = req.body;

        await db.sequelize.query(
            `CALL sports_complex_2.add_saal(:p_nimetus, :p_kirjeldus, :p_mahtuvus, :p_hind_tunnis, :p_pilt)`,
            {
                replacements: {
                    p_nimetus: Nimetus,
                    p_kirjeldus: Kirjeldus,
                    p_mahtuvus: Mahtuvus ? parseInt(Mahtuvus) : null,
                    p_hind_tunnis: tunniHind ? parseFloat(tunniHind) : null,
                    p_pilt: Pilt || null
                },
                type: db.sequelize.QueryTypes.RAW
            }
        );

        res.status(201).json({ message: 'Saal edukalt loodud!' });
    } catch (error) {
        handleError(res, error, 'Viga saali loomisel protseduuri kaudu.');
    }
};

exports.updateHall = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nimetus, Kirjeldus, Mahtuvus, tunniHind, Pilt } = req.body;

        // Kontrolli, kas saal eksisteerib enne uuendamist
        const hallExists = await Hall.findByPk(id, { schema: 'sports_complex_2' });
        if (!hallExists) {
            return res.status(404).send({ message: 'Saali ei leitud!' });
        }

        await db.sequelize.query(
            `CALL sports_complex_2.update_saal(:p_saali_id, :p_nimetus, :p_kirjeldus, :p_mahtuvus, :p_hind_tunnis, :p_pilt)`,
            {
                replacements: {
                    p_saali_id: parseInt(id),
                    p_nimetus: Nimetus,
                    p_kirjeldus: Kirjeldus,
                    p_mahtuvus: Mahtuvus ? parseInt(Mahtuvus) : null,
                    p_hind_tunnis: tunniHind ? parseFloat(tunniHind) : null,
                    p_pilt: Pilt || null
                },
                type: db.sequelize.QueryTypes.RAW
            }
        );

        res.status(200).json({ message: 'Saal edukalt uuendatud!' });
    } catch (error) {
        handleError(res, error, 'Viga saali uuendamisel protseduuri kaudu.');
    }
};

exports.deleteHall = async (req, res) => {
    try {
        const { id } = req.params;

        await db.sequelize.query(
            `CALL sports_complex_2.delete_saal(:p_saali_id)`,
            {
                replacements: { p_saali_id: parseInt(id) },
                type: db.sequelize.QueryTypes.RAW
            }
        );
        res.status(200).json({ message: 'Saal edukalt kustutatud!' });
    } catch (error) {
        handleError(res, error, 'Viga saali kustutamisel protseduuri kaudu.');
    }
};

exports.getAllHallsPublic = async (req, res) => {
    try {
        const halls = await Hall.findAll({
            attributes: ['SaaliID', 'Nimetus', 'Kirjeldus', 'Mahtuvus', 'tunniHind', 'Pilt'],
            order: [['SaaliID', 'ASC']],
            schema: 'sports_complex_2'
        });
        res.status(200).json(halls);
    } catch (error) {
        handleError(res, error, 'Viga avalike saalide hankimisel.');
    }
};
