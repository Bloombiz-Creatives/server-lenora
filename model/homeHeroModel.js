const  mongoose  = require("mongoose");

const homeHeroSchema = new mongoose.Schema({
    image1:{
        type:String,
        required:true
    },
    image2:{
        type:String,
        required:true
    },
    image3:{
        type:String,
        required:true
    },
    image4: {
        type: String,
        required: false
    },
    image5: {
        type: String,
        required: false
    },
    image6: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('HomeHero', homeHeroSchema)