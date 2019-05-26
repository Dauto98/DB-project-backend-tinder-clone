const fs = require("fs");
const path = require("path");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, "./sample-data.json"), (err, data) => {
        if (err) {
          return reject(err);
        }
        const userData = JSON.parse(data);
        userData.forEach(user => {
          user.dob = Sequelize.fn("to_timestamp", user.dob);
          user.createdAt = Sequelize.fn("now");
          user.updatedAt = Sequelize.fn("now");
        });
        return queryInterface.bulkInsert("User", userData).then(() => {
          resolve();
        }).catch(err => {
          console.error(err);
          reject(err);
        });
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
