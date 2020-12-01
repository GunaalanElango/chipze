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
const { Customer } = require("../models/customer");
const { Op } = require("sequelize");

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
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    let isAuthenticated = req.session.isLoggedIn;
    res.render("product_detail", {
      stock: stocks[0],
      descriptions: product_descriptions,
      keyFeatures: product_keyfeatures,
      images: product_images,
      specifications,
      product: product.toJSON(),
      totalCartItems: cartProducts.length,
      isAuthenticated,
    });
  } catch (error) {
    console.log(chalk.greenBright(error));
  }
});

router.get("/product-page", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
  });
  let isAuthenticated = req.session.isLoggedIn;
  res.render("product", {
    totalCartItems: cartProducts.length,
    isAuthenticated,
  });
});

router.post("/search-result", async (req, res, next) => {
  let isAuthenticated = req.session.isLoggedIn;
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
  });
  const searchValues = req.body.searchValue.split(" ");
  let products = [];
  for (let searchValue of searchValues) {
    const prod = await Product.findAll({
      where: { name: { [Op.substring]: searchValue } },
    });
    for (let p of prod) {
      const pr = products.find((product) => {
        return product.id === p.id;
      });
      if (!pr) {
        products.push(p.toJSON());
      }
    }
  }
  res.render("search_results", {
    totalCartItems: cartProducts.length,
    searchValue: req.body.searchValue,
    products: products,
    isAuthenticated,
  });
});

router.get("/index", async (req, res, next) => {
  const products = await Product.findAll({
    limit: 6,
  });
  const laptops = await Product.findAll({
    where: { subCategoryName: "Laptop" },
    limit: 6,
  });
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
  });
  let isAuthenticated = req.session.isLoggedIn;
  res.render("index", {
    products,
    laptops,
    totalCartItems: cartProducts.length,
    isAuthenticated,
  });
});

router.get("/checkout-cart", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
    include: [
      {
        model: Product,
        required: false,
      },
    ],
  });
  let totalCartPrice = 0;
  for (let cart of cartProducts) {
    totalCartPrice += cart.totalPrice;
  }
  let isAuthenticated = req.session.isLoggedIn;
  res.render("checkout_cart", {
    cartProducts,
    totalCartItems: cartProducts.length,
    totalCartPrice,
    isAuthenticated,
  });
});

router.post("/add-to-cart/:productId", async (req, res, next) => {
  const product = await Product.findByPk(req.params.productId);
  const createCart = await CartProduct.create({
    customerId: req.session.customerId,
    productId: req.params.productId,
    totalPrice: product.sellingPrice,
  });
  res.redirect("/customer/checkout-cart");
});

router.get("/remove-from-cart/:cartProductId", async (req, res, next) => {
  await CartProduct.destroy({
    where: { id: req.params.cartProductId },
  });
  res.redirect("/customer/checkout-cart");
});

router.get("/increase-qty/:cartProductId", async (req, res, next) => {
  const cartProduct = await CartProduct.findByPk(req.params.cartProductId);
  const product = await Product.findByPk(cartProduct.productId);
  if (cartProduct.quantity >= 2) {
    return res.redirect("/customer/checkout-cart");
  }
  cartProduct.quantity += 1;
  cartProduct.totalPrice += product.sellingPrice;
  cartProduct.save();
  res.redirect("/customer/checkout-cart");
});

router.get("/decrease-qty/:cartProductId", async (req, res, next) => {
  const cartProduct = await CartProduct.findByPk(req.params.cartProductId);
  const product = await Product.findByPk(cartProduct.productId);
  if (cartProduct.quantity <= 1) {
    return res.redirect("/customer/checkout-cart");
  }
  cartProduct.quantity -= 1;
  cartProduct.totalPrice -= product.sellingPrice;
  cartProduct.save();
  res.redirect("/customer/checkout-cart");
});

router.post("/checkout-info", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll();
  let isAuthenticated = req.session.isLoggedIn;
  res.render("checkout_info", {
    totalCartItems: cartProducts.length,
    isAuthenticated,
  });
});

router.post("/checkout-complete", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
  });
  let isAuthenticated = req.session.isLoggedIn;
  res.render("checkout_complete", {
    totalCartItems: cartProducts.length,
    isAuthenticated,
  });
});

router.post("/checkout-payment", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll({
    where: { customerId: req.session.customerId },
  });
  let isAuthenticated = req.session.isLoggedIn;
  console.log(req.body);
  res.render("checkout_payment", {
    totalCartItems: cartProducts.length,
    isAuthenticated,
  });
});

router.get("/about-us", async (req, res, next) => {
  res.render("about_us", {});
});

router.get("/register", async (req, res, next) => {
  res.render("register", {});
});

router.post("/register", async (req, res, next) => {
  const createCustomer = await Customer.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  req.session.isLoggedIn = true;
  req.session.customerId = createCustomer.id;
  res.redirect("/customer/index");
});

router.get("/login", async (req, res, next) => {
  res.render("login", {});
});

router.post("/login", async (req, res, next) => {
  const findCustomer = await Customer.findOne({
    email: req.body.email,
  });
  if (!findCustomer) {
    return res.redirect("/customer/login");
  }
  if (!(findCustomer.password === req.body.password)) {
    return res.redirect("/customer/login");
  }
  req.session.isLoggedIn = true;
  req.session.customerId = findCustomer.id;
  res.redirect("/customer/index");
});

module.exports = router;
