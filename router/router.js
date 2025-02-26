const router = require('express').Router();
const { upload, handleMulterErrors, flexibleUpload } = require('../middlewares/multer')
const { register, login, logout, forgotPassword, verifyOtp, resetPassword } = require('../controller/authController');
const { AddBrand, getAllBrands, deleteBrand, getEveryBrands } = require('../controller/brandController');
const { addCategory, getAllCategory, deleteCategory, updateCategory, getCategory, getDistinctParentCategories, editCategoryName, deleteCategoryName, addCategoryName, } = require('../controller/categoryController');
const { addHomeHero, getHomeHero, updateHomeHero } = require('../controller/homeHeroController');
const { addSubHero, getSubHero, updateSubHero } = require('../controller/homeSubHeroController');
const { addPromo, getPromo, updatePromo } = require('../controller/homePromoController');
const { addHomePage, editHomePage, getHomePage } = require('../controller/homePageContentController');
const { addAttributes, getAllAttributes, getAttribute, editAttribute, deleteAttribute, editAttributeValue, deleteAttributeValue, addAttributeValue } = require('../controller/attributeController');
const { addColor, getColors, deleteColor, editColor, getAllColors } = require('../controller/colorsController');
const { getCategoryNamesByParent, addProduct, getProducts, editProduct, deleteProduct, toggleTodaysDeal, getTodaysDeals, toggleFeatured, getFeatured, getDistinctAttributeNames, getAttributeValues, getLatestProducts, getLastTenItems, getProductById, getDistinctCategoryParent, getCategoryNames } = require('../controller/productController');
const { sendMessage } = require('../controller/messageController');
const { enquiry } = require('../controller/enquiryController');

router.route('/reg').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/password_forgot').post(forgotPassword);
router.route('/verify_otp').post(verifyOtp);
router.route('/password_reset').post(resetPassword);

router.route('/brand').post(upload.single('image'), handleMulterErrors, AddBrand);
router.route('/brand').get(upload.single('image'), handleMulterErrors, getAllBrands);
router.route('/brand/:id').delete(deleteBrand);
router.route('/brand/all').get(upload.single('image'), handleMulterErrors, getEveryBrands);


router.route('/category').post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), addCategory);
router.route('/category').get(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), getAllCategory);
router.route('/category/:id').put(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), updateCategory);
router.route('/category/:id').get(getCategory);
router.route('/category/:id').delete(deleteCategory);
router.route('/parent_cat').get(getDistinctParentCategories);
router.route('/category/:id/name').patch(upload.none(), editCategoryName);
router.route('/category/:id/name').delete(deleteCategoryName);
router.route('/category/:id/name').post(upload.none(), addCategoryName);


router.route('/hero').post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 },{ name: 'image4', maxCount: 1 },{ name: 'image5', maxCount: 1 },{ name: 'image6', maxCount: 1 }]), handleMulterErrors, addHomeHero);
router.route('/hero/:id').put(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 },{ name: 'image4', maxCount: 1 },{ name: 'image5', maxCount: 1 },{ name: 'image6', maxCount: 1 }]), handleMulterErrors, updateHomeHero);
router.route('/hero').get(getHomeHero);


router.route('/subhero').post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]), handleMulterErrors, addSubHero);
router.route('/subhero/:id').put(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]), handleMulterErrors, updateSubHero);
router.route('/subhero').get(getSubHero);

router.route('/promo').post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), handleMulterErrors, addPromo);
router.route('/promo/:id').put(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), handleMulterErrors, updatePromo);
router.route('/promo').get(getPromo);

router.route('/pagecontent').post(upload.none(), addHomePage);
router.route('/pagecontent').get(upload.none(), getHomePage);
router.route('/pagecontent/:id').put(upload.none(), editHomePage);

router.route('/attributes').post(upload.none(), addAttributes);
router.route('/attributes').get(getAllAttributes);
router.route('/attributes/:id').get(getAttribute);
router.route('/attributes/:id').put(upload.none(), editAttribute);
router.route('/attributes/:id').delete(deleteAttribute);
router.route('/attributes/:id/value').patch(upload.none(), editAttributeValue);
router.route('/attributes/:id/value').delete(deleteAttributeValue);
router.route('/attributes/:id/value').post(upload.none(), addAttributeValue);

router.route('/color').post(upload.none(), addColor);
router.route('/color').get(upload.none(), getColors);
router.route('/color/:id').delete(deleteColor);
router.route('/color/:id').put(upload.none(), editColor);
router.route('/color/all').get(upload.none(), getAllColors);


router.route('/categories/by-parent').get(upload.none(), getCategoryNamesByParent);
router.route('/product').post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery1', maxCount: 1 }, { name: 'gallery2', maxCount: 1 }, { name: 'gallery3', maxCount: 1 }, { name: 'gallery4', maxCount: 1 }, { name: 'gallery5', maxCount: 1 },]), addProduct);
router.route('/product').get(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery1', maxCount: 1 }, { name: 'gallery2', maxCount: 1 }, { name: 'gallery3', maxCount: 1 }, { name: 'gallery4', maxCount: 1 }, { name: 'gallery5', maxCount: 1 },]), getProducts);
router.route('/product/:id').put(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery1', maxCount: 1 }, { name: 'gallery2', maxCount: 1 }, { name: 'gallery3', maxCount: 1 }, { name: 'gallery4', maxCount: 1 }, { name: 'gallery5', maxCount: 1 },]), editProduct);
router.route('/product/:id').delete(deleteProduct);
router.route('/product/:id/todays-deal').patch(upload.none(), toggleTodaysDeal);
router.route('/product/todays-deal').get(getTodaysDeals);
router.route('/product/:id/featured').patch(upload.none(), toggleFeatured);
router.route('/product/featured').get(getFeatured);
router.route('/attribut_name').get(getDistinctAttributeNames);
router.route('/attributes/:id/values').get(getAttributeValues);
router.route('/latest').get(getLatestProducts);
router.route('/last').get(getLastTenItems);
router.route('/product/:id').get(getProductById);
router.route('/parent_category').get(getDistinctCategoryParent);
router.route('/cat/:id/name').get(getCategoryNames);

router.route('/message').post(upload.none(),sendMessage);
router.route('/enquiry').post(upload.fields([{ name: 'design', maxCount: 1 }]),enquiry);


module.exports = router;
