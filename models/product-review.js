const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ProductReview = sequelize.define("product_review", {
  comment: {
    type: Sequelize.TEXT({ length: "long" }),
    allowNull: true,
  },
  rating: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },
  date: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  title: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

module.exports = { ProductReview };
