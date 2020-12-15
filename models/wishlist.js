const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const WishList = sequelize.define("wishlist");

module.exports = { WishList };
