module.exports = {
    "development": {
      "username": "admin",
      "password": '123456',
      "database": "chatapp",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port" : 5432
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }