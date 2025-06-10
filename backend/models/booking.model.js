module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define('Broneering', {
    BroneeringuID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'BroneeringuID'
    },
    KasutajaID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'KasutajaID'
    },
    TreeningID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      field: 'TreeningID'
    },
    SaaliID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      field: 'SaaliID'
    },
    BroneeringuKuupäev: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: false,
      field: 'BroneeringuKuupäev'
    },
    BroneeringuKellaaeg: {
      type: Sequelize.DataTypes.TIME,
      allowNull: true,
      field: 'BroneeringuKellaaeg'
    },
    Staatus: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending',
      field: 'Staatus'
    }
  }, {
    tableName: 'BRONEERINGUD',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  Booking.associate = function(models) {
    Booking.belongsTo(models.User, {
      foreignKey: 'KasutajaID',
      as: 'user'
    });
    Booking.belongsTo(models.Training, {
      foreignKey: 'TreeningID',
      as: 'training'
    });
    Booking.belongsTo(models.Hall, {
      foreignKey: 'SaaliID',
      as: 'hall'
    });
  };

  return Booking;
};
