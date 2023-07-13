'use strict';
const users = require('../seed.data/users');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'users',
      users.map((user) => ({
        ...user,
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete('users', null, {});
  },
};
