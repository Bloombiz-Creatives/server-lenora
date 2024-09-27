const  mongoose  = require("mongoose");

const homeSubHeroSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('HomeSubHero' , homeSubHeroSchema)