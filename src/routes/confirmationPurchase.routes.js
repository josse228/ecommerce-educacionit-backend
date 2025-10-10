const express = require("express");
const router = express.Router()

const { handleConfirmationPurchase } = require("../controllers/confirmationPurchase.controller")

router.get('/confirmationPurchase', handleConfirmationPurchase)

module.exports = router