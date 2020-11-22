const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ProductDesc = sequelize.define("product_description", {
  name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  value: {
    type: Sequelize.TEXT({ length: "long" }),
    allowNull: true,
  },
});

module.exports = { ProductDesc };
