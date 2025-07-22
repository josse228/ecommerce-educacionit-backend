const mongoose = require("mongoose");
const { validate } = require("./user.model");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function(valor){
                return /\.(jpg|jpeg|jpng|png|webp)$/i.test(valor);
            }
        }
    },
    created: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        enum: ['celphone', 'audio', 'tv', 'comfort', 'gaming', 'computer'],
        required: true
    },
    highlight: { 
        type: Boolean,
        default: false
    },
    promotion: { 
        type: Boolean,
        default: false
    }
})

productSchema.set('toJSON', {
    //Devuelve los datos desde la base de datos a los controllers ya formateados.
    transform: function (doc, ret) {
        if (ret.created) {
        ret.created = new Date(ret.created).toISOString().slice(0, 10);
        }
        return ret;
    }
});


module.exports = mongoose.model('Product', productSchema)