const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const SubCategory = sequelize.define("subcategories", {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },
});

module.exports = { SubCategory };
