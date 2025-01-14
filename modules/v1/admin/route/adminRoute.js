import express from 'express';

import adminController from '../controller/adminController.js';

const router = express.Router();

router.post('/login', adminController.login);

router.get('/logout', adminController.logout);

router.post('/change-password', adminController.changePassword);

router.get('/get-profile', adminController.getProfile);

router.post('/update-profile', adminController.updateProfile);

router.get('/users-list', adminController.usersList);

router.post('/update-user-status', adminController.updateUserStatus);

router.post('/delete-user', adminController.deleteUser);

router.get('/vendor-list', adminController.vendorList);

router.post('/delete-vendor', adminController.deleteVendor);

router.post('/update-vendor-status', adminController.updateVendorStatus);

router.get('/service-provider-list', adminController.serviceProviderList);

router.post('/delete-service-provider', adminController.deleteServiceProvider);

router.post('/update-service-provider-status', adminController.updateServiceProviderStatus);

router.post('/get-static-page-content', adminController.getStaticPageContent);

router.post('/update-page-content', adminController.UpdatePageContent);

router.post('/get-details', adminController.getDetails);

router.post('/add-category', adminController.addCategory);

router.get('/category-list', adminController.categoryList);

router.get('/get-store-category', adminController.getStoreCategory);

router.post('/get-category-list-by-store-category', adminController.getCategoryListByStoreCategory);

router.post('/category-list-rolewise', adminController.categoryListRolewise);

router.post('/delete-category', adminController.deleteCategory);

router.post('/update-category-status', adminController.updateCategoryStatus);

router.post('/get-category-details', adminController.getCategorydetails);

router.post('/update-category-details', adminController.updateCategoryDetails);

router.post('/add-subcategory', adminController.addSubCategory);

router.post('/subcategory-list', adminController.subCategoryList);

router.post('/delete-subcategory', adminController.deleteSubCategory);

router.post('/update-subcategory-status', adminController.updateSubCategoryStatus);

router.post('/get-subcategory-details', adminController.getSubCategorydetails);

router.post('/update-subcategory-details', adminController.updateSubCategoryDetails);

router.post('/add-product', adminController.addProduct);

router.get('/product-list', adminController.productList);

router.post('/get-store-product-list', adminController.getStoreProductList);

router.post('/delete-product', adminController.deleteProduct);

router.post('/update-product-status', adminController.updateProductStatus);

router.post('/get-product-details', adminController.getProductDetails);

router.post('/update-product-details', adminController.updateproductDetails);

router.get('/get-dashborad-count', adminController.getDashboradCount);

router.get('/store-list', adminController.storeList);

router.post('/get-store-details', adminController.getStoreDetails);

router.post('/delete-store', adminController.deleteStore);

router.post('/update-store-status', adminController.updateStoreStatus);

router.post('/accept-reject-store', adminController.acceptRejectStore);

router.get('/service-list', adminController.serviceList);

router.post('/get-service-details', adminController.getServiceDetails);

router.post('/delete-service', adminController.deleteService);

router.post('/update-service-status', adminController.updateServiceStatus);

router.post('/accept-reject-service', adminController.acceptRejectService);

router.get('/get-social-links', adminController.getSocialLinks);

router.post('/update-social-links', adminController.updateSocialLinks);

router.get('/get-contact-details', adminController.getContactDetails);

router.post('/update-contact-details', adminController.updateContactDetails);

router.get('/get-Store-category-list', adminController.getStoreCategoryList);

router.post('/update-store-category-status', adminController.updateStoreCategoryStatus);

router.post('/delete-Store-category', adminController.deleteStoreCategory);

router.post('/add-store-category', adminController.addStoreCategory);

router.post('/get-store-category-details', adminController.getStoreCategorydetails);

router.post('/update-store-category-details', adminController.updateStoreCategoryDetails);

router.get('/market-place-list', adminController.marketPlaceList);

router.post('/update-market-place-status', adminController.updateMarketPlaceStatus);

router.post('/delete-market-place', adminController.deleteMarketPlace);

router.post('/add-market-place', adminController.addMarketPlace);

router.post('/update-market-place-details', adminController.updateMarketPlaceDetails);

router.get('/get-subscription-plans', adminController.getSubscriptionPlans);

router.post('/update-subscription-plan-status', adminController.updateSubscriptionPlanStatus);

router.post('/delete-subscription-plan', adminController.deleteSubscriptionPlan);

router.post('/add-subscription-plan', adminController.addSubscriptionPlan);

router.post('/get-subscription-plan-details', adminController.getSubscriptionPlanDetails);

router.post('/update-subscription-plan-details', adminController.updateSubscriptionPlanDetails);

router.get('/get-ad-manager-list', adminController.getAdManagerList);

router.post('/get-ad-manager-details', adminController.getAdManagerDetails);

router.post('/update-ad-manager-status', adminController.updateAdManagerStatus);

router.post('/delete-ad-manager', adminController.deleteAdManager);

router.post('/add-ad-manager', adminController.addAdManager);

router.post('/edit-ad-manager', adminController.editAdManager);

router.post('/send-notification', adminController.sendNotification);

router.get('/get-store-service-category', adminController.getStoreServiceCategory);

router.get('/get-subscription-buyer-list', adminController.getSubscriptionBuyerList);

router.post('/get-subscription-buyer-details', adminController.getSubscriptionBuyerDetails);

router.post('/update-subscription-buyer-status', adminController.updateSubscriptionBuyerStatus);

router.post('/delete-subscription-buyer', adminController.deleteSubscriptionBuyer);

router.post('/add-subscription-buyer', adminController.addSubscriptionBuyer);

router.post('/edit-subscription-buyer', adminController.editSubscriptionBuyer);

router.post('/get-user-list-by-role', adminController.getUsersListByRole);

router.post('/get-store-service-by-user', adminController.getStoreServiceByUser);

router.get('/get-user-contactus-list', adminController.getUserContactUsList);

router.post('/complete-user-contactus', adminController.completeUserContactus);

router.post('/get-faqs-by-role', adminController.getFaqsByRole);

router.post('/update-faqs-status', adminController.updateFaqsStatus);

router.post('/delete-faqs', adminController.deleteFaqs);

router.post('/add-faqs', adminController.addFaqs);

router.post('/update-faqs', adminController.updateFaqs);

router.get('/get-user-feedbacks', adminController.getUserFeedbackList);

router.post('/update-user-feedback-status', adminController.updateUserFeedbackStatus);

router.post('/delete-user-feedback', adminController.deleteUserFeedback);

router.get('/get-feedback-reason', adminController.getFeedbackReason);

router.post('/update-feedback-reason-status', adminController.updateFeedbackReasonStatus);

router.post('/delete-feedback-reason', adminController.deleteFeedbackReason);

router.post('/add-feedback-reason', adminController.addFeedbackReason);

router.post('/update-feedback-reason', adminController.updateFeedbackReason);

router.get('/get-sponsorship-details', adminController.getSponsorshipDetails);

router.post('/update-sponsorship-details', adminController.updateSponsorshipDetails);

router.get('/get-app-version-list', adminController.getAppVersionList);

router.post('/add-app-version', adminController.addAppVersion);

router.post('/edit-app-version-status', adminController.updateAppVersionStatus);

router.post('/delete-app-version', adminController.deleteAppVersion);



export default router;  