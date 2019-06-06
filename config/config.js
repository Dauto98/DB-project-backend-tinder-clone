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
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    define: {
      freezeTableName: true
    }
  }
};
