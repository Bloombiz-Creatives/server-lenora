const mongoose = require("mongoose");
const validator = require('validator');


const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        validate:[validator.isEmail,'Please enter a valid email address']
    },
    subject: {
        type: String,
        required:true
    },
    message:{
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Message', messageSchema)