const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year_written", {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1991,
          msg: "yearWritten must be greater or equal to 1991",
        },
        max: {
          args: new Date().getFullYear(),
          msg: `yearWritten must be less or equal to ${new Date().getFullYear()}`,
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year_written");
  },
};
