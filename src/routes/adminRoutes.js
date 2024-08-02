const express = require("express");
const router = express.Router();
const {
  adminSignIn,
  getAllVendors,
  verifyVendor,toggleBlock
} = require("../controllers/adminController");
const { jwtVerify } = require("../middleware/jwtVerify");

router.post("/signin", adminSignIn);
router.get("/vendors", getAllVendors);
router.put("/vendors/:id/verify", verifyVendor);
router.put("/vendors/:id/block",toggleBlock);

module.exports = router;
