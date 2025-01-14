import adminModule from '../module/adminModule.js';
import middleware from '../../../../middleware/headerValidator.js';
import validationRules from '../validation_rules.js';
import CODES from '../../../../app-config/status_code.js';

const adminController = {
    // login for admin
    async login(req, res) {
        middleware.decryption(req.body, function (request) {
            const valid = middleware.checkValidationRules(request, validationRules.login);

            if (valid.status) {
                return adminModule.login(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // logout for admin from admin panel
    async logout(req, res) {
        return adminModule.logout(req, res);
    },

    // Change password for admin
    async changePassword(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.changePassword);
            if (valid.status) {
                return adminModule.changePassword(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get profile details for admin
    async getProfile(req, res) {
        return adminModule.getProfile(req, res);
    },

    // Update profile for admin
    async updateProfile(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;

            const valid = middleware.checkValidationRules(request, validationRules.updateProfile);
            if (valid.status) {
                return adminModule.updateProfile(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get users list api for
    async usersList(req, res) {
        return adminModule.usersList(req, res);
    },

    // update user status
    async updateUserStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateUserStatus);
            if (valid.status) {
                return adminModule.updateUserStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete user
    async deleteUser(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteUser);
            if (valid.status) {
                return adminModule.deleteUser(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get vendor list api for
    async vendorList(req, res) {
        return adminModule.vendorList(req, res);
    },

    // delete user
    async deleteVendor(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteVendor);
            if (valid.status) {
                return adminModule.deleteVendor(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update user status
    async updateVendorStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateVendorStatus);
            if (valid.status) {
                return adminModule.updateVendorStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get vendor list api for
    async serviceProviderList(req, res) {
        return adminModule.serviceProviderList(req, res);
    },

    // delete user
    async deleteServiceProvider(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteServiceProvider);
            if (valid.status) {
                return adminModule.deleteServiceProvider(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update user status
    async updateServiceProviderStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateServiceProviderStatus);
            if (valid.status) {
                return adminModule.updateServiceProviderStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get static page content
    async getStaticPageContent(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getStaticPageContent);
            if (valid.status) {
                return adminModule.getStaticPageContent(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Update page contents
    async UpdatePageContent(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;

            const valid = middleware.checkValidationRules(request, validationRules.UpdatePageContent);
            if (valid.status) {
                return adminModule.UpdatePageContent(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get user vendor & service provider details
    async getDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;

            const valid = middleware.checkValidationRules(request, validationRules.getDetails);
            if (valid.status) {
                return adminModule.getDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add category
    async addCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addCategory);
            if (valid.status) {
                return adminModule.addCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get store category api
    async getStoreCategory(req, res) {
        return adminModule.getStoreCategory(req, res);
    },

    // Get category list api for
    async categoryList(req, res) {
        return adminModule.categoryList(req, res);
    },
    
    // delete category
    async deleteCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteCategory);
            if (valid.status) {
                return adminModule.deleteCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update category status
    async updateCategoryStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateCategoryStatus);
            if (valid.status) {
                return adminModule.updateCategoryStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get category details
    async getCategorydetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getCategorydetails);
            if (valid.status) {
                return adminModule.getCategorydetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update category details
    async updateCategoryDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateCategoryDetails);
            if (valid.status) {
                return adminModule.updateCategoryDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add sub category
    async addSubCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addSubCategory);
            if (valid.status) {
                return adminModule.addSubCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get sub category list api for
    async subCategoryList(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.subCategoryList);
            if (valid.status) {
                return adminModule.subCategoryList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete sub category
    async deleteSubCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteSubCategory);
            if (valid.status) {
                return adminModule.deleteSubCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update category status
    async updateSubCategoryStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSubCategoryStatus);
            if (valid.status) {
                return adminModule.updateSubCategoryStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get subcategory details
    async getSubCategorydetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getSubCategorydetails);
            if (valid.status) {
                return adminModule.getSubCategorydetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update category details
    async updateSubCategoryDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSubCategoryDetails);
            if (valid.status) {
                return adminModule.updateSubCategoryDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add product
    async addProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addProduct);
            if (valid.status) {
                return adminModule.addProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get sub category list api for
    async productList(req, res) {
        return adminModule.productList(req, res);
    },

    // get Store Product List
    async getStoreProductList(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getStoreProductList);
            if (valid.status) {
                return adminModule.getStoreProductList(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete sub category
    async deleteProduct(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteProduct);
            if (valid.status) {
                return adminModule.deleteProduct(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update category status
    async updateProductStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateProductStatus);
            if (valid.status) {
                return adminModule.updateProductStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get product details
    async getProductDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getProductDetails);
            if (valid.status) {
                return adminModule.getProductDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update product details
    async updateproductDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateproductDetails);
            if (valid.status) {
                return adminModule.updateproductDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Category List By Store Category
    async getCategoryListByStoreCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getCategoryListByStoreCategory);
            if (valid.status) {
                return adminModule.getCategoryListByStoreCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // categoryListRolewise
    async categoryListRolewise(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.categoryListRolewise);
            if (valid.status) {
                return adminModule.categoryListRolewise(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get Dashborad Count Api
    async getDashboradCount(req, res) {
        return adminModule.getDashboradCount(req, res);
    },

    // Get store list
    async storeList(req, res) {
        return adminModule.storeList(req, res);
    },

    // get Store Details
    async getStoreDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getStoreDetails);
            if (valid.status) {
                return adminModule.getStoreDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete store
    async deleteStore(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteStore);
            if (valid.status) {
                return adminModule.deleteStore(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update store status
    async updateStoreStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateStoreStatus);
            if (valid.status) {
                return adminModule.updateStoreStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // accept reject store
    async acceptRejectStore(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.acceptRejectStore);
            if (valid.status) {
                return adminModule.acceptRejectStore(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get service list
    async serviceList(req, res) {
        return adminModule.serviceList(req, res);
    },

    // get Service Details
    async getServiceDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getServiceDetails);
            if (valid.status) {
                return adminModule.getServiceDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete service
    async deleteService(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteService);
            if (valid.status) {
                return adminModule.deleteService(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update service status
    async updateServiceStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateServiceStatus);
            if (valid.status) {
                return adminModule.updateServiceStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },
    
    // accept reject store
    async acceptRejectService(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.acceptRejectService);
            if (valid.status) {
                return adminModule.acceptRejectService(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get social links
    async getSocialLinks(req, res) {
        return adminModule.getSocialLinks(req, res);
    },

    // update social links
    async updateSocialLinks(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSocialLinks);
            if (valid.status) {
                return adminModule.updateSocialLinks(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get contact details
    async getContactDetails(req, res) {
        return adminModule.getContactDetails(req, res);
    },

    // update contact details
    async updateContactDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateContactDetails);
            if (valid.status) {
                return adminModule.updateContactDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get store category list
    async getStoreCategoryList(req, res) {
        return adminModule.getStoreCategoryList(req, res);
    },

    // Get store service category
    async getStoreServiceCategory(req, res) {
        return adminModule.getStoreServiceCategory(req, res);
    },

    // update store category status
    async updateStoreCategoryStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateStoreCategoryStatus);
            if (valid.status) {
                return adminModule.updateStoreCategoryStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete store category
    async deleteStoreCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteStoreCategory);
            if (valid.status) {
                return adminModule.deleteStoreCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add store category
    async addStoreCategory(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addStoreCategory);
            if (valid.status) {
                return adminModule.addStoreCategory(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get store category details
    async getStoreCategorydetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getStoreCategorydetails);
            if (valid.status) {
                return adminModule.getStoreCategorydetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update store category details
    async updateStoreCategoryDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateStoreCategoryDetails);
            if (valid.status) {
                return adminModule.updateStoreCategoryDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get Market Place List
    async marketPlaceList(req, res) {
        return adminModule.marketPlaceList(req, res);
    },

    // update Market Place Status
    async updateMarketPlaceStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateMarketPlaceStatus);
            if (valid.status) {
                return adminModule.updateMarketPlaceStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete Market Place
    async deleteMarketPlace(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteMarketPlace);
            if (valid.status) {
                return adminModule.deleteMarketPlace(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add Market Place
    async addMarketPlace(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addMarketPlace);
            if (valid.status) {
                return adminModule.addMarketPlace(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },
    
    // update Market Place details
    async updateMarketPlaceDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateMarketPlaceDetails);
            if (valid.status) {
                return adminModule.updateMarketPlaceDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Subscription Plans
    async getSubscriptionPlans(req, res) {
        return adminModule.getSubscriptionPlans(req, res);
    },

    // update Subscription Plan Status
    async updateSubscriptionPlanStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSubscriptionPlanStatus);
            if (valid.status) {
                return adminModule.updateSubscriptionPlanStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete Subscription Plan
    async deleteSubscriptionPlan(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteSubscriptionPlan);
            if (valid.status) {
                return adminModule.deleteSubscriptionPlan(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add Subscription Plan
    async addSubscriptionPlan(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addSubscriptionPlan);
            if (valid.status) {
                return adminModule.addSubscriptionPlan(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Subscription Plan Details
    async getSubscriptionPlanDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getSubscriptionPlanDetails);
            if (valid.status) {
                return adminModule.getSubscriptionPlanDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update Subscription Plan Details
    async updateSubscriptionPlanDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSubscriptionPlanDetails);
            if (valid.status) {
                return adminModule.updateSubscriptionPlanDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    //get Ad Manager List
    async getAdManagerList(req, res) {
        return adminModule.getAdManagerList(req, res);
    },

    // get AdManager Details
    async getAdManagerDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getAdManagerDetails);
            if (valid.status) {
                return adminModule.getAdManagerDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update AdManager Status
    async updateAdManagerStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateAdManagerStatus);
            if (valid.status) {
                return adminModule.updateAdManagerStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete AdManager
    async deleteAdManager(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteAdManager);
            if (valid.status) {
                return adminModule.deleteAdManager(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },
  
    // add AdManager
    async addAdManager(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addAdManager);
            if (valid.status) {
                return adminModule.addAdManager(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // edit AdManager
    async editAdManager(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.editAdManager);
            if (valid.status) {
                return adminModule.editAdManager(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // send Notification
    async sendNotification(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.sendNotification);
            if (valid.status) {
                return adminModule.sendNotification(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get subscription buyer list
    async getSubscriptionBuyerList(req, res) {
        return adminModule.getSubscriptionBuyerList(req, res);
    },
    
    // get Subscription Buyer Details
    async getSubscriptionBuyerDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getSubscriptionBuyerDetails);
            if (valid.status) {
                return adminModule.getSubscriptionBuyerDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update Subscription Buyer Status
    async updateSubscriptionBuyerStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateSubscriptionBuyerStatus);
            if (valid.status) {
                return adminModule.updateSubscriptionBuyerStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete Subscription Buyer
    async deleteSubscriptionBuyer(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteSubscriptionBuyer);
            if (valid.status) {
                return adminModule.deleteSubscriptionBuyer(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add Subscription Buyer
    async addSubscriptionBuyer(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addSubscriptionBuyer);
            if (valid.status) {
                return adminModule.addSubscriptionBuyer(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // edit Subscription Buyer
    async editSubscriptionBuyer(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.editSubscriptionBuyer);
            if (valid.status) {
                return adminModule.editSubscriptionBuyer(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Users List By Role
    async getUsersListByRole(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getUsersListByRole);
            if (valid.status) {
                return adminModule.getUsersListByRole(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Store Service By User
    async getStoreServiceByUser(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getStoreServiceByUser);
            if (valid.status) {
                return adminModule.getStoreServiceByUser(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Contact Us List
    async getUserContactUsList(req, res) {
        return adminModule.getUserContactUsList(req, res);
    },
        
    // complete User Contactus
    async completeUserContactus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.completeUserContactus);
            if (valid.status) {
                return adminModule.completeUserContactus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Faqs By Role
    async getFaqsByRole(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.getFaqsByRole);
            if (valid.status) {
                return adminModule.getFaqsByRole(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

        
    // update faqs Status
    async updateFaqsStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateFaqsStatus);
            if (valid.status) {
                return adminModule.updateFaqsStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete faqs
    async deleteFaqs(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteFaqs);
            if (valid.status) {
                return adminModule.deleteFaqs(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add Faqs
    async addFaqs(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addFaqs);
            if (valid.status) {
                return adminModule.addFaqs(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update Faqs
    async updateFaqs(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateFaqs);
            if (valid.status) {
                return adminModule.updateFaqs(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get User Feedback List
    async getUserFeedbackList(req, res) {
        return adminModule.getUserFeedbackList(req, res);
    },
    
    // update User Feedback Status
    async updateUserFeedbackStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateUserFeedbackStatus);
            if (valid.status) {
                return adminModule.updateUserFeedbackStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete User Feedback
    async deleteUserFeedback(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteUserFeedback);
            if (valid.status) {
                return adminModule.deleteUserFeedback(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Feedback Reason
    async getFeedbackReason(req, res) {
        return adminModule.getFeedbackReason(req, res);
    },

    // update Feedback Reason Status
    async updateFeedbackReasonStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateFeedbackReasonStatus);
            if (valid.status) {
                return adminModule.updateFeedbackReasonStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete Feedback Reason
    async deleteFeedbackReason(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteFeedbackReason);
            if (valid.status) {
                return adminModule.deleteFeedbackReason(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // add Feedback Reason
    async addFeedbackReason(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addFeedbackReason);
            if (valid.status) {
                return adminModule.addFeedbackReason(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update Feedback Reason
    async updateFeedbackReason(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateFeedbackReason);
            if (valid.status) {
                return adminModule.updateFeedbackReason(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // get Sponsorship Details
    async getSponsorshipDetails(req, res) {
        return adminModule.getSponsorshipDetails(req, res);
    },

    // update Sponsorship Details
    async updateSponsorshipDetails(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;

            const valid = middleware.checkValidationRules(request, validationRules.updateSponsorshipDetails);
            if (valid.status) {
                return adminModule.updateSponsorshipDetails(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // Get app version list
    async getAppVersionList(req, res) {
        return adminModule.getAppVersionsList(req, res);
    },

    // add app version
    async addAppVersion(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.addAppVersion);
            if (valid.status) {
                return adminModule.addAppVersion(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // update app version status
    async updateAppVersionStatus(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.updateAppVersionStatus);
            if (valid.status) {
                return adminModule.udpateAppVersionStatus(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

    // delete app version
    async deleteAppVersion(req, res) {
        middleware.decryption(req.body, function (request) {
            request.admin_id = req.admin_id;
            const valid = middleware.checkValidationRules(request, validationRules.deleteAppVersion);
            if (valid.status) {
                return adminModule.deleteAppVersions(request, res);
            } else {
                return middleware.sendApiResponse(res, CODES.VALIDATION_ERROR, valid.error, null);
            }
        });
    },

};
export default adminController;
