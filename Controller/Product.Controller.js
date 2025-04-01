const Product = require("../Model/Product.Model");

const getAllProduct = async (req, res) => {
  try {
    const result = await Product.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
      const { productName, description, image, categoryId, images, price, pvValue } = req.body;

      const newProduct = new Product({
          productName,
          description,
          image,
          categoryId,
          images,
          price,
          pvValue,
      });

      await newProduct.save();

      res.status(201).json({
          message: 'Product created successfully!',
          product: newProduct,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error creating the product.',
          error: error.message,
      });
  }
};

const updateProductById = async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const calculateProductStats = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$price" },
          totalPvValue: { $sum: "$pvValue" },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const stats = result[0];

    res.status(200).json({
      averagePrice: stats.averagePrice,
      totalPvValue: stats.totalPvValue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const groupProductsByPriceRange = async (req, res) => {
  try {
    const priceRanges = await Product.aggregate([
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 500, 1000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
            products: { $push: "$$ROOT" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          range: "$_id",
          count: 1,
          products: 1,
        },
      },
    ]);

    if (priceRanges.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(priceRanges);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const findHighestPricedProductByCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$categoryId",
          highestPrice: { $max: "$price" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "highestPrice",
          foreignField: "price",
          as: "highestPricedProduct",
        },
      },
      {
        $unwind: "$highestPricedProduct",
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          product: "$highestPricedProduct",
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const postProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, sortByPrice = "asc" } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = sortByPrice === "desc" ? -1 : 1;

    const filter = categoryId ? { categoryId } : {};

    const products = await Product.aggregate([
      {
        $match: filter,
      },
      {
        $sort: { price: sortOrder },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          description: 1,
          price: 1,
          categoryId: 1,
          image: 1,
          images: 1,
          pvValue: 1,
        },
      },
    ]);

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const products = await Product.find({
      $or: [
        { productName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  updateProductById,
  calculateProductStats,
  groupProductsByPriceRange,
  findHighestPricedProductByCategory,
  postProducts,
  searchProducts,
  getAllProduct,
  createProduct
};
