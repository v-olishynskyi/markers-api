'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { name: 'email', msg: 'must be unique' },
      },
      password: { type: Sequelize.STRING, allowNull: false, unique: false },
      first_name: { type: Sequelize.STRING, allowNull: false, unique: false },
      last_name: { type: Sequelize.STRING, allowNull: false, unique: false },
      username: { type: Sequelize.STRING, allowNull: true, unique: true },
      middle_name: { type: Sequelize.STRING, allowNull: false, unique: false },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users', { cascade: true });
  },
};
