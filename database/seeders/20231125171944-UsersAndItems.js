"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        id: "632260979148718084",
      },
      {
        id: "218940068805607424",
      },
      {
        id: "784565788073656340",
      },
      {
        id: "745478694906101871",
      },
    ]);

    await queryInterface.bulkInsert("Items", [
      {
        name: "apple",
        price: 10,
        description: "an apple",
        tier: "1",
        type: "consumable",
      },
      {
        name: "orange",
        price: 10,
        description: "an orange",
        tier: "1",
        type: "consumable",
      },
      {
        name: "banana",
        price: 10,
        description: "a banana",
        tier: "1",
        type: "consumable",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Items", null, {});
  },
};
