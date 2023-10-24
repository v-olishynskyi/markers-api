'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Markers', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: { name: 'id', msg: 'must be unique' },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_draft: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      latitude: { type: Sequelize.DECIMAL, allowNull: false },
      longitude: { type: Sequelize.DECIMAL, allowNull: false },
      user_id: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Markers', { cascade: true });
  },
};
