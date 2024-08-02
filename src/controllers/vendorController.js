const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("../config/dotenv");
const Product = require("../models/Product")

// ====================================================================

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, dotenv.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// ====================================================================

exports.vendorSignup = async (req, res) => {
  const { username, password, companyName, email, phone } = req.body;

  if (!username || !password || !companyName || !email || !phone) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newVendor = new Vendor({
      username,
      password: hashedPassword,
      companyName,
      email,
      phone,
    });
    await newVendor.save();

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================================================================

exports.vendorSignIn = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    const vendor = await Vendor.findOne({ email }).select("+password");
    
    if (!vendor) {
      return res
      .status(404)
      .json({ message: "No vendor found with this email" });
    }
    
    const validPassword = await bcrypt.compare(password, vendor.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (vendor.isBlocked) {
      return res
      .status(403)
      .json({ message: "Your account is blocked. Please contact support." });
    }
    
    if (!vendor.isVerified) {
      return res.status(403).json({
        message: "Your account is not verified. Please contact admin.",
      });
    }
    
    const token = generateToken(vendor._id, "vendor");
    
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token: token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ====================================================================

exports.getProductsByVendor = async (req, res) => {
  try {
   
    const vendorId = req.user._id; 
    
    const products = await Product.find({ vendorId });
    
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for this vendor",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================================================================

exports.addProduct = async (req, res) => {

  const { name, description, price, quantity } = req.body;
  
  if (!name|| !description || !price || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {
    const vendorId = req.user._id;
      
    const newProduct = new Product({
      name: name,
      description: description,
      price: price,
      quantity:quantity,
      vendorId: vendorId,
      image: req.file ? req.file.path : null,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};