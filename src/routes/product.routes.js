const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware")
const upload = require("../middlewares/upload.middleware")

const productController = require("../controllers/product.controller")


router.get("/products", productController.getProducts);

router.get("/products/:id", productController.getProductById)

router.post("/products", [upload], productController.createProduct);

router.put("/products/:id", [auth, upload, isAdmin], productController.updateProduct);

router.delete("/products/:id", [auth, upload, isAdmin], productController.deleteProduct)

module.exports = router;