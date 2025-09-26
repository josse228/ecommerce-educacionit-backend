const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    products: { type: Array},
    total: { type: Number },
    user: { type: String },
    email: { type: String},
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema)