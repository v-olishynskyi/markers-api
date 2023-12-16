'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('GroupUsers', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      user_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        unique: { name: 'id', msg: 'must be unique' },
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      group_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        unique: { name: 'id', msg: 'must be unique' },
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('GroupUsers', { cascade: true });
  },
};
