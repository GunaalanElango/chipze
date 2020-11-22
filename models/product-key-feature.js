const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ProductKeyFeature = sequelize.define("product_keyfeature", {
  keyFeature: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

module.exports = { ProductKeyFeature };
