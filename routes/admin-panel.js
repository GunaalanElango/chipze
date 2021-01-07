const router = require("express").Router();
const xlsx = require("xlsx");
const fs = require("fs");
const { Product } = require("../models/product");
const { ProductDesc } = require("../models/product-desc");
const { Specification } = require("../models/specification");
const {
  productImageUpload,
  workBookUpload,
} = require("../middleware/image-upload");
const { ProductImage } = require("../models/product-image");
const { Stock } = require("../models/stock");
const { ProductKeyFeature } = require("../models/product-key-feature");
const { Category } = require("../models/category");
const { Order, OrderProduct } = require("../models/order");
const { Customer } = require("../models/customer");
const path = require("path");
const chalk = require("chalk");
let PRODUCT_ID = 0;

router.get("/dashboard", async (req, res, next) => {
  res.render("adminpanel/dashboard");
});

router.get("/add-multiple-product", async (req, res, next) => {
  res.render("adminpanel/add-multiple-product", {});
});

router.get("/inventory-report", async (req, res, next) => {
  res.render("adminpanel/inventory-reports", {});
});

router.get("/sales-report", async (req, res, next) => {
  res.render("adminpanel/sales-reports", {});
});

router.get("/customer-report", async (req, res, next) => {
  res.render("adminpanel/customer-reports", {});
});

router.get("/product-performance-report", async (req, res, next) => {
  res.render("adminpanel/product-performance-reports", {});
});

router.post("/add-multiple-product", workBookUpload, async (req, res, next) => {
  try {
    const wb = xlsx.readFile("public/excel-files/" + req.file.filename);
    const ws = wb.Sheets["product data"];
    const productData = xlsx.utils.sheet_to_json(ws);
    for (let product of productData) {
      if ("name" in product) {
        const [category, created] = await Category.findOrCreate({
          where: { name: product.categoryName },
        });
        let discountAmount = parseInt(
          product.originalPrice * (product.discount / 100)
        );
        const createdProduct = await Product.create({
          name: product.name,
          originalPrice: product.originalPrice,
          sellingPrice: product.originalPrice - discountAmount,
          indexImage: "/images/product-image/" + product.indexImage,
          categoryName: category.name,
          discountPercentage: product.discount,
        });
        PRODUCT_ID = createdProduct.id;
        await Stock.create({
          productId: product.productId,
          available: product.availableStock,
        });
      }
      if ("specName" in product) {
        await Specification.create({
          name: product.specName,
          value: product.specValue,
          productId: PRODUCT_ID,
        });
      }
      if ("descName" in product) {
        await ProductDesc.create({
          name: product.descName,
          value: product.descValue,
          productId: PRODUCT_ID,
        });
      }
      if ("keyFeature" in product) {
        await ProductKeyFeature.create({
          keyFeature: product.keyFeature,
          productId: PRODUCT_ID,
        });
      }
      if ("extraImage" in product) {
        await ProductImage.create({
          extraImage: "/images/product-image/" + product.extraImage,
          productId: PRODUCT_ID,
        });
      }
    }

    res.redirect("/admin-panel/add-multiple-product");
  } catch (error) {
    console.log(chalk.green(error));
  }
});

router.get("/add-single-product", async (req, res, next) => {
  const categories = await Category.findAll();
  res.render("adminpanel/add-single-product", { categories });
});

