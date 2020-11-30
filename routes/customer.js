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
    const cartProducts = await CartProduct.findAll();
    res.render("product_detail", {
      stock: stocks[0],
      descriptions: product_descriptions,
      keyFeatures: product_keyfeatures,
      images: product_images,
      specifications,
      product: product.toJSON(),
      totalCartItems: cartProducts.length,
    });
  } catch (error) {
    console.log(chalk.greenBright(error));
  }
});

router.get("/product-page", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll();
  res.render("product", { totalCartItems: cartProducts.length });
});

router.post("/search-result", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll();
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
  const cartProducts = await CartProduct.findAll();
  res.render("index", {
    products,
    laptops,
    totalCartItems: cartProducts.length,
  });
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
  let totalCartPrice = 0;
  for (let cart of cartProducts) {
    totalCartPrice += cart.totalPrice;
  }
  res.render("checkout_cart", {
    cartProducts,
    totalCartItems: cartProducts.length,
    totalCartPrice,
  });
});

router.post("/add-to-cart/:productId", async (req, res, next) => {
  const product = await Product.findByPk(req.params.productId);
  const createCart = await CartProduct.create({
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
  res.render("checkout_info", { totalCartItems: cartProducts.length });
});

router.post("/checkout-complete", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll();
  res.render("checkout_complete", { totalCartItems: cartProducts.length });
});

router.post("/checkout-payment", async (req, res, next) => {
  const cartProducts = await CartProduct.findAll();
  console.log(req.body);
  res.render("checkout_payment", { totalCartItems: cartProducts.length });
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
