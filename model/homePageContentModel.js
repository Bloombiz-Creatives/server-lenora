const  mongoose  = require("mongoose");

const homePageContentSchema = new mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('HomePage',homePageContentSchema)