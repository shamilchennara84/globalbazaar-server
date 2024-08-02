const express = require("express");
const router = express.Router();
const { vendorSignup, vendorSignIn } = require("../controllers/vendorController");
const { jwtVerify } = require("../middleware/jwtVerify");

router.post("/signup", vendorSignup);
router.post("/signin", vendorSignIn);

module.exports = router;
