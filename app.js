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
const { SubCategory } = require("./models/sub-category");
const { Category } = require("./models/category");
const { Specification } = require("./models/specification");
const { Tag } = require("./models/tag");
const { CartProduct } = require("./models/cart-product");
const { Customer } = require("./models/customer");
const { ProductDesc } = require("./models/product-desc");
const { ProductKeyFeature } = require("./models/product-key-feature");
const { Stock } = require("./models/stock");
// const moment = require("moment");
// const cron = require("node-cron");
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
  targetKey: "productId",
});
Product.hasMany(Specification, {
  sourceKey: "productId",
});

ProductImage.belongsTo(Product, {
  targetKey: "productId",
});
Product.hasMany(ProductImage, {
  sourceKey: "productId",
});

CartProduct.belongsTo(Product);
Product.hasMany(CartProduct);

ProductDesc.belongsTo(Product, {
  targetKey: "productId",
});
Product.hasMany(ProductDesc, {
  sourceKey: "productId",
});

ProductKeyFeature.belongsTo(Product, {
  targetKey: "productId",
});
Product.hasMany(ProductKeyFeature, {
  sourceKey: "productId",
});

Stock.belongsTo(Product, {
  targetKey: "productId",
});
Product.hasMany(Stock, {
  sourceKey: "productId",
});

SubCategory.belongsTo(Category, {
  targetKey: "name",
  foreignKey: "categoryName",
});
Category.hasMany(SubCategory, {
  sourceKey: "name",
  foreignKey: "categoryName",
});

Product.belongsTo(SubCategory, {
  targetKey: "name",
  foreignKey: "subCategoryName",
});
SubCategory.hasMany(Product, {
  sourceKey: "name",
  foreignKey: "subCategoryName",
});

Tag.belongsTo(Product, {
  targetKey: "productId",
});
Product.hasMany(Tag, {
  sourceKey: "productId",
});

sequelize
  .sync({ force: false, alter: true })
  .then(() =>
    app.listen(PORT || 9000, () =>
      console.log(`app listening to the port ${PORT || 9000}`)
    )
  )
  .catch((error) => console.log(error));
