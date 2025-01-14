import express from 'express';
import localizify from 'localizify';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import authController from '../controller/authController.js';
import middleware from '../../../../middleware/headerValidator.js';
const {default: local} = localizify;
const {t} = localizify;
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/html/images');
        //   cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var uploads = multer({storage: storage});

router.post('/imageUpload', uploads.single('image'), function (req, res, next) {
    return middleware.sendApiResponse(
        res,
        200,
        t('rest_keywords_image_upload_success'),
        process.env.IMAGE_BASE_URL + req.file.filename
    );
    // return middleware.sendApiResponse(res, 200, valid.error, null);
});

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/deleteAccount', authController.deleteAccount);

router.post('/send-otp', authController.sendOtp);

router.post('/verify-otp', authController.verifyOtp);

router.post('/new-password', authController.newPassword);

router.post('/change-password', authController.changePassword);

router.get('/get-profile', authController.getProfile);

router.post('/update-profile', authController.updateProfile);

router.post('/enable-disable-notification', authController.enableDisableNotification);

router.get('/get-market-place', authController.getMarketPlace);

router.post('/get-store-category', authController.getStoreCategory);

router.post('/get-product-category', authController.getProductCategory);

router.post('/get-product-subcategory', authController.getProductSubCategory);

router.post('/addProduct', authController.addProduct);

router.post('/deleteProduct', authController.deleteProduct);

router.post('/getProductDetails', authController.getProductDetails);

router.post('/updateProduct', authController.updateProduct);

router.post('/get-store-list', authController.getStoreList);

router.post('/get-store-details', authController.getStoreDetails);

router.post('/get-store-product-list', authController.getStoreProductList);

router.post('/add-store-details', authController.addStoreDetails);

router.post('/update-store-details', authController.updateStoreDetails);

router.post('/delete-store-details', authController.deleteStoreDetails);

router.post('/get-most-rated-product-list', authController.getMostRatedProductList);

router.post('/get-most-trading-product-list', authController.getMostTradingProductList);

router.post('/update-product-status', authController.updateProductStatus);

router.post('/get-s3bucket-url', authController.getS3BucketUrl);

router.post('/get-dashboard-count', authController.getDashboardCount);

router.post('/get-save-product-list', authController.getSaveProductList);

router.post('/get-save-product-user-list', authController.getSaveProductUserList);

router.post('/get-like-product-list', authController.getLikeProductList);

router.post('/get-venodr-like-product-list', authController.getVenodrLikeProductList);

router.post('/get-subscription-plans', authController.getSubscriptionPlans);

router.post('/get-notification-list', authController.getNotificationList);

router.post('/get-services', authController.getServices);

router.post('/addService', authController.addService);

router.post('/updateService', authController.updateService);

router.post('/deleteService', authController.deleteService);

router.post('/getProductList', authController.getProductList);

router.post('/likeUnlikeProduct', authController.likeUnlikeProduct);

router.post('/saveUnsaveProduct', authController.saveUnsaveProduct);

router.post('/getServiceProviderList', authController.getServiceProviderList);

router.post('/followUnfollow', authController.followUnfollow);

router.post('/addReview', authController.addReview);

router.post('/edit-review', authController.editReview);

router.post('/delete-review', authController.deleteReview);

router.post('/getReviewList', authController.getReviewList);

router.post('/getServiceProviderDetails', authController.getServiceProviderDetails);

router.post('/getSimilarProducts', authController.getSimilarProducts);

router.get('/get-top-categories', authController.getTopCategories);

router.post('/homePage', authController.homePage);

router.post('/getAllProducts', authController.getAllProducts);

router.post('/getUserStoreList', authController.getUserStoreList);

router.post('/getAllUserStoreList', authController.getAllUserStoreList);

router.post('/getUserServiceProviderList', authController.getUserServiceProviderList);

router.post('/getAllUserServiceProviderList', authController.getAllUserServiceProviderList);

router.post('/get-user-store-product-list', authController.getUserStoreProductList);

router.post('/chat-notification', authController.chatNotification);

router.post('/ad-banner-list', authController.adBannerList);

router.post('/send-otp-edit-profile', authController.sendOtpEditProfile);

router.post('/add-feeback', authController.addFeeback);

router.post('/add-contactus', authController.addContactUs);

router.post('/feedback-reasons-list', authController.feedbackReasonsList);

router.post('/add-impression-count', authController.addImpressionCount);

router.get('/get-contact-details', authController.getContactDetails);

router.post('/check-app-version', authController.checkAppVersion);

router.post('/get-store-category-subcategory', authController.getStoreCategorySubcategory);

router.post('/get-product-category-subcategory', authController.getProductCategorySubcategory);

export default router;
