module.exports = {
  development: {
    username: "admin",
    password: "123456",
    database: "tinder_dev",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432,
    define: {
      freezeTableName: true
    }
  },
  test: {
    username: "root",
    password: null,
    database: "tinder_test",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432,
    define: {
      freezeTableName: true
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    url: process.env.DB_URL,
    dialect: "postgres",
    define: {
      freezeTableName: true
    }
  }
};
