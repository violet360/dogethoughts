const session = require('express-session');
const connectRedis = require('connect-redis');
const { redisClient } = require('../db/sessionredis');
const RedisStore = connectRedis(session);

module.exports = session({
  secret: "newsecret",
  key: "cookie",
  saveUninitialized: false,
  resave: false,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 1000 * 60 * 60 // session max age in milliseconds
  }
})

