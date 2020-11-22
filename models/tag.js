const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Tag = sequelize.define("tags", {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },
});

module.exports = { Tag };
