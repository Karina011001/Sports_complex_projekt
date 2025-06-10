module.exports = (sequelize, Sequelize) => {
  const Trainer = sequelize.define('Treener', {
    TreenerID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      field: 'TreenerID'
    },
    Info: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      field: 'Info'
    }
  }, {
    tableName: 'TREENER',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  return Trainer;
};
