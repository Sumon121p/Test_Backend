const Category = require("../Model/Category.Model");
const Product = require("../Model/Product.Model");

const createCategory = async (req, res) => {
  try {
      const { name, description, isActive } = req.body;

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
          return res.status(400).json({ message: 'Category with this name already exists' });
      }

      const category = new Category({
          name,
          description,
          isActive,
      });

      await category.save();

      return res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
  }
}

const getAllCategories = async (req, res) => {
  try {
      const categories = await Category.find().exec();
      return res.status(200).json({ categories });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
  }
};

const updateCategoryDescription = async (req, res) => {
  const { categoryId, newDescription } = req.body;

  if (!categoryId || !newDescription) {
    return res.status(400).json({ message: "Category ID and new description are required" });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { description: newDescription },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedProducts = await Product.updateMany(
      { categoryId: categoryId },
      { $set: { description: newDescription } }
    );

    if (updatedProducts.modifiedCount > 0) {
      res.status(200).json({
        message: "Category description updated and related products have been updated.",
        updatedCategory,
        updatedProducts: updatedProducts.modifiedCount,
      });
    } else {
      res.status(200).json({
        message: "Category description updated, but no related products were found.",
        updatedCategory,
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { updateCategoryDescription, getAllCategories, createCategory};
