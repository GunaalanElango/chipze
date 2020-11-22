const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ProductReview = sequelize.define("product_review", {
  comment: {
      type: Sequelize.STRING(100),
      allowNull: true,
  },
  rating: {
      type: Sequelize.INTEGER(10),
      allowNull: true,
  },
  image: {
      type: Sequelize.STRING(100),
      allowNull: true
  },
});

module.exports = { ProductReview };