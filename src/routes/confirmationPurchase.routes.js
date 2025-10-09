const express = require("express");
const router = express.Router()

const { handleConfirmationPurchase } = 

router.get("/confirmationPurchase", handleConfirmationPurchase)

module.exports = router