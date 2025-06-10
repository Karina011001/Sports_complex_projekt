// backend/models/rating.model.js
module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define('Hinnang', {
    HinnangudID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'HinnangudID'
    },
    KasutajaID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'KasutajaID'
    },
    TreenerID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'TreenerID'
    },
    Rating: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      },
      field: 'Rating'
    },
    Kommentaar: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      field: 'Kommentaar'
    },
    Kuupäev: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      field: 'Kuupäev'
    }
  }, {
    tableName: 'HINNANGUD',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  return Rating;
};
