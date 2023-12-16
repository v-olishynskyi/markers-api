'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Groups', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { name: 'name', msg: 'must be unique' },
      },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('Groups', { cascade: true });
  },
};
