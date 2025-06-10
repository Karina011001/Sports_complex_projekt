// backend/models/hall.model.js
module.exports = (sequelize, Sequelize) => {
  const Hall = sequelize.define('Hall', {
    SaaliID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'SaaliID'
    },
    Nimetus: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      field: 'Nimetus'
    },
    Kirjeldus: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      field: 'Kirjeldus'
    },
    Mahutavus: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      field: 'Mahtuvus'
    },
    tunniHind: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'HindTunnis'
    },
    Pilt: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      field: 'Pilt'
    }
  }, {
    tableName: 'SAALID',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  return Hall;
};
