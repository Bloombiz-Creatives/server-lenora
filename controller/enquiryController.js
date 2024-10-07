// const catchAsyncError = require("../middlewares/catchAsyncError");
// const Enquiry = require('../model/enquirySchema');
// const Attribute = require('../model/attributeModel');

// exports.enquiry = catchAsyncError(async (req, res, next) => {
//     try {
//         const sizes = req.body.sizes;

//         if (!sizes) {
//             return res.status(400).json({ message: 'Sizes data is missing or undefined' });
//         }

//         let parsedSizes;
//         try {
//             parsedSizes = JSON.parse(sizes);
//         } catch (err) {
//             return res.status(400).json({ message: 'Invalid JSON format in sizes' });
//         }

//         if (!Array.isArray(parsedSizes)) {
//             return res.status(400).json({ message: 'Parsed sizes is not an array' });
//         }

//         const attribute = await Attribute.findOne({ name: 'Size' });
//         if (!attribute) {
//             return res.status(404).json({ message: 'Attribute not found' });
//         }

//         const validSizes = attribute.value;
//         const enquiries = [];

//         parsedSizes.forEach(({ size, qty }) => {
//             if (validSizes.includes(size)) {
//                 enquiries.push({ size, qty });
//             }
//         });

//         const newEnquiry = new Enquiry({ sizes: enquiries });
//         const savedEnquiry = await newEnquiry.save();

//         res.status(201).json({ message: 'Enquiry submitted successfully', data: savedEnquiry });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// const catchAsyncError = require("../middlewares/catchAsyncError");
// const Enquiry = require('../model/enquirySchema');
// const Attribute = require('../model/attributeModel');

// exports.enquiry = catchAsyncError(async (req, res, next) => {
//     try {
//         const { sizes, category, color, quantity, name } = req.body;

//         // Validate mandatory fields
//         if (!name || !category) {
//             return res.status(400).json({ message: 'Name and Category are required' });
//         }

//         if (!sizes) {
//             return res.status(400).json({ message: 'Sizes data is missing or undefined' });
//         }

//         let parsedSizes;
//         try {
//             parsedSizes = JSON.parse(sizes);
//         } catch (err) {
//             return res.status(400).json({ message: 'Invalid JSON format in sizes' });
//         }

//         if (!Array.isArray(parsedSizes)) {
//             return res.status(400).json({ message: 'Parsed sizes is not an array' });
//         }

//         const attribute = await Attribute.findOne({ name: 'Size' });
//         if (!attribute) {
//             return res.status(404).json({ message: 'Attribute not found' });
//         }

//         if (!req.files || !req.files.design) {
//             return next(new ErrorHandler('Design is required', 400));
//         }

//         const design = `${process.env.BACKEND_URL}/upload/${req.files.design[0].filename}`;


//         const validSizes = attribute.value;
//         const enquiries = [];

//         parsedSizes.forEach(({ size, qty }) => {
//             if (validSizes.includes(size)) {
//                 enquiries.push({ size, qty });
//             }
//         });

//         const newEnquiry = new Enquiry({
//             name,
//             category,
//             sizes: enquiries,
//             color,
//             design,
//             quantity,
//         });

//         const savedEnquiry = await newEnquiry.save();

//         res.status(201).json({ message: 'Enquiry submitted successfully', data: savedEnquiry });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

const catchAsyncError = require("../middlewares/catchAsyncError");
const Enquiry = require('../model/enquirySchema');

exports.enquiry = catchAsyncError(async (req, res, next) => {
    try {
        let design = '';
        if (req.files && req.files.design) {
            design = `${process.env.BACKEND_URL}/upload/${req.files.design[0].filename}`;
        }

        const newEnquiry = new Enquiry({
            design,
        });

        const savedEnquiry = await newEnquiry.save();

        res.status(201).json({ message: 'Enquiry submitted successfully', data: savedEnquiry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});