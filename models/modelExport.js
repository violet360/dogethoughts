const Sequelize = require("sequelize");
const dbConfig = require("../db/primarySQL");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;
const { users, posts } = require("./models.js");
database.users = users(sequelize, Sequelize);
database.posts = posts(sequelize, Sequelize);
module.exports = {
    database
}