const express = require("express");
const { updateCategoryDescription, createCategory, getAllCategories } = require("../Controller/Category.Controller");

const router = express.Router();

router.put("/category/update-description", updateCategoryDescription);

router.post('/create', createCategory);

router.get('/getall', getAllCategories);

module.exports = router;
