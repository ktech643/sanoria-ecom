require('dotenv').config();

/**
 * Knex configuration
 * Using SQLite for local development. For production, switch to Postgres/MySQL.
 */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.SQLITE_FILE || './data/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
  },
};