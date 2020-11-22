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
const chalk = require("chalk");

router.get("/dashboard", async (req, res, next) => {
  res.render("adminpanel/dashboard", {});
});

router.get("/add-multiple-product", async (req, res, next) => {
  res.render("adminpanel/add-multiple-product", {});
});

router.post("/add-multiple-product", workBookUpload, async (req, res, next) => {
  try {
    const wb = xlsx.readFile("public/excel-files/" + req.file.filename);
    const ws = wb.Sheets["product data"];
    const productData = xlsx.utils.sheet_to_json(ws);
    var count = 1;
    productData.forEach(async (product) => {
      try {
        console.log(chalk.yellow(count));
        count = count + 1;
        const {
          name,
          descName,
          descValue,
          specName,
          specValue,
          productId,
          keyFeature,
          originalPrice,
          availableStock,
          indexImage,
          extraImage,
        } = product;
        if (name) {
          const createdProduct = await Product.create({
            name,
            originalPrice,
            sellingPrice: originalPrice,
            productId,
            indexImage: "images/product-image/" + indexImage,
          });
          await Stock.create({
            productId,
            available: availableStock,
          });
        }
        if (productId && specName) {
          await Specification.create({
            name: specName,
            value: specValue,
            productId,
          });
        }
        if (productId && descName) {
          await ProductDesc.create({
            name: descName,
            value: descValue,
            productId,
          });
        }
        if (keyFeature && productId) {
          await ProductKeyFeature.create({
            keyFeature,
            productId,
          });
        }
        if (extraImage && productId) {
          await ProductImage.create({
            productId,
            extraImage: "images/product-image/" + extraImage,
          });
        }
      } catch (error) {
        console.log(chalk.greenBright(error + "-----------------" + count))
      }
    });

    res.redirect("/admin-panel/add-multiple-product");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-single-product", async (req, res, next) => {
  res.render("adminpanel/add-single-product", {});
});

router.post(
  "/add-single-product",
  productImageUpload,
  async (req, res, next) => {
    try {
      const {
        serialNumber,
        name,
        descName,
        descValue,
        specName,
        specValue,
        availableStock,
        originalPrice,
        sellingPrice,
        keyFeature,
      } = req.body;
      const createdProduct = await Product.create({
        serialNumber,
        name,
        originalPrice,
        sellingPrice,
        indexImage: req.files[0].filename,
      });
      if (typeof descName === "object") {
        for (let i = 0; i <= descName.length; i++) {
          await ProductDesc.create({
            serialNumber: serialNumber,
            name: descName[i],
            value: descValue[i],
          });
        }
      } else {
        await ProductDesc.create({
          serialNumber,
          name: descName,
          value: descValue,
        });
      }
      if (typeof specName === "object") {
        for (let i = 0; i <= specName.length; i++) {
          await Specification.create({
            serialNumber: serialNumber,
            name: specName[i],
            value: specValue[i],
          });
        }
      } else {
        await Specification.create({
          serialNumber,
          name: specName,
          value: specValue,
        });
      }
      if (typeof keyFeature === "object") {
        keyFeature.forEach(async (key) => {
          await ProductKeyFeature.create({
            serialNumber,
            keyFeature: key,
          });
        });
      } else {
        await ProductKeyFeature.create({
          serialNumber,
          keyFeature,
        });
      }
      for (let i = 1; i < req.files.length; i++) {
        await ProductImage.create({
          serialNumber,
          extraImage: req.files[i].filename,
        });
      }
      await Stock.create({
        available: availableStock,
        serialNumber,
      });
      res.redirect("/admin-panel/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/add-product-image", async (req, res, next) => {
  res.render("adminpanel/add-product-image");
});

router.post(
  "/add-product-image",
  productImageUpload,
  async (req, res, next) => {
    res.redirect("/admin-panel/add-product-image");
  }
);

module.exports = router;
