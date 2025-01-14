import authModule from '../module/authModule.js';
import middleware from '../../../../middleware/headerValidator.js';
import validationRules from '../validation_rules.js';
import CODES from '../../../../app-config/status_code.js';

const auth = {
    // signup for user
    async signup(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(
                request,
                request.role == '0'
                    ? validationRules.userSignUp
                    : request.role == '1'
                        ? validationRules.vendorSignUp
                        : validationRules.serviceProviderSignUp
            );
            if (valid.status) {
                request.language = req.lang;
                return authModule.signup(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // login for user
    async login(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.login);
            if (valid.status) {
                return authModule.login(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // logout for patient/doctor/chemist from website (27-09-2023)
    async logout(req, res) {
        return authModule.logout(req, res);
    },

    // delete account
    async deleteAccount(req, res) {
        return authModule.deleteAccount(req, res);
    },

    //enable disable notification
    async enableDisableNotification(req, res) {
        middleware.decryption(req.body, function (request) {
            request.user_id = req.user_id;
            const valid = middleware.checkValidationRules(request, validationRules.enableDisableNotification);
            if (valid.status) {
                return authModule.enableDisableNotification(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // send otp
    async sendOtp(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.sendOtp);
            if (valid.status) {
                return authModule.sendOtp(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // verify otp
    async verifyOtp(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.verifyOtp);
            if (valid.status) {
                return authModule.verifyOtp(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // new password
    async newPassword(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.newPassword);
            if (valid.status) {
                return authModule.newPassword(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Change password for user
    async changePassword(req, res) {
        middleware.decryption(req.body, function (request) {
            request.user_id = req.user_id;
            const valid = middleware.checkValidationRules(request, validationRules.changePassword);
            if (valid.status) {
                return authModule.changePassword(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get profile details
    async getProfile(req, res) {
        return authModule.getProfile(req, res);
    },

    // get market place
    async getMarketPlace(req, res) {
        return authModule.getMarketPlace(req, res);
    },

    // update profile
    async updateProfile(req, res) {
        middleware.decryption(req.body, function (request) {
            request.user_id = req.user_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateProfile);
            if (valid.status) {
                return authModule.updateProfile(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get store category
    async getStoreCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getStoreCategory);
            if (valid.status) {
                return authModule.getStoreCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get product category
    async getProductCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getProductCategory);
            if (valid.status) {
                return authModule.getProductCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get product sub category
    async getProductSubCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getProductSubCategory);
            if (valid.status) {
                return authModule.getProductSubCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add vendor product
    async addProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addProduct);
            if (valid.status) {
                return authModule.addProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //delete product
    async deleteProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.deleteProduct);
            if (valid.status) {
                return authModule.deleteProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get product details
    async getProductDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getProductDetails);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.getProductDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update vendor product
    async updateProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.updateProduct);
            if (valid.status) {
                return authModule.updateProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getStoreList
    async getStoreList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getStoreList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getStoreList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getStoreDetails
    async getStoreDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getStoreDetails);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.getStoreDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getStoreProductList
    async getStoreProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getStoreProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getStoreProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // addStoreDetails for user
    async addStoreDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addStoreDetails);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.addStoreDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // updateStoreDetails for user
    async updateStoreDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.updateStoreDetails);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.updateStoreDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // deleteStoreDetails for user
    async deleteStoreDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.deleteStoreDetails);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.deleteStoreDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getMostRatedProductList
    async getMostRatedProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getMostRatedProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getMostRatedProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getMostTradingProductList
    async getMostTradingProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getMostTradingProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getMostTradingProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // updateProductStatus
    async updateProductStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.updateProductStatus);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.updateProductStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getS3BucketUrl
    async getS3BucketUrl(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getS3BucketUrl);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getS3BucketUrl(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getDashboardCount
    async getDashboardCount(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getDashboardCount);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getDashboardCount(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getSaveProductList
    async getSaveProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getSaveProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getSaveProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getSaveProductUserList
    async getSaveProductUserList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getSaveProductUserList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getSaveProductUserList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getLikeProductList
    async getLikeProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getLikeProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getLikeProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getVenodrLikeProductList
    async getVenodrLikeProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getVenodrLikeProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getVenodrLikeProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get subscription plans
    async getSubscriptionPlans(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getSubscriptionPlans);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getSubscriptionPlans(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get notification list
    async getNotificationList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getNotificationList);
            if (valid.status) {
                return authModule.getNotificationList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //  get services
    async getServices(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getServices);
            if (valid.status) {
                return authModule.getServices(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add service
    async addService(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addService);
            if (valid.status) {
                return authModule.addService(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update service
    async updateService(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.updateService);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.updateService(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //delete service
    async deleteService(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.deleteService);
            if (valid.status) {
                return authModule.deleteService(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getProductList
    async getProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getProductList);
            if (valid.status) {
                request.user_id = req.user_id;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // likeUnlikeProduct
    async likeUnlikeProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.likeUnlikeProduct);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.likeUnlikeProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // saveUnsaveProduct
    async saveUnsaveProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.saveUnsaveProduct);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.saveUnsaveProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // saveUnsaveProduct
    async getServiceProviderList(req, res) {
        return authModule.getServiceProviderList(req, res);
    },

    // follow unfollow vendor & service provider
    async followUnfollow(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.followUnfollow);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.followUnfollow(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add product review
    async addReview(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addReview);
            if (valid.status) {
                request.user_id = req.user_id;
                request.language = req.lang;
                return authModule.addReview(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // edit product review
    async editReview(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.editReview);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.editReview(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete product review
    async deleteReview(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.deleteReview);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.deleteReview(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //get review list
    async getReviewList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getReviewList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getReviewList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //get service provider details
    async getServiceProviderDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getServiceProviderDetails);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.getServiceProviderDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getSimilarProducts
    async getSimilarProducts(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getSimilarProducts);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getSimilarProducts(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getTopCategories
    async getTopCategories(req, res) {
        return authModule.getTopCategories(req, res);
    },

    // user home page
    async homePage(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.homePage);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.homePage(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get user home page all products
    async getAllProducts(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getAllProducts);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getAllProducts(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getUserStoreList
    async getUserStoreList(req, res) {
        middleware.decryption(req.body, function (request) {
        console.log('req: ', req.ip);
            // let request = JSON.parse(req.body)
            const valid = middleware.checkValidationRules(request, validationRules.getUserStoreList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.getUserStoreList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get user all store list
    async getAllUserStoreList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getAllUserStoreList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getAllUserStoreList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getUserServiceProviderList
    async getUserServiceProviderList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getUserServiceProviderList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.getUserServiceProviderList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get user all service provider list
    async getAllUserServiceProviderList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getAllUserServiceProviderList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getAllUserServiceProviderList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // getUserStoreProductList
    async getUserStoreProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getUserStoreProductList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                request.limit = (request.page - 1) * request.record_count;
                return authModule.getUserStoreProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // chatNotification
    async chatNotification(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.chatNotification);
            if (valid.status) {
                request.user_id = req.user_id;
                request.language = req.lang;
                return authModule.chatNotification(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // adBannerList
    async adBannerList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.adBannerList);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.adBannerList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // send otp
    async sendOtpEditProfile(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.sendOtpEditProfile);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.sendOtpEditProfile(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add feeback
    async addFeeback(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addFeeback);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.addFeeback(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add contactUs
    async addContactUs(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addContactUs);
            if (valid.status) {
                request.user_id = (req.user_id != undefined) ? req.user_id : 0;
                return authModule.addContactUs(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //feedback reasons list
    async feedbackReasonsList(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.feedbackReasonsList);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.feedbackReasonsList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //add impression count
    async addImpressionCount(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.addImpressionCount);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.addImpressionCount(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //get contact details
    async getContactDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.getContactDetails);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getContactDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //check app version
    async checkAppVersion(req, res) {
        // middleware.decryption(req.body, function (request) {
        const request = JSON.parse(req.body)
            const valid = middleware.checkValidationRules(request, validationRules.checkAppVersion);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.checkAppVersion(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        // });
    },

    //get store category and sub category
    async getStoreCategorySubcategory(req, res) {
        middleware.decryption(req.body, function (request) {
            //    let request = JSON.parse(req.body);
            const valid = middleware.checkValidationRules(request, validationRules.getStoreCategorySubcategory);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getStoreCategorySubcategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //get product category and sub category
    async getProductCategorySubcategory(req, res) {
        middleware.decryption(req.body, function (request) {
            // let request = JSON.parse(req.body);
            const valid = middleware.checkValidationRules(request, validationRules.getProductCategorySubcategory);
            if (valid.status) {
                request.user_id = req.user_id;
                return authModule.getProductCategorySubcategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },
};

export default auth;
