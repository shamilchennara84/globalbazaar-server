const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
 
    cb(null, "src/assets/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });


const {
  vendorSignup,
  vendorSignIn,
  getProductsByVendor,
  addProduct,
  getProducts,
} = require("../controllers/vendorController");
const { jwtVerify } = require("../middleware/jwtVerify");





router.post("/signup", vendorSignup);
router.post("/signin", vendorSignIn);
router.get("/products", jwtVerify, getProductsByVendor);
router.get("/productsAll",  getProducts);
router.post("/product", jwtVerify, upload.single("image"), addProduct);

module.exports = router;
