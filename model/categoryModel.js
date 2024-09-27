// const  mongoose  = require("mongoose");

// const categorySchema = new mongoose.Schema({
//     parent_category:{
//         type:String,
//         required:true,
//     },
//     name:{
//         type:String,
//         required:true    
//     },
//     image:{
//         type:String,
//         required:true
//     },
//     icon:{
//         type:String,
//         required:true    
//     }
// },{timestamps:true})

// module.exports = mongoose.model('Category',categorySchema)


const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    parent_category: {
        type: String,
        required: true,
    },
    name: [
        {
            type: String,
        }
    ],
    image: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)