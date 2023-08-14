'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('UserSessions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      user_id: {
        type: Sequelize.STRING,
        foreignKey: true,
      },
      device: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      app_version: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserSessions', { cascade: true });
  },
};
