module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "ihatechemistry1",
    DB: "newdb",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};