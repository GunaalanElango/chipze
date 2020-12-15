const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Order = sequelize.define("order", {
  status: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  totalPrice: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

const OrderProduct = sequelize.define("order_product", {
  quantity: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  totalPrice: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

module.exports = { Order, OrderProduct };
