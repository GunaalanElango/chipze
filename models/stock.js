const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Stock = sequelize.define("stocks", {
  available: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  allocated: {
    type: Sequelize.TEXT({ length: "medium" }),
    allowNull: true,
  },
  sold: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  minimumQuantity: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
    defaultValue: 1,
  },
  maximumQuantity: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },
});

module.exports = { Stock };