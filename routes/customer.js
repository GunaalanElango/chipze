const router = require("express").Router();
const { Product } = require("../models/product");
const { ProductDesc } = require("../models/product-desc");
const { ProductKeyFeature } = require("../models/product-key-feature");
const { Stock } = require("../models/stock");
const { ProductImage } = require("../models/product-image");
const { Specification } = require("../models/specification");
const { CartProduct } = require("../models/cart-product");
const chalk = require("chalk");
const { SubCategory } = require("../models/sub-category");
const { Category } = require("../models/category");

router.get("/product-detail-home/:productId", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: ProductDesc,
          required: false,
        },
        {
          model: SubCategory,
          required: false,
        },
        {
          model: ProductKeyFeature,
          required: false,
        },
        {
          model: Specification,
          required: false,
        },
        {
          model: Stock,
          required: false,
        },
        {
          model: ProductImage,
          required: false,
        },
      ],
    });
    const {
      product_descriptions,
      product_keyfeatures,
      specifications,
      stocks,
      product_images,
    } = product.toJSON();
    res.render("product_detail", {
      stock: stocks[0],
      descriptions: product_descriptions,
      keyFeatures: product_keyfeatures,
      images: product_images,
      specifications,
      product: product.toJSON(),
    });
  } catch (error) {
    console.log(chalk.greenBright(error));
  }
});

router.get("/product-page", async (req, res, next) => {
  res.render("product", {});
});

router.post("/search-result", async (req, res, next) => {
  res.render("search_results", {});
});

router.get("/index", async (req, res, next) => {
  const products = await Product.findAll({
    limit: 6,
  });
  const laptops = await Product.findAll({
    where: { subCategoryName: "Laptop" },
    limit: 6,
  });
  res.render("index", { products, laptops });
});

router.get("/checkout-cart", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll({
    include: [
      {
        model: Product,
        required: false,
      },
    ],
  });
  res.render("checkout_cart", { cartProducts });
});

router.post("/add-to-cart/:productId", async (req, res, next) => {
  const product = await Product.findByPk(req.params.productId);
  const createCart = await CartProduct.create({
    productId: req.params.productId,
    totalPrice: product.sellingPrice,
  });
  res.redirect("/customer/checkout-cart");
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
