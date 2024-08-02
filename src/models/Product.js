const mongoose = require("mongoose");
const Schema = mongoose.Schema;

  const productSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor", 
        required: true,
      },
      image: {
        type: String,
        required: false, 
      },
    },
    { timestamps: true }
  ); 

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
