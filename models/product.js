const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Product = sequelize.define("product", {
  name: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  indexImage: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  originalPrice: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },
  discountPercentage: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },
  sellingPrice: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },
  productId: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
    unique: true,
  },
  rating: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
    defaultValue: 1,
  },
});

module.exports = { Product };
