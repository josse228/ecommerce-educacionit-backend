const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        minLenght: 2
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50,
        minLenght: 2
    },
    email: { 
        type: String, 
        required:true, 
        unique:true, 
        trim: true,
        maxLength: 50,
        minLenght: 2,
        validate: {
            validator: function(valor){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor)
            }
        }
    },
    password: { type: String, required:true },
    birthDate: { type: Date },
    national: { 
        type: String,
        emum: ['argentina', 'brasil', 'chile', 'uruguay', 'venezuela', 'other']
    },
    comments: { 
        type: String,
        minLenght: 5,
        maxLength: 100
    },
    rol: { 
        type: String,
        enum: ['client', 'admin'],
        default: "client"
    }
})

module.exports = mongoose.model('User', userSchema)