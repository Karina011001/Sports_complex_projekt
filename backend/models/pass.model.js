const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pass = sequelize.define('PÄÄSMED', {
    PääsmedID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'PääsmedID'
    },
    Nimetus: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Nimetus'
    },
    Kirjeldus: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Kirjeldus'
    },
    Hind: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      field: 'Hind'
    },
    Kehtivuse_algus: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      field: 'Kehtivuse_algus'
    },
    Kehtivuse_lõpp: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'Kehtivuse_lõpp'
    }
  }, {
    tableName: 'PÄÄSMED',
    freezeTableName: true,
    timestamps: false
  });

  return Pass;
};