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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        type: String,
        
    },
    sub_category: {
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
    attributes: [{
        attribute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attribute',
        },
        attribute_value: [{
            value: String
        }]
    }],
    variants: [{
        combination: String, 
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        sku: String 
    }],
    color: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Colors',
        required: false
    },
    todaysDeal: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
