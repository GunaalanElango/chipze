const router = require("express").Router();
const { Product } = require("../models/product");
const { ProductDesc } = require("../models/product-desc");
const { ProductKeyFeature } = require("../models/product-key-feature");
const { Stock } = require("../models/stock");
const { ProductImage } = require("../models/product-image");
const { Specification } = require("../models/specification");
const { CartProduct } = require("../models/cart-product");
const chalk = require("chalk");
const { Category } = require("../models/category");
const { Customer } = require("../models/customer");
const { Op } = require("sequelize");
const { ProductReview } = require("../models/product-review");
const moment = require("moment");
const { isAuth } = require("../middleware/is-auth");
const { WishList } = require("../models/wishlist");
const { Order, OrderProduct } = require("../models/order");

router.get("/product-detail-home/:productId", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: ProductDesc,
          required: false,
        },
        {
          model: Category,
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
        {
          model: ProductReview,
          required: false,
          include: [{ model: Customer, required: false }],
        },
      ],
    });
    const {
      product_descriptions,
      product_keyfeatures,
      specifications,
      stocks,
      product_images,
      product_reviews,
    } = product.toJSON();
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const relatedProducts = await Product.findAll({
      where: {
        categoryName: product.categoryName,
        id: { [Op.not]: product.id },
      },
      limit: 6,
    });
    const categories = await Category.findAll();
    const customer = await Customer.findByPk(req.session.customerId);
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
      categories,
      reviews: product_reviews,
      customer: customer.toJSON(),
      relatedProducts,
    });
  } catch (error) {
    console.log(chalk.greenBright(error));
  }
});

