// const mongoose = require("mongoose");

// const enquirySchema = new mongoose.Schema({
//     sizes: [
//         {
//             size: {
//                 type: String,
//                 required: true
//             },
//             qty: {
//                 type: Number,
//                 required: true,
//                 default: 0
//             }
//         }
//     ],
//     design: {
//         type: String,  
//         required: false, 
//     },
//     category:{
//         type: String,
//         required:true
//     },
//     color: {
//         type: [mongoose.Schema.Types.ObjectId], 
//         ref: 'Colors',
//         required: false
//     },
//     quantity:{
//         type:String,
//     },
//     name:{
//         type:String,
//         required:true,
//     }
// }, {timestamps: true});

// module.exports = mongoose.model('Enquiry', enquirySchema);


const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
   
    design: {
        type: String,  
        required: false, 
    },
   
}, {timestamps: true});

module.exports = mongoose.model('Enquiry', enquirySchema);
