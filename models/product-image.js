const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ProductImage = sequelize.define("product_image", {
  extraImage: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

module.exports = { ProductImage };
