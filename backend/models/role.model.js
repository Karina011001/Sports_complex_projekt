module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Roll', {
    RollID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'RollID'
    },
    Nimetus: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'Rolli nimi'
    }
  }, {
    tableName: 'ROLL',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  return Role;
};
