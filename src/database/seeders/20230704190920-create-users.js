'use strict';
const usersJson = require('../seed.data/users');
const { faker } = require('@faker-js/faker');

function createRandomUser() {
  const date = faker.date
    .soon({
      days: 10,
      refDate: new Date().toISOString(),
    })
    .toISOString();

  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    avatar_url: faker.internet.avatar(),
    middle_name: faker.person.middleName(),
    password: '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
    username: faker.internet.userName(),
    created_at: date,
    updated_at: date,
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 200,
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [...users, ...usersJson]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete('Users', null, {});
  },
};