router.get("/product-page", async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const categories = await Category.findAll();
    let isAuthenticated = req.session.isLoggedIn;
    res.render("product", {
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search-result/:withFilterOption", async (req, res, next) => {
  try {
    let isAuthenticated = req.session.isLoggedIn;
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const categories = await Category.findAll();
    const searchValues = req.body.searchValue.split(" ");
    let products = [];
    if (req.params.withFilterOption == "true") {
      for (let searchValue of searchValues) {
        const prod = await Product.findAll({
          where: {
            name: { [Op.substring]: searchValue },
            sellingPrice: { [Op.between]: [req.body.priceFrom, req.body.priceTo] },
          },
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
    } else {
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
    }
    res.render("search_results", {
      totalCartItems: cartProducts.length,
      searchValue: req.body.searchValue,
      products: products,
      isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/index", isAuth, async (req, res, next) => {
  try {
    const products = await Product.findAll({
      limit: 6,
    });
    const laptops = await Product.findAll({
      where: { categoryName: "Laptop" },
      limit: 6,
    });
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const categories = await Category.findAll();
    let isAuthenticated = req.session.isLoggedIn;
    res.render("index", {
      products,
      laptops,
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/checkout-cart", async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
      include: [
        {
          model: Product,
          required: false,
        },
      ],
    });
    const categories = await Category.findAll();
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
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-to-cart/:productId", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    await CartProduct.create({
      customerId: req.session.customerId,
      productId: req.params.productId,
      totalPrice: product.sellingPrice,
    });
    res.redirect("/customer/checkout-cart");
  } catch (error) {
    console.log(error);
  }
});

router.get("/remove-from-cart/:cartProductId", async (req, res, next) => {
  try {
    await CartProduct.destroy({
      where: { id: req.params.cartProductId },
    });
    res.redirect("/customer/checkout-cart");
  } catch (error) {
    console.log(error);
  }
});

router.get("/increase-qty/:cartProductId", async (req, res, next) => {
  try {
    const cartProduct = await CartProduct.findByPk(req.params.cartProductId);
    const product = await Product.findByPk(cartProduct.productId);
    if (cartProduct.quantity >= 2) {
      return res.redirect("/customer/checkout-cart");
    }
    cartProduct.quantity += 1;
    cartProduct.totalPrice += product.sellingPrice;
    cartProduct.save();
    res.redirect("/customer/checkout-cart");
  } catch (error) {
    console.log(error);
  }
});

router.get("/decrease-qty/:cartProductId", async (req, res, next) => {
  try {
    const cartProduct = await CartProduct.findByPk(req.params.cartProductId);
    const product = await Product.findByPk(cartProduct.productId);
    if (cartProduct.quantity <= 1) {
      return res.redirect("/customer/checkout-cart");
    }
    cartProduct.quantity -= 1;
    cartProduct.totalPrice -= product.sellingPrice;
    cartProduct.save();
    res.redirect("/customer/checkout-cart");
  } catch (error) {
    console.log(error);
  }
});

router.post("/checkout-info", async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll();
    const categories = await Category.findAll();
    const customer = await Customer.findByPk(req.session.customerId);
    let isAuthenticated = req.session.isLoggedIn;
    res.render("checkout_info", {
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/checkout-complete", async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const categories = await Category.findAll();
    let isAuthenticated = req.session.isLoggedIn;
    for (let cart of cartProducts) {
      const stock = await Stock.findOne({
        where: { productId: cart.productId },
      });
      if (parseInt(stock.available) <= 0) {
        return res.redirect("/customer/checkout-payment");
      }
    }
    const createOrder = await Order.create({
      customerId: req.session.customerId,
    });
    let totalOrderPrice = 0;
    for (let cart of cartProducts) {
      const createOrderProduct = await OrderProduct.create({
        productId: cart.productId,
        quantity: cart.quantity,
        totalPrice: cart.totalPrice,
        orderId: createOrder.id,
      });
      totalOrderPrice += cart.totalPrice;
      const stock = await Stock.findOne({
        where: { productId: cart.productId },
      });
      stock.sold += cart.quantity;
      stock.available -= cart.quantity;
      stock.save();
    }
    createOrder.status = "pending";
    createOrder.totalPrice = totalOrderPrice;
    createOrder.save();
    res.render("checkout_complete", {
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
      orderId: createOrder.id,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/checkout-payment", async (req, res, next) => {
  try {
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const updateCustomerAddress = await Customer.update(
      {
        address: req.body.address,
        district: req.body.district,
        alternatePhoneNumber: req.body.phoneNumber,
        pincode: req.body.pinCode,
      },
      {
        where: { id: req.session.customerId },
      }
    );
    const categories = await Category.findAll();
    let isAuthenticated = req.session.isLoggedIn;
    res.render("checkout_payment", {
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/product-review", async (req, res, next) => {
  try {
    await ProductReview.create({
      date: moment().format("LL"),
      title: req.body.title,
      rating: req.body.rating,
      comment: req.body.comment,
      productId: req.body.productId,
      customerId: req.session.customerId,
    });
    res.redirect(`/customer/product-detail-home/${req.body.productId}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/about-us", async (req, res, next) => {
  res.render("about_us", {});
});

router.get("/register", async (req, res, next) => {
  res.render("register", {});
});

router.post("/register", async (req, res, next) => {
  try {
    const createCustomer = await Customer.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.isLoggedIn = true;
    req.session.customerId = createCustomer.id;
    res.redirect("/customer/index");
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (req, res, next) => {
  res.render("login", {});
});

router.post("/login", async (req, res, next) => {
  try {
    const findCustomer = await Customer.findOne({
      where: { email: req.body.email },
    });
    if (!findCustomer) {
      return res.redirect("/customer/login");
    }
    if (findCustomer.password !== req.body.password) {
      return res.redirect("/customer/login");
    }
    req.session.isLoggedIn = true;
    req.session.customerId = findCustomer.id;
    res.redirect("/customer/index");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", isAuth, async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/customer/login");
  } catch (error) {
    console.log(error);
  }
});

router.get("/wishlist", async (req, res, next) => {
  try {
    const wishListProducts = await WishList.findAll({
      where: { customerId: req.session.customerId },
      include: [
        {
          model: Product,
          required: false,
        },
      ],
    });
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
      include: [
        {
          model: Product,
          required: false,
        },
      ],
    });
    const categories = await Category.findAll();
    let totalCartPrice = 0;
    for (let cart of cartProducts) {
      totalCartPrice += cart.totalPrice;
    }
    let isAuthenticated = req.session.isLoggedIn;
    res.render("wishlist", {
      wishListProducts,
      totalCartItems: cartProducts.length,
      totalCartPrice,
      isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-to-wishlist/:productId", isAuth, async (req, res, next) => {
  try {
    const createWishlist = await WishList.create({
      customerId: req.session.customerId,
      productId: req.params.productId,
    });
    res.redirect("/customer/wishlist");
  } catch (error) {
    console.log(error);
  }
});

router.get("/remove-wishlist/:productId", async (req, res, next) => {
  try {
    await WishList.destroy({
      where: { productId: req.params.productId },
    });
    res.redirect("/customer/wishlist");
  } catch (error) {
    console.log(error);
  }
});

router.get("/my-orders", async (req, res, next) => {
  try {
    const orderDetails = await Order.findAll({
      where: { customerId: req.session.customerId },
      include: [{ model: Customer, required: false }],
    });
    const cartProducts = await CartProduct.findAll({
      where: { customerId: req.session.customerId },
    });
    const categories = await Category.findAll();
    let isAuthenticated = req.session.isLoggedIn;
    res.render("my-orders", {
      totalCartItems: cartProducts.length,
      isAuthenticated,
      categories,
      orderDetails,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/order-detail-page/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: OrderProduct,
          required: false,
          include: [{ model: Product, required: false }],
        },
        { model: Customer, required: false },
      ],
    });
    console.log(order.toJSON());
    res.render("order-detail-page", { order });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
