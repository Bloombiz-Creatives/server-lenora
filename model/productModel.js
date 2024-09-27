const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    parent_category: {
        // type: mongoose.Schema.Types.ObjectId,
        // type: String,
        // required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        type: String,
        
    },
    sub_category: {
        // type: mongoose.Schema.Types.ObjectId,
        // type: String,
        // required: true,

        type: [String],
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    gallery1: {
        type: String
    },
    gallery2: {
        type: String
    },
    gallery3: {
        type: String
    },
    gallery4: {
        type: String
    },
    gallery5: {
        type: String
    },
    meta_title: {
        type: String,
    },
    meta_desc: {
        type: String,
    },
    attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attribute',
        type: String,
    },
   
    attribute_value: {
        type: [String], // Changed to array of strings
    },
    color: {
        type: [mongoose.Schema.Types.ObjectId], // Changed to array of ObjectIds
        ref: 'Colors',
        required: false
    },
    todaysDeal: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
