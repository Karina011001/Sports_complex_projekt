const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const User = require('./user.model')(sequelize, Sequelize);
const Role = require('./role.model')(sequelize, Sequelize);
const Trainer = require('./trainer.model')(sequelize, Sequelize);
const Hall = require('./hall.model')(sequelize, Sequelize);
const Pass = require('./pass.model')(sequelize, Sequelize);
const UserPass = require('./userPass.model')(sequelize, Sequelize);
const Training = require('./training.model')(sequelize, Sequelize);
const Booking = require('./booking.model')(sequelize, Sequelize);
const Rating = require('./rating.model')(sequelize, Sequelize);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Role = Role;
db.Trainer = Trainer;
db.Hall = Hall;
db.Pass = Pass;
db.UserPass = UserPass;
db.Training = Training;
db.Booking = Booking;
db.Rating = Rating;

db.User.belongsTo(db.Role, { foreignKey: 'RollID', as: 'role' });
db.Role.hasMany(db.User, { foreignKey: 'RollID', as: 'users' });

db.User.hasOne(db.Trainer, { foreignKey: 'TreenerID', sourceKey: 'KasutajaID', as: 'trainerProfile' });
db.Trainer.belongsTo(db.User, { foreignKey: 'TreenerID', targetKey: 'KasutajaID', as: 'user' });

db.UserPass.belongsTo(db.User, { foreignKey: 'KasutajaID', as: 'user' });
db.User.hasMany(db.UserPass, { foreignKey: 'KasutajaID', as: 'userPasses' });

db.UserPass.belongsTo(db.Pass, { foreignKey: 'PääsmedID', as: 'pass' });
db.Pass.hasMany(db.Pass, { foreignKey: 'PääsmedID', as: 'userPasses' });

db.Training.belongsTo(db.Trainer, { foreignKey: 'TreenerID', as: 'trainer' });
db.Trainer.hasMany(db.Training, { foreignKey: 'TreenerID', as: 'trainings' });

db.Training.belongsTo(db.Hall, { foreignKey: 'SaaliID', as: 'hall' });
db.Hall.hasMany(db.Training, { foreignKey: 'SaaliID', as: 'trainings' });

db.Booking.belongsTo(db.User, { foreignKey: 'KasutajaID', as: 'user' });
db.User.hasMany(db.Booking, { foreignKey: 'KasutajaID', as: 'bookings' });

db.Booking.belongsTo(db.Training, { foreignKey: 'TreeningID', as: 'training' });
db.Training.hasMany(db.Booking, { foreignKey: 'TreeningID', as: 'bookings' });

db.Booking.belongsTo(db.Hall, { foreignKey: 'SaaliID', as: 'hall' });
db.Hall.hasMany(db.Booking, { foreignKey: 'SaaliID', as: 'bookings' });

db.Rating.belongsTo(db.User, { foreignKey: 'KasutajaID', as: 'user' });
db.User.hasMany(db.Rating, { foreignKey: 'KasutajaID', as: 'ratings' });

db.Rating.belongsTo(db.Trainer, { foreignKey: 'TreenerID', as: 'trainer' });
db.Trainer.hasMany(db.Rating, { foreignKey: 'TreenerID', as: 'ratings' });

module.exports = db;
