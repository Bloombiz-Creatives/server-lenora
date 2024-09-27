const  mongoose  = require("mongoose");

const homePromoSchema = new mongoose.Schema({
    image1:{
        type:String,
        required:true
    },
    image2:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Promo', homePromoSchema)