const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color_code:{
        type:String,
        required:true
    }
}, {timestamps:true})

module.exports = mongoose.model('Colors', colorSchema)