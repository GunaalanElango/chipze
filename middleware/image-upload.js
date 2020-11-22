const multer = require("multer");

const productImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/product-image");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});

const workBookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/excel-files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

exports.workBookUpload = multer({ storage: workBookStorage }).single("workBook");

exports.productImageUpload = multer({ storage: productImageStorage }).array("productImage", 10);
