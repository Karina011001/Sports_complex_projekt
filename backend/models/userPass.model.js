const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPass = sequelize.define('KASUTAJATE_PÄÄSMED', {
    Kasutaja_PääseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'Kasutaja_PääseID'
    },
    KasutajaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'KasutajaID'
    },
    PääsmedID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PääsmedID'
    },
    Ostukuupäev: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'Ostukuupäev'
    },
    Aktiivne: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, 
      field: 'Aktiivne'
    }
  }, {
    tableName: 'KASUTAJATE_PÄÄSMED',
    freezeTableName: true,
    timestamps: false
  });

  return UserPass;
};