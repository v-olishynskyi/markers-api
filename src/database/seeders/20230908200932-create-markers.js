'use strict';
const usersJson = require('../seed.data/users');
const { faker } = require('@faker-js/faker');

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function createRandomMarker() {
  const date = faker.date
    .soon({
      days: 10,
      refDate: new Date().toISOString(),
    })
    .toISOString();

  const latitude = getRandomInRange(50, 51, 6);
  const longitude = getRandomInRange(30, 31, 6);

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    latitude,
    longitude,
    images: [
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
    ],
    user_id: faker.string.uuid(),
    created_at: date,
    updated_at: date,
  };
}

const markers = faker.helpers.multiple(createRandomMarker, {
  count: 10,
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Markers', [...markers]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete('Markers', null, {});
  },
};
