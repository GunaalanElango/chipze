const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Category = sequelize.define("categories", {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
  },
});

module.exports = { Category };
