const router = require("express").Router();
const { Product } = require("../models/product");
const { ProductImage } = require("../models/product-image");
const { Specification } = require("../models/specification");
const { CartProduct } = require("../models/cart-product");


router.get("/product-detail-home/:productId", async (req, res, next) => {
  res.render("product_detail", {});
});

router.get("/product-page", async (req, res, next) => {
  res.render("product", {});
});

router.post("/search-result", async (req, res, next) => {
  res.render("search_results", {});
});

router.get("/index", async (req, res, next) => {
  res.render("index", {});
});

router.get("/checkout-cart", async (req, res, next) => {
  res.render("checkout_cart", {});
});

router.get("/checkout-info", async (req, res, next) => {
  res.render("checkout_info", {});
});

router.get("/checkout-complete", async (req, res, next) => {
  res.render("checkout_complete", {});
});

router.get("/checkout-payment", async (req, res, next) => {
  res.render("checkout_payment", {});
});

router.get("/about-us", async (req, res, next) => {
  res.render("about_us", {});
});

router.get("/register", async (req, res, next) => {
  res.render("register", {});
});

router.get("/login", async (req, res, next) => {
  res.render("login", {});
});

module.exports = router;
