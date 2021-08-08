const sequelize = require("./../database/database");
const Sequelize = require("sequelize");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// link model
db.Location = require("./Location")(sequelize, Sequelize);

module.exports = db;