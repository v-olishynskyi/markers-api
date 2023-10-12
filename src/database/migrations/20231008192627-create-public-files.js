'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('PublicFiles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      user_id: {
        type: Sequelize.STRING,
        foreignKey: true,
      },
      marker_id: {
        type: Sequelize.STRING,
        foreignKey: true,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      url: {
        type: Sequelize.STRING,
      },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserSessions', { cascade: true });
  },
};
