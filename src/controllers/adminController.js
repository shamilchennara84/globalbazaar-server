const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("../config/dotenv");
const Vendor = require("../models/Vendor");
// ====================================================================

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, dotenv.JWT_SECRET, {
      expiresIn: "1h",
    });
};

// ====================================================================

exports.adminSignIn = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    try {
        const admin = await Admin.findOne({ email }).select("+password");
        
        if (!admin) {
            return res
            .status(404)
            .json({ message: "No admin found with this email" });
        }
        
        const validPassword = await bcrypt.compare(password, admin.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = generateToken(admin._id, "admin");
        
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

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password"); // '-password' excludes the password field
    res.status(200).json(vendors);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// ====================================================================
//TODO: add admin check
exports.verifyVendor = async (req, res) => {
    const { id } = req.params;
    
    try {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        
        vendor.isVerified = true;
        await vendor.save();
        
        res.status(200).json({ message: "Vendor verified successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};


// ====================================================================
//TODO: add admin check
exports.toggleBlock = async (req, res) => {
  const { id } = req.params;

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isBlocked = !vendor.isBlocked;
    await vendor.save();

    res.status(200).json({ message: "Blocked status toggled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};