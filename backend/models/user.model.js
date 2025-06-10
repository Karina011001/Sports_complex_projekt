module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('Kasutaja', {
    KasutajaID: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'KasutajaID'
    },
    Eesnimi: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      field: 'Eesnimi'
    },
    Perekonnanimi: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      field: 'Perekonnanimi'
    },
    TelNr: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      field: 'TelNr'
    },
    Email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'email'
    },
    Salasõna: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      field: 'Salasõna'
    },
    RollID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: 'RollID',
      references: {
        model: 'ROLLID',
        key: 'RollID'
      }
    }
  }, {
    tableName: 'KASUTAJA',
    timestamps: false,
    schema: 'sports_complex_2'
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'RollID',
      as: 'Role'
    });
  };

  return User;
};
