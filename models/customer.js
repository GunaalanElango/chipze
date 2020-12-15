const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Customer = sequelize.define("customers", {
  name: {
    type: Sequelize.STRING(500),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  emailVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  alternatePhoneNumber: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  district: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  pincode: {
    type: Sequelize.INTEGER(6),
    allowNull: true,
  },
  type: {
    type: Sequelize.ENUM(["customer", "admin"]),
    allowNull: true,
    defaultValue: "customer",
  },
});

module.exports = { Customer };
