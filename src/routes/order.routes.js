const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

const auth = require("../middlewares/auth.middleware");

router.get("/orders", orderController.getOrders)
router.post("/orders", [auth], orderController.createOrder)

module.exports = router;