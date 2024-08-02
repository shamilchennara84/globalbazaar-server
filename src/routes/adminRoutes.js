const express = require("express");
const router = express.Router();
const {
  adminSignIn,
  getAllVendors,
  verifyVendor,toggleBlock
} = require("../controllers/adminController");
const { jwtVerify } = require("../middleware/jwtVerify");

router.post("/signin", adminSignIn);
router.get("/vendors",jwtVerify, getAllVendors);
router.put("/vendors/:id/verify",jwtVerify, verifyVendor);
router.put("/vendors/:id/block",jwtVerify,toggleBlock);

module.exports = router;
