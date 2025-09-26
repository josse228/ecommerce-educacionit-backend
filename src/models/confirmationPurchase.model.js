const moongose = require('moongose');
const { Schema } = moongose;

const purchaseConfirmation = new Schema({
    to: String,
    subject: String,
    html: String,
    order: [{
        type: Schema.Types.ObjectId, 
        ref: 'Order'
    }]
})

module.exports = moongose.model('PurchaseConfirmation', purchaseConfirmation)