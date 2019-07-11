// Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    // connection: process.env.POSTGRES_URL,
    // connection: {
    //   host : 'localhost',
    //   user : 'postgres',
    //   password : 'postgresPASS',
    //   database : 'sauti-studio',
    // },
    connection: {
      host : process.env.POSTGRES_HOST,
      user : process.env.POSTGRES_USER,
      password : process.env.POSTGRES_PASSWORD,
      database : process.env.POSTGRES_DATABASE_NAME,
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
    useNullAsDefault: true,
  },
};