router.post(
  "/add-single-product",
  productImageUpload,
  async (req, res, next) => {
    try {
      const {
        name,
        descName,
        descValue,
        specName,
        specValue,
        availableStock,
        originalPrice,
        keyFeature,
        categoryName,
        discount,
      } = req.body;
      let discountAmount = parseInt(originalPrice * (discount / 100));
      const createdProduct = await Product.create({
        name,
        originalPrice,
        sellingPrice: originalPrice - discountAmount,
        indexImage: "/images/product-image/" + req.files[0].filename,
        discountPercentage: discount,
        categoryName,
      });
      if (typeof descName === "object") {
        for (let i = 0; i <= descName.length; i++) {
          await ProductDesc.create({
            name: descName[i],
            value: descValue[i],
            productId: createdProduct.id,
          });
        }
      } else {
        await ProductDesc.create({
          productId: createdProduct.id,
          name: descName,
          value: descValue,
        });
      }
      if (typeof specName === "object") {
        for (let i = 0; i <= specName.length; i++) {
          await Specification.create({
            productId: createdProduct.id,
            name: specName[i],
            value: specValue[i],
          });
        }
      } else {
        await Specification.create({
          productId: createdProduct.id,
          name: specName,
          value: specValue,
        });
      }
      if (typeof keyFeature === "object") {
        for (let key of keyFeature) {
          await ProductKeyFeature.create({
            productId: createdProduct.id,
            keyFeature: key,
          });
        }
      } else {
        await ProductKeyFeature.create({
          productId: createdProduct.id,
          keyFeature,
        });
      }
      for (let i = 1; i < req.files.length; i++) {
        await ProductImage.create({
          productId: createdProduct.id,
          extraImage: "/images/product-image/" + req.files[i].filename,
        });
      }
      await Stock.create({
        productId: createdProduct.id,
        available: availableStock,
      });
      res.redirect("/admin-panel/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/update-product/:productId", async (req, res, next) => {
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
      ],
    });
    const {
      product_descriptions,
      product_keyfeatures,
      specifications,
      stocks,
      product_images,
    } = product.toJSON();
    const categories = await Category.findAll();
    res.render("adminpanel/update-product", {
      stock: stocks[0],
      descriptions: product_descriptions,
      keyFeatures: product_keyfeatures,
      images: product_images,
      specifications,
      product: product.toJSON(),
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/update-product", async (req, res, next) => {
  try {
    const {
      name,
      descName,
      descValue,
      descId,
      specId,
      keyFeatureId,
      specName,
      specValue,
      availableStock,
      originalPrice,
      keyFeature,
      categoryName,
      discount,
      productId,
    } = req.body;
    let discountAmount = parseInt(originalPrice * (discount / 100));
    await Product.update(
      {
        name,
        originalPrice,
        // indexImage: "/images/product-image/" + req.files[0].filename,
        sellingPrice: originalPrice - discountAmount,
        discountPercentage: discount,
        categoryName,
      },
      {
        where: { id: productId },
      }
    );
    if (typeof descName === "object") {
      for (let i = 0; i <= descName.length; i++) {
        await ProductDesc.update(
          {
            name: descName[i],
            value: descValue[i],
          },
          {
            where: { id: descId[i] },
          }
        );
      }
    } else {
      await ProductDesc.update(
        {
          name: descName,
          value: descValue,
        },
        {
          where: { id: descId },
        }
      );
    }
    if (typeof specName === "object") {
      for (let i = 0; i <= specName.length; i++) {
        await Specification.update(
          {
            name: specName[i],
            value: specValue[i],
          },
          {
            where: { id: specId[i] },
          }
        );
      }
    } else {
      await Specification.update(
        {
          name: specName,
          value: specValue,
        },
        {
          id: specId,
        }
      );
    }
    if (typeof keyFeature === "object") {
      for (let key = 0; key <= keyFeature.length; key++) {
        await ProductKeyFeature.update(
          {
            keyFeature: keyFeature[key],
          },
          {
            where: { id: keyFeatureId[key] },
          }
        );
      }
    } else {
      await ProductKeyFeature.update(
        {
          keyFeature,
        },
        {
          where: { id: keyFeatureId },
        }
      );
    }
    // for (let i = 1; i < req.files.length; i++) {
    //   await ProductImage.create({
    //     productId: createdProduct.id,
    //     extraImage: "/images/product-image/" + req.files[i].filename,
    //   });
    // }
    await Stock.update(
      {
        available: availableStock,
      },
      {
        where: { productId: productId },
      }
    );
    res.redirect(`/customer/product-detail-home/${productId}`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete-product/:productId", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    let imageName = product.indexImage.split("/")[3];
    fs.unlinkSync(path.join("public", "images", "product-image", imageName));
    const productImage = await ProductImage.findAll({
      where: { productId: req.params.productId },
    });
    for (let image of productImage) {
      let imageNames = image.extraImage.split("/")[3];
      fs.unlinkSync(path.join("public", "images", "product-image", imageNames));
    }
    await product.destroy();
    res.redirect("/customer/index");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-category", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render("adminpanel/add-category", { categories });
  } catch (error) {
    console.log(error);
  }
});

router.get("/order-details", async (req, res, next) => {
  try {
    const orderDetails = await Order.findAll({
      where: { status: "pending" },
      include: [
        { model: Customer, required: false },
        {
          model: OrderProduct,
          required: false,
          include: [{ model: Product, required: false }],
        },
      ],
    });
    res.render("adminpanel/pending-orders", {
      orderDetails,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-category", async (req, res, next) => {
  try {
    const createdCategory = await Category.create({
      name: req.body.categoryName,
    });
    res.redirect("/admin-panel/add-category");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-more-image", (req, res, next) => {
  res.render("adminpanel/add-images", {});
});

router.post("/add-more-image", productImageUpload, async (req, res, next) => {
  res.redirect("/admin-panel/add-more-image");
});

module.exports = router;
