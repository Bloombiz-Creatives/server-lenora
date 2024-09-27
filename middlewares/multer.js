const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        let name = file.originalname.replace(/\s+/g, '_'); 
        name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_'); 

        const ext = path.extname(file.originalname);

        const nameWithoutExt = path.parse(name).name;

        const newFilename = new Date().toISOString().replace(/:/g, '-') + '_' + nameWithoutExt + ext;

        cb(null, newFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'image/avif',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 
    },
    fileFilter: fileFilter
});


const flexibleUpload = (fields) => {
    return (req, res, next) => {
        const uploadFields = upload.fields(fields);
        uploadFields(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return next();
                }
                return handleMulterErrors(err, req, res, next);
            } else if (err) {
                return handleMulterErrors(err, req, res, next);
            }
            next();
        });
    };
};

const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log(err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds the limit' });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: `Unexpected field: ${err.field}` });
        } else {
            return res.status(500).json({ error: `Multer error: ${err.message}` });
        }
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

module.exports = { upload, flexibleUpload, handleMulterErrors };


//new....................................................................
// const multer = require("multer");
// const path = require('path');
// const sharp = require('sharp');
// const fs = require('fs').promises;

// let totalOriginalSize = 0;
// let totalResizedSize = 0;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './upload/');
//     },
//     filename: function (req, file, cb) {
//         let name = file.originalname.replace(/\s+/g, '_'); 
//         name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_'); 

//         const ext = path.extname(file.originalname);
//         const nameWithoutExt = path.parse(name).name;
//         const newFilename = new Date().toISOString().replace(/:/g, '-') + '_' + nameWithoutExt + ext;

//         cb(null, newFilename);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         'image/jpeg',
//         'image/jpg',
//         'image/png',
//         'image/svg+xml',
//         'image/gif',
//         'image/webp',
//         'video/mp4',
//         'video/mpeg',
//         'video/quicktime',
//         'image/avif',
//     ];
    
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10 
//     },
//     fileFilter: fileFilter
// });

// const resizeImage = async (file) => {
//     const ext = path.extname(file.filename).toLowerCase();
//     const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp'];
    
//     if (allowedImageTypes.includes(ext)) {
//         const filePath = path.join('./upload/', file.filename);
//         const stats = await fs.stat(filePath);
//         const originalSize = stats.size;
//         totalOriginalSize += originalSize;

//         console.log(`Original size of ${file.filename}: ${originalSize} bytes`);

//         try {
//             await sharp(filePath)
//                 .resize({ width: 800, withoutEnlargement: true }) // Resize to 800px width, don't enlarge if smaller
//                 .toFile(path.join('./upload/', 'resized_' + file.filename));

//             const resizedStats = await fs.stat(path.join('./upload/', 'resized_' + file.filename));
//             const resizedSize = resizedStats.size;
//             totalResizedSize += resizedSize;

//             console.log(`Resized size of ${file.filename}: ${resizedSize} bytes`);
//             console.log(`Size reduction: ${originalSize - resizedSize} bytes (${((originalSize - resizedSize) / originalSize * 100).toFixed(2)}%)`);

//             // Remove the original file
//             await fs.unlink(filePath);
            
//             // Rename the resized file to the original filename
//             await fs.rename(path.join('./upload/', 'resized_' + file.filename), filePath);

//             return resizedSize;
//         } catch (error) {
//             console.error(`Error resizing ${file.filename}:`, error);
//             totalResizedSize += originalSize; // If resize fails, count original size
//             return originalSize;
//         }
//     } else {
//         const stats = await fs.stat(path.join('./upload/', file.filename));
//         totalOriginalSize += stats.size;
//         totalResizedSize += stats.size;
//         return stats.size;
//     }
// };

// const flexibleUpload = (fields) => {
//     return (req, res, next) => {
//         const uploadFields = upload.fields(fields);
//         uploadFields(req, res, async (err) => {
//             if (err instanceof multer.MulterError) {
//                 if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//                     return next();
//                 }
//                 return handleMulterErrors(err, req, res, next);
//             } else if (err) {
//                 return handleMulterErrors(err, req, res, next);
//             }

//             // Reset total sizes for this upload
//             totalOriginalSize = 0;
//             totalResizedSize = 0;

//             // Resize images after successful upload
//             try {
//                 for (const fieldName in req.files) {
//                     for (const file of req.files[fieldName]) {
//                         await resizeImage(file);
//                     }
//                 }
//                 console.log(`Total original size: ${totalOriginalSize} bytes`);
//                 console.log(`Total size after resizing: ${totalResizedSize} bytes`);
//                 console.log(`Total size reduction: ${totalOriginalSize - totalResizedSize} bytes (${((totalOriginalSize - totalResizedSize) / totalOriginalSize * 100).toFixed(2)}%)`);
//             } catch (error) {
//                 console.error('Error resizing images:', error);
//             }

//             next();
//         });
//     };
// };

// const handleMulterErrors = (err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         console.log(err);
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).json({ error: 'File size exceeds the limit' });
//         } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//             return res.status(400).json({ error: `Unexpected field: ${err.field}` });
//         } else {
//             return res.status(500).json({ error: `Multer error: ${err.message}` });
//         }
//     } else if (err) {
//         return res.status(400).json({ error: err.message });
//     }
//     next();
// };

// module.exports = { upload, flexibleUpload, handleMulterErrors };