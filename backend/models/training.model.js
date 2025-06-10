module.exports = (sequelize, Sequelize) => {
  const Training = sequelize.define('Training', {
    TreeningID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'TreeningID'
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
    BroneeringuKuupäev: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: false,
      field: 'BroneeringuKuupäev'
    },
    Kellaaeg: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      field: 'Kellaaeg'
    },
    TreenerID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'TreenerID',
      references: {
        model: 'TREENER',
        key: 'TreenerID'
      }
    },
    SaaliID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'SaaliID',
      references: {
        model: 'SAALID',
        key: 'SaaliID'
      }
    }
  }, {
    tableName: 'TREENING',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  return Training;
};
