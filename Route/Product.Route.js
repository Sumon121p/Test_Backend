const express = require("express");
const { getAllProduct, createProduct, updateProductById, calculateProductStats, groupProductsByPriceRange, findHighestPricedProductByCategory, postProducts, searchProducts } = require("../Controller/Product.Controller");

const router = express.Router();

router.post("/getall", getAllProduct);

router.post('/create', createProduct);

router.put("/:productId", updateProductById);

router.post("/stats", calculateProductStats);

router.post("/price-ranges", groupProductsByPriceRange);

router.post("/highest-priced", findHighestPricedProductByCategory);

router.post("/", postProducts);

router.post("/search", searchProducts);

module.exports = router;
