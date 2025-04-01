const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    pvValue: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.path("images").validate(function (value) {
  return value.length <= 5;
}, "You can only upload up to 5 images.");

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
