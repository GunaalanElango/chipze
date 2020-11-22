const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const CartProduct = sequelize.define("cart_products", {
  quantity: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
  },
});

module.exports = { CartProduct };