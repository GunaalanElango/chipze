const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./util/database");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/admin-panel");
const authRoutes = require("./routes/authentication");
const customerRoutes = require("./routes/customer");
const { Product } = require("./models/product");
const { ProductImage } = require("./models/product-image");
const { Category } = require("./models/category");
const { Specification } = require("./models/specification");
const { CartProduct } = require("./models/cart-product");
const { Customer } = require("./models/customer");
const { ProductDesc } = require("./models/product-desc");
const { ProductKeyFeature } = require("./models/product-key-feature");
const { Stock } = require("./models/stock");
const { ProductReview } = require("./models/product-review");
const { WishList } = require("./models/wishlist");
const { Order, OrderProduct } = require("./models/order");
dotenv.config();
const PORT = process.env.PORT;

const app = express();
const store = new SequelizeStore({
  db: sequelize,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "teddy!11moon",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/admin-panel", adminRoutes);
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);

Specification.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(Specification, {
  constraints: true,
  onDelete: "CASCADE",
});

ProductImage.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(ProductImage, {
  constraints: true,
  onDelete: "CASCADE",
});

CartProduct.belongsTo(Product);
Product.hasMany(CartProduct);

CartProduct.belongsTo(Customer);
Customer.hasMany(CartProduct);

ProductDesc.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(ProductDesc, {
  constraints: true,
  onDelete: "CASCADE",
});

ProductKeyFeature.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(ProductKeyFeature, {
  constraints: true,
  onDelete: "CASCADE",
});

ProductReview.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(ProductReview, {
  constraints: true,
  onDelete: "CASCADE",
});

ProductReview.belongsTo(Customer, {
  constraints: true,
  onDelete: "CASCADE",
});
Customer.hasMany(ProductReview, {
  constraints: true,
  onDelete: "CASCADE",
});

Stock.belongsTo(Product, {
  constraints: true,
  onDelete: "CASCADE",
});
Product.hasMany(Stock, {
  constraints: true,
  onDelete: "CASCADE",
});

Product.belongsTo(Category, {
  targetKey: "name",
  foreignKey: "categoryName",
});
Category.hasMany(Product, {
  sourceKey: "name",
  foreignKey: "categoryName",
});

WishList.belongsTo(Product);
Product.hasMany(WishList);

WishList.belongsTo(Customer);
Customer.hasMany(WishList);

Order.belongsTo(Customer);
Customer.hasMany(Order);

OrderProduct.belongsTo(Product);
Product.hasMany(OrderProduct);

OrderProduct.belongsTo(Order);
Order.hasMany(OrderProduct);

sequelize
  .sync({ force: false, alter: false })
  .then(() =>
    app.listen(PORT || 9000, () =>
      console.log(`app listening to the port ${PORT || 9000}`)
    )
  )
  .catch((error) => console.log(error));
