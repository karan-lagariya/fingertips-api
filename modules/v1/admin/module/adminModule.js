import moment from 'moment';
import localizify from 'localizify';
import SequelizePakcage, { Sequelize, where } from 'sequelize';
import CODES from '../../../../app-config/status_code.js';
import GLOBALS from '../../../../app-config/constants.js';
import common from '../../../../app-config/common.js';
import Admin from '../../../../models/admins.js';
import adminDevice from '../../../../models/admindevice.js';
import Users from '../../../../models/users.js';
import userDevice from '../../../../models/userdevice.js';
import UsersDetails from '../../../../models/usersdetails.js';
import MarketPlace from '../../../../models/market_place.js';
import StoreCategory from '../../../../models/store_category.js';
import ProductCategory from '../../../../models/category.js';
import ProductSubCategory from '../../../../models/subcategory.js';
import Product from '../../../../models/product.js';
import ProductImages from '../../../../models/productimages.js';
import StaticPages from '../../../../models/static_page.js';
import NotificationModel from '../../../../app-config/notification.js';
import middleware from '../../../../middleware/headerValidator.js';
import SocialLinks from '../../../../models/socialLinks.js';
import ContactDetails from '../../../../models/contactdetails.js';
import SubscriptionPlans from '../../../../models/subscription_plan.js';
import AdManagers from '../../../../models/ad_managers.js';
import AddManagerImages from '../../../../models/ad_manager_images.js';
import AddSocialMedias from '../../../../models/ad_social_medias.js';
import subscriptionBuyer from '../../../../models/buy_plans.js';
import UserContactUs from '../../../../models/user_contactus.js';
import FaqModel from '../../../../models/faq.js';
import Feedback from '../../../../models/feedbacks.js';
import FeedbackReason from '../../../../models/feedback_reasons.js';
import Sponsorship from '../../../../models/sponsorship_details.js';
import appVersion from '../../../../models/app_versions.js'
import adManagerTemplate from '../../../../email-templates/adRunning.js';
import Notify from '../../../../models/notification.js'
import SaveProduct from '../../../../models/save_products.js'
import ProductLike from '../../../../models/product_like.js'
import Category from '../../../../models/store_category.js';
import Products from '../../../../models/product.js';
import BuyPlans from '../../../../models/buy_plans.js';
import review from '../../../../models/review.js';
import User from '../../../../models/userdevice.js';

const Op = SequelizePakcage.Op;
const fn = SequelizePakcage.fn;
const col = SequelizePakcage.col;

const { default: local } = localizify;
const { t } = localizify;

const adminModel = {
    /**
     * Function to login
     * @param {request} request
     * @param {Function} res
     */
    async login(request, res) {
        const email = request.email;
        const getAdminDataByEmailId = await common.getAdminDataByEmailId(email);
        if (getAdminDataByEmailId != null) {
            const adminData = await Admin.findOne({
                attributes: ['id', 'email'],
                where: { email: email, password: middleware.encData(request.password) },
            });

            // console.log("--------------------", { email: email, password: middleware.encData(request.password) })
            if (adminData != null) {
                const token = await common.generateRandomToken(64);
                const adminId = getAdminDataByEmailId.id;

                adminDevice.findOne({ admin_id: adminId }).then(function (deviceInformation) {
                    const deviceValues = {
                        token: token,
                        admin_id: adminId,
                    };

                    if (deviceInformation) {
                        deviceInformation.update(deviceValues);
                    } else {
                        adminDevice.create(deviceValues);
                    }
                });
                const updateAdminData = {
                    last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                    login_status: 'Online',
                };

                await Admin.update(updateAdminData, { where: { id: adminId } }, { multi: true });

                getAdminDataByEmailId.setDataValue('token', token);

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_user_login_success'),
                    getAdminDataByEmailId
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_invalid_logindetails'), null);
            }
        } else {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_entered_incorrect_email_admin'), null);
        }
    },

    /**
     * Function to logout admin
     * @param {request} req
     * @param {Function} res
     */
    async logout(req, res) {
        try {
            // console.log("-------------------------", req.admin_id)
            const adminId = req.admin_id;
            Admin.update(
                {
                    login_status: 'Offline',
                    last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                },
                { where: { id: adminId } }
            );

            adminDevice.update({ token: null }, { where: { admin_id: adminId } });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_userlogout_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.UNAUTHORIZED, error.message, null);
        }
    },

    /**
     * Function to change password via token for admin
     * @param {request} request
     * @param {Function} res
     */
    async changePassword(request, res) {
        const adminId = request.admin_id;

        const adminData = await common.getAdminPasswordById(adminId);

        if (adminData != undefined && adminData != null) {
            try {
                const checkPassword = adminData.password;

                const encOldPassword = middleware.encData(request.old_password);
                const encNewPassword = middleware.encData(request.new_password);
                if (encOldPassword == checkPassword) {
                    if (encOldPassword !== encNewPassword) {
                        await Admin.update({ password: encNewPassword }, { where: { id: adminId } });
                        return middleware.sendApiResponse(
                            res,
                            CODES.SUCCESS,
                            t('rest_keywords_user_change_password_success'),
                            null
                        );
                    } else {
                        return middleware.sendApiResponse(
                            res,
                            CODES.ERROR,
                            t('rest_keywords_user_newold_password_similar'),
                            null
                        );
                    }
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_incorrect_current_password'), null);
                }
            } catch (error) {
                return middleware.sendApiResponse(res, CODES.UNAUTHORIZED, error.message, null);
            }
        } else {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_admin_not_found'), null);
        }
    },

    /**
     * Function to get admin profile data
     * @param {request} req
     * @param {Function} res
     */
    async getProfile(req, res) {
        const adminProfile = await common.getAdminDataById(req.admin_id);
        if (adminProfile != undefined && adminProfile != null) {
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), adminProfile);
        } else {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_admin_not_found'), null);
        }
    },

    /**
     * Function to update profile data for admin
     * @param {request} req
     * @param {Function} res
     */
    async updateProfile(req, res) {
        const adminId = req.admin_id;
        const adminProfile = await common.getAdminDataById(adminId);

        if (adminProfile != undefined && adminProfile != null) {
            const profileImage =
                req.profile_image != undefined && req.profile_image != ''
                    ? req.profile_image
                    : adminProfile.profile_image;
            try {
                const updateProfile = {
                    first_name: req.first_name,
                    last_name: req.last_name,
                    profile_image: profileImage,
                };
                await Admin.update(updateProfile, {
                    where: {
                        id: adminId,
                    },
                });
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_profile_update_success'), null);
            } catch (error) {
                return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
            }
        } else {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_admin_not_found'), null);
        }
    },

    /**
     * Function to get users list api for
     * @param {request} request
     * @param {Function} res
     */
    async usersList(request, res) {
        try {
            const whereConditions = { is_deleted: 0, role: 0 };

            const list = await Users.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    'status',
                    'role',
                    'is_verified',
                    'is_available',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            // console.log("-->",list)
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_users_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update user status
     * @param {request} req
     * @param {Function} res
     */
    updateUserStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        Users.update(param, { where: { id: request.user_id } })
            .then(async () => {
                if (request.status == '0') {
                    Users.update(
                        {
                            login_status: 'Offline',
                            last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        },
                        { where: { id: request.user_id } }
                    );
                    const userdata = await Users.findOne({
                        attributes: [
                            'id', 'language'
                        ], where: { is_deleted: 0, id: request.user_id }
                    });

                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_inactive_user_title',
                            components: {},
                        },
                        tag: 'admin_notification',
                        message: {
                            keyword: 'rest_inactive_user_msg',
                            components: {},
                        },
                        add_notification: 1,
                    });
                    await review.update(
                        { is_deleted: 1, status: 0 },
                        {
                            where: {
                                user_id: request.user_id
                            }
                        }
                    );
                    userDevice.update({ token: null, device_token: null }, { where: { user_id: request.user_id } });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_user_status_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_user_status_success'), null);
                }
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to delete user
     * @param {request} request
     * @param {Function} res
     */
    async deleteUser(request, res) {
        try {

            await NotificationModel.prepareNotification({
                receiver_id: request.user_id,
                sender_id: 0,
                action_id: 0,
                tag: 'admin_notification',
                title: 'Account Deletetion',
                message: 'Your account has been removed by the admin. Your account has been logged out.',
                add_notification: 1,
            });

            Users.findOne({ where: { id: request.user_id } }).then(function (user) {
                if (user) {
                    Users.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.user_id } }
                    )
                        .then(async function () {
                            await review.update(
                                { is_deleted: 1, status: 0 },
                                {
                                    where: {
                                        user_id: request.user_id
                                    }
                                }
                            );
                            await User.update(
                                { token: null, device_token: null },
                                {
                                    where: {
                                        user_id: request.user_id
                                    }
                                }
                            );
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_keywords_delete_user_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get users list api for
     * @param {request} request
     * @param {Function} res
     */
    async vendorList(request, res) {
        try {
            const whereConditions = { is_deleted: 0, role: 1 };
            const list = await Users.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    'status',
                    'role',
                    'is_verified',
                    'is_available',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_users_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete user
     * @param {request} request
     * @param {Function} res
     */
    async deleteVendor(request, res) {
        try {

            await NotificationModel.prepareNotification({
                receiver_id: request.user_id,
                sender_id: 0,
                action_id: 0,
                tag: 'admin_notification',
                title: 'Account Deletetion',
                message: 'The store you were associated with has been removed by the admin. Your account has been logged out.',
                add_notification: 1,
            });

            Users.findOne({ where: { id: request.user_id } }).then(function (user) {
                if (user) {
                    Users.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.user_id } }
                    )
                        .then(async function () {
                            UsersDetails.update({ is_deleted: 1 }, { where: { user_id: request.user_id } });

                            Product.update({ id_deleted: 1 }, { where: { user_id: request.user_id } })

                            const prods = await Product.findAll({
                                where: {
                                    user_id: request.user_id
                                }
                            })
                            if (prods.length > 0) {
                                const toBeDeletedIds = prods.map(el => el.id);

                                SaveProduct.destroy({
                                    where: {
                                        [Op.and]: {
                                            product_id: toBeDeletedIds
                                        }
                                    }
                                })
                            }
                            await User.update(
                                { token: null, device_token: null },
                                {
                                    where: {
                                        user_id: request.user_id
                                    }
                                }
                            );

                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_keywords_delete_vendor_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_vendor_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update user status
     * @param {request} req
     * @param {Function} res
     */
    updateVendorStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        Users.update(param, { where: { id: request.user_id } })
            .then(function () {
                if (request.status == '0') {
                    Users.update(
                        {
                            login_status: 'Offline',
                            last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        },
                        { where: { id: request.user_id } }
                    )

                    UsersDetails.update({ status: request.status }, { where: { user_id: request.user_id } });

                    Product.update({ status: request.status }, { where: { user_id: request.user_id } })

                    const prods = Product.findAll({
                        where: {
                            user_id: request.user_id
                        }
                    })
                    if (prods.length > 0) {
                        const toBeDeletedIds = prods.map(el => el.id);

                        SaveProduct.destroy({
                            where: {
                                [Op.and]: {
                                    product_id: toBeDeletedIds
                                }
                            }
                        })
                    }

                    userDevice.update({ token: null, device_token: null }, { where: { user_id: request.user_id } });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_vendor_status_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_vendor_status_success'), null);
                }
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get users list api for
     * @param {request} request
     * @param {Function} res
     */
    async serviceProviderList(request, res) {
        try {
            const whereConditions = { is_deleted: 0, role: 2 };
            const list = await Users.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    'status',
                    'role',
                    'is_verified',
                    'is_available',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_users_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete user
     * @param {request} request
     * @param {Function} res
     */
    async deleteServiceProvider(request, res) {
        try {

            await NotificationModel.prepareNotification({
                receiver_id: request.user_id,
                sender_id: 0,
                action_id: 0,
                tag: 'admin_notification',
                title: 'Account Deletetion',
                message: 'The Services you were associated with has been removed by the admin. Your account has been logged out.',
                add_notification: 1,
            });

            Users.findOne({ where: { id: request.user_id } }).then(function (user) {
                if (user) {
                    Users.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.user_id } }
                    )
                        .then(async function () {
                            await User.update(
                                { token: null, device_token: null },
                                {
                                    where: {
                                        user_id: request.user_id
                                    }
                                }
                            );
                            UsersDetails.update({ is_deleted: 1 }, { where: { user_id: request.user_id } });
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_keywords_delete_service_provider_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_service_provider_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update user status
     * @param {request} req
     * @param {Function} res
     */
    updateServiceProviderStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        Users.update(param, { where: { id: request.user_id } })
            .then(function () {
                if (request.status == '0') {
                    Users.update(
                        {
                            login_status: 'Offline',
                            last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        },
                        { where: { id: request.user_id } }
                    );

                    userDevice.update({ token: null, device_token: null }, { where: { user_id: request.user_id } });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_service_provider_status_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_service_provider_status_success'), null);
                }
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get page content
     * @param {request} req
     * @param {Function} res
     */
    async getStaticPageContent(req, res) {
        try {
            const pageContent = await StaticPages.findAll({
                attributes: ['id', 'title', 'tag', 'data', 'guj_data'],
                where: {
                    role: req.role,
                    tag: req.tag,
                    status: 1,
                    is_deleted: 0,
                },
            });

            if (pageContent != undefined && pageContent != null && pageContent.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), pageContent[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update page content
     * @param {request} req
     * @param {Function} res
     */
    async UpdatePageContent(req, res) {
        try {
            await StaticPages
                .update({ data: req.data, guj_data: req.guj_data }, { where: { role: req.role, tag: req.tag } })

            const userdata = await Users.findAll({
                attributes: [
                    'id', 'language'
                ], where: { role: req.role, is_deleted: 0, is_notification: 1 }
            });
            const userIds = userdata.map(user => user.id).join(',');

            // NotificationModel.prepareNotificationBulk({
            //     multiple_user_id:userIds,
            //     sender_id: 0,
            //     action_id: 0,
            //     tag: 'admin_notification',
            //     title: 'Attention Required',
            //     message: `Important: ${req.tag} Updates`,
            //     add_notification: 1,
            // });

            setTimeout(() => {
                // eslint-disable-next-line array-callback-return
                userdata.map((x) => {
                    if (req.tag == "PRIVACY_POLICY") {
                        NotificationModel.prepareNotification({
                            sender_id: 0,
                            receiver_id: x.id,
                            action_id: 0,
                            lang: x.language == 'English' ? 'en' : 'guj',
                            title: {
                                keyword: 'rest_privacy_policy_title',
                                components: {},
                            },
                            tag: 'admin_notification',
                            message: {
                                keyword: 'rest_privacy_policy_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                    } else if (req.tag == "TERMS_CONDITIONS") {
                        NotificationModel.prepareNotification({
                            sender_id: 0,
                            receiver_id: x.id,
                            action_id: 0,
                            lang: x.language == 'English' ? 'en' : 'guj',
                            title: {
                                keyword: 'rest_terms_condition_title',
                                components: {},
                            },
                            tag: 'admin_notification',
                            message: {
                                keyword: 'rest_terms_condition_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                    } else {
                        NotificationModel.prepareNotification({
                            sender_id: 0,
                            receiver_id: x.id,
                            action_id: 0,
                            lang: x.language == 'English' ? 'en' : 'guj',
                            title: {
                                keyword: 'rest_about_us_title',
                                components: {},
                            },
                            tag: 'admin_notification',
                            message: {
                                keyword: 'rest_about_us_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                    }
                })
            }, 1000);
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_page_content_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user vendor & service provider details
     * @param {request} req
     * @param {Function} res
     */
    async getDetails(req, res) {
        try {
            const userDetails = await Users.findAll({
                attributes: [
                    'id',
                    'language',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.IMAGE_BASE_URL, GLOBALS.USER_PHOTO, SequelizePakcage.col('profile_image'),
                        ),
                        'profile_image',
                    ],
                    'is_verified',
                    'is_available',
                    'is_notification',
                    'dob',
                    'role',
                    'status',
                    'createdAt'
                ],
                where: {
                    id: req.user_id,
                    is_deleted: 0,
                },
            });

            if (userDetails != undefined && userDetails != null && userDetails.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userDetails[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to add category
     * @param {request} request
     * @param {Function} res
     */
    async addCategory(request, res) {
        try {
            const category = await ProductCategory.findOne({
                attributes: ['id'],
                where: {
                    store_category_id: request.store_category_id,
                    [Op.or]: [{ en_name: request.en_name.toLowerCase() }, { guj_name: request.guj_name.toLowerCase() }],
                },
            });
            if (category) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_category_already_exists'), null);
            } else {

                const categoryRole = await StoreCategory.findOne({
                    attributes: ['id', 'role'],
                    where: {
                        id: request.store_category_id,
                    },
                });

                let categoryParams = {
                    store_category_id: request.store_category_id,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    role: categoryRole.role
                };
                const addCategory = await ProductCategory.create(categoryParams);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_added_success'), addCategory);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get store category list api
     * @param {request} request
     * @param {Function} res
     */
    async getStoreCategory(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await StoreCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'status'
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get store & service category
     * @param {request} request
     * @param {Function} res
    */
    async getStoreServiceCategory(request, res) {
        try {
            const storeCategory = await StoreCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'status'
                ],
                where: { role: 1, status: 1, is_deleted: 0 },
            });
            const serviceCategory = await StoreCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'status'
                ],
                where: { role: 2, status: 1, is_deleted: 0 },
            });

            const category = {
                store_category: storeCategory,
                service_category: serviceCategory
            }

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_found_success'), category);

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Category List By Store Category
     * @param {request} request
     * @param {Function} res
     */
    async getCategoryListByStoreCategory(request, res) {
        try {
            const whereConditions = { store_category_id: request.store_category_id, is_deleted: 0 };
            const list = await ProductCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'status',
                    'createdAt',
                    [col('storecategorydata.en_name'), 'en_store_category_name'],
                    [col('storecategorydata.guj_name'), 'guj_store_category_name'],
                ],
                where: whereConditions,
                include: [
                    {
                        model: StoreCategory,
                        as: 'storecategorydata',
                    }
                ]
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get category list api for
     * @param {request} request
     * @param {Function} res
     */
    async categoryList(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await ProductCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'status',
                    'createdAt',
                    [col('storecategorydata.en_name'), 'en_store_category_name'],
                    [col('storecategorydata.guj_name'), 'guj_store_category_name'],
                ],
                where: whereConditions,
                include: [
                    {
                        model: StoreCategory,
                        as: 'storecategorydata',
                    }
                ]
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete category
     * @param {request} request
     * @param {Function} res
     */
    async deleteCategory(request, res) {
        try {
            ProductCategory.findOne({ where: { id: request.category_id } }).then(function (category) {
                if (category) {
                    ProductCategory.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.category_id } }
                    )
                        .then(function () {
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_category_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update category status
     * @param {request} req
     * @param {Function} res
     */
    updateCategoryStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        ProductCategory.update(param, { where: { id: request.category_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to  get category details
     * @param {request} request
     * @param {Function} res
     */
    async getCategorydetails(request, res) {
        try {
            const category = await ProductCategory.findOne({
                where: {
                    id: request.category_id,
                },
            });
            if (category != undefined && category != null) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_details'), category);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_category_details_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update category details
     * @param {request} request
     * @param {Function} res
     */
    async updateCategoryDetails(request, res) {
        try {
            const category = await ProductCategory.findOne({
                where: {
                    store_category_id: request.store_category_id,
                    [Op.or]: [{ en_name: request.en_name.toLowerCase() }, { guj_name: request.guj_name.toLowerCase() }],
                    id: {
                        [Op.ne]: request.category_id,
                    },
                },
            });

            if (category) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_category_already_exists'), null);
            } else {
                const categoryRole = await StoreCategory.findOne({
                    attributes: ['id', 'role'],
                    where: {
                        id: request.store_category_id,
                    },
                });

                let categoryParams = {
                    store_category_id: request.store_category_id,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    role: categoryRole.role
                };

                ProductCategory.update(categoryParams, { where: { id: request.category_id } })
                    .then(function () {
                        return middleware.sendApiResponse(
                            res,
                            CODES.SUCCESS,
                            t('rest_category_details_update_success'),
                            null
                        );
                    })
                    .catch(function (err) {
                        return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                    });
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add sub category
     * @param {request} request
     * @param {Function} res
     */
    async addSubCategory(request, res) {
        try {
            const subcategory = await ProductSubCategory.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { en_name: request.en_name.toLowerCase() },
                                { guj_name: request.guj_name.toLowerCase() },
                            ],
                        },
                        { store_category_id: request.store_category_id, category_id: request.category_id },
                    ],
                },
            });

            if (subcategory) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subcategory_already_exists'), null);
            } else {
                let categoryParams = {
                    store_category_id: request.store_category_id,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    category_id: request.category_id
                };
                const addSubCategory = await ProductSubCategory.create(categoryParams);
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_subcategory_added_success'),
                    addSubCategory
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get sub category list api for
     * @param {request} request
     * @param {Function} res
     */
    async subCategoryList(request, res) {
        try {
            const whereConditions = { category_id: request.category_id, is_deleted: 0 };
            const list = await ProductSubCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'store_category_id',
                    'category_id',
                    'en_name',
                    'guj_name',
                    'status',
                    'createdAt',
                    'is_deleted'
                ],
                where: whereConditions
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_subcategory_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete sub category
     * @param {request} request
     * @param {Function} res
     */
    async deleteSubCategory(request, res) {
        try {
            ProductSubCategory.findOne({ where: { id: request.subcategory_id } }).then(function (category) {
                if (category) {
                    ProductSubCategory.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.subcategory_id } }
                    )
                        .then(function () {
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_subcategory_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update sub category status
     * @param {request} req
     * @param {Function} res
     */
    updateSubCategoryStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        ProductSubCategory.update(param, { where: { id: request.subcategory_id } })
            .then(function () {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_subcategory_status_update_success'),
                    null
                );
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to  get subcategory details
     * @param {request} request
     * @param {Function} res
     */
    async getSubCategorydetails(request, res) {
        try {
            const subcategory = await ProductSubCategory.findOne({
                attributes: [
                    'id',
                    'store_category_id',
                    'category_id',
                    'en_name',
                    'guj_name',
                    'status',
                    'createdAt',
                    'is_deleted',
                    [SequelizePakcage.col('categorydata.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('categorydata.en_name'), 'en_category_name'],
                ],
                where: {
                    id: request.subcategory_id,
                },
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    }
                ]
            });
            if (subcategory != undefined && subcategory != null) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_subcategory_details'), subcategory);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subcategory_details_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update subcategory details
     * @param {request} request
     * @param {Function} res
     */
    async updateSubCategoryDetails(request, res) {
        try {
            const subcategory = await ProductSubCategory.findOne({
                where: {
                    [Op.or]: [{ en_name: request.en_name.toLowerCase() }, { guj_name: request.guj_name.toLowerCase() }],
                    id: {
                        [Op.ne]: request.subcategory_id,
                    },
                    store_category_id: request.store_category_id,
                    category_id: request.category_id,
                },
            });

            if (subcategory) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subcategory_already_exists'), null);
            } else {

                let categoryParams = {
                    store_category_id: request.store_category_id,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    category_id: request.category_id,
                };

                ProductSubCategory.update(categoryParams, { where: { id: request.subcategory_id } })
                    .then(function () {
                        return middleware.sendApiResponse(
                            res,
                            CODES.SUCCESS,
                            t('rest_subcategory_details_update_success'),
                            null
                        );
                    })
                    .catch(function (err) {
                        return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                    });
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to product
     * @param {request} request
     * @param {Function} res
     */
    async addProduct(request, res) {
        try {
            const product = await Product.findOne({
                where: {
                    name: request.name.toLowerCase(),
                    category_id: request.category_id,
                    subcategory_id: request.subcategory_id,
                    store_id: request.store_id,
                    user_id: request.user_id,
                },
            });

            if (product) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_product_already_exists'), null);
            } else {
                let productParams = {
                    name: request.name,
                    category_id: request.category_id,
                    subcategory_id: request.subcategory_id,
                    store_id: request.store_id,
                    user_id: request.user_id,
                    price: request.price,
                    discount: request.discount,
                    discount_type: request.discount_type,
                    ...(request.brand != undefined && { brand: request.brand }),
                    ...(request.gender != undefined && { gender: request.gender }),
                    ...(request.color != undefined && { color: request.color }),
                    ...(request.size != undefined && { size: request.size }),
                    ...(request.shape != undefined && { shape: request.shape }),
                    ...(request.material != undefined && { material: request.material }),
                    ...(request.pattern != undefined && { pattern: request.pattern }),
                    ...(request.design != undefined && { design: request.design }),
                    ...(request.type != undefined && { type: request.type }),
                    ...(request.sustainable != undefined && { sustainable: request.sustainable }),
                    ...(request.warranty != undefined && { warranty: request.warranty }),
                    ...(request.guarantee != undefined && { guarantee: request.guarantee }),
                    ...(request.quantity != undefined && { quantity: request.quantity }),
                    ...(request.quality != undefined && { quality: request.quality }),
                    ...(request.service != undefined && { service: request.service }),
                    ...(request.replacement != undefined && { replacement: request.replacement }),
                    ...(request.resale != undefined && { resale: request.resale }),
                    ...(request.details != undefined && { details: request.details }),
                };
                const addProduct = await Product.create(productParams);

                asyncLoop(
                    request.images,
                    async function (item, next) {
                        const productImages = {
                            product_id: addProduct.id,
                            images: item.name,
                        };
                        await productImages.build(productImages).save();
                        next();
                    },
                    async () => {
                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_product_added_success'), null);
                    }
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get sub category list api for
     * @param {request} request
     * @param {Function} res
     */
    async productList(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await Product.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'name',
                    'product_code',
                    'category_id',
                    'subcategory_id',
                    'store_id',
                    'user_id',
                    'price',
                    'discount',
                    'discount_type',
                    'brand',
                    'gender',
                    'color',
                    'size',
                    'shape',
                    'material',
                    'pattern',
                    'design',
                    'type',
                    'sustainable',
                    'warranty',
                    'guarantee',
                    'quantity',
                    'quality',
                    'service',
                    'replacement',
                    'resale',
                    'details',
                    'status',
                    'createdAt',
                    'is_deleted',
                    [SequelizePakcage.col('category_data.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('category_data.en_name'), 'en_category_name'],
                    [SequelizePakcage.col('sub_category_data.guj_name'), 'guj_subcategory_name'],
                    [SequelizePakcage.col('sub_category_data.en_name'), 'en_subcategory_name'],
                    [SequelizePakcage.col('user_data.guj_full_name'), 'guj_full_name'],
                    [SequelizePakcage.col('user_data.en_full_name'), 'en_full_name'],
                ],
                include: [
                    {
                        model: Users,
                        as: 'user_data',
                        attributes: [],
                        where: { is_deleted: 0 },
                        required: true,
                    },
                    {
                        model: Category,
                        as: 'category_data',
                        attributes: [],
                        where: { is_deleted: 0 },
                        required: true,
                    },
                    {
                        model: Subcategory,
                        as: 'sub_category_data',
                        attributes: [],
                        where: { is_deleted: 0 },
                        required: true,
                    },
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_product_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Store Product List
     * @param {request} request
     * @param {Function} res
    */
    async getStoreProductList(request, res) {
        try {
            const whereConditions = { store_id: request.store_id, is_deleted: 0 };
            const list = await Product.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'name',
                    'product_code',
                    'category_id',
                    'subcategory_id',
                    'price',
                    'status',
                    'createdAt',
                    'is_deleted',
                    [SequelizePakcage.col('categorydata.en_name'), 'en_category_name'],
                    [SequelizePakcage.col('categorydata.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_subcategory_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_subcategory_name'],
                ],
                where: whereConditions,
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    },
                    {
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    }
                ]
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_product_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete product
     * @param {request} request
     * @param {Function} res
     */
    async deleteProduct(request, res) {
        try {
            Product.findOne({ where: { id: request.product_id } }).then(function (product) {
                if (product) {
                    Product.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.product_id } }
                    )
                        .then(function () {
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_product_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update product status
     * @param {request} req
     * @param {Function} res
     */
    updateProductStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        Product.update(param, { where: { id: request.product_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_product_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to  get product details
     * @param {request} request
     * @param {Function} res
     */
    async getProductDetails(request, res) {
        try {
            const product = await Product.findAll({
                attributes: [
                    'id',
                    'name',
                    'product_code',
                    'category_id',
                    'subcategory_id',
                    'store_id',
                    'price',
                    'discount',
                    'discount_type',
                    'brand',
                    'gender',
                    'color',
                    'size',
                    'shape',
                    'material',
                    'pattern',
                    'design',
                    'type',
                    'sustainable',
                    'warranty',
                    'guarantee',
                    'quantity',
                    'quality',
                    'service',
                    'replacement',
                    'resale',
                    'details',
                    'avg_rating',
                    'total_like',
                    'status',
                    'createdAt',
                    'is_deleted',
                    [SequelizePakcage.col('categorydata.en_name'), 'en_category_name'],
                    [SequelizePakcage.col('categorydata.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_subcategory_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_subcategory_name'],
                    [SequelizePakcage.col('storedata.en_name'), 'store_name']
                ],
                where: {
                    id: request.product_id,
                    is_deleted: 0
                },
                include: [
                    {
                        model: UsersDetails,
                        as: 'storedata',
                    },
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    },
                    {
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    }
                ]
            });
            if (product != undefined && product != null && product.length > 0) {
                const imagesData = await ProductImages.findAll({
                    attributes: [
                        'id',
                        [SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL, process.env.USER_PRODUCTS, SequelizePakcage.col('image')), 'image'],
                    ],
                    where: { product_id: request.product_id, is_deleted: 0 },
                });
                product[0].setDataValue('product_images', imagesData);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_product_details'), product[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_product_details_not_found'), null);
            }
        } catch (error) {
            console.log('object', error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update product details
     * @param {request} request
     * @param {Function} res
     */
    async updateproductDetails(request, res) {
        try {
            const product = await Product.findOne({
                where: {
                    [Op.or]: [{ name: request.name.toLowerCase() }],
                    id: {
                        [Op.ne]: request.product_id,
                    },
                    category_id: request.category_id,
                    subcategory_id: request.subcategory_id,
                    store_id: request.store_id,
                    user_id: request.user_id,
                },
            });

            if (product) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_product_already_exists'), null);
            } else {
                let productParams = {
                    name: request.name,
                    category_id: request.category_id,
                    subcategory_id: request.subcategory_id,
                    store_id: request.store_id,
                    user_id: request.user_id,
                    price: request.price,
                    discount: request.discount,
                    discount_type: request.discount_type,
                    ...(request.brand != undefined && { brand: request.brand }),
                    ...(request.gender != undefined && { gender: request.gender }),
                    ...(request.color != undefined && { color: request.color }),
                    ...(request.size != undefined && { size: request.size }),
                    ...(request.shape != undefined && { shape: request.shape }),
                    ...(request.material != undefined && { material: request.material }),
                    ...(request.pattern != undefined && { pattern: request.pattern }),
                    ...(request.design != undefined && { design: request.design }),
                    ...(request.type != undefined && { type: request.type }),
                    ...(request.sustainable != undefined && { sustainable: request.sustainable }),
                    ...(request.warranty != undefined && { warranty: request.warranty }),
                    ...(request.guarantee != undefined && { guarantee: request.guarantee }),
                    ...(request.quantity != undefined && { quantity: request.quantity }),
                    ...(request.quality != undefined && { quality: request.quality }),
                    ...(request.service != undefined && { service: request.service }),
                    ...(request.replacement != undefined && { replacement: request.replacement }),
                    ...(request.resale != undefined && { resale: request.resale }),
                    ...(request.details != undefined && { details: request.details }),
                };

                Product.update(productParams, { where: { id: request.product_id } });
                ProductImages.update(
                    {
                        is_deleted: 1,
                    },
                    { where: { product_id: request.product_id } }
                )
                    .then(function () {
                        asyncLoop(
                            request.images,
                            async function (item, next) {
                                const productImages = {
                                    product_id: request.product_id,
                                    images: item.name,
                                };
                                await productImages.build(productImages).save();
                                next();
                            },
                            async () => {
                                return middleware.sendApiResponse(
                                    res,
                                    CODES.SUCCESS,
                                    t('rest_product_details_update_success'),
                                    null
                                );
                            }
                        );
                    })
                    .catch(function (err) {
                        return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                    });
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to Get Dashborad Count
     * @param {request} request
     * @param {Function} res
     */
    async getDashboradCount(request, res) {
        try {
            const totalUser = await Users.count({ where: { status: 1, is_deleted: 0, role: 0, } });

            const totalUserinactive = await Users.count({ where: { status: 0, is_deleted: 0, role: 0, } });

            const totalVendor = await Users.count({ where: { status: 1, is_deleted: 0, role: 1, } });

            const totalVendorinactive = await Users.count({ where: { status: 0, is_deleted: 0, role: 1, } });

            const totalServiceProvider = await Users.count({ where: { status: 1, is_deleted: 0, role: 2, } });

            const totalServiceProviderinactive = await Users.count({ where: { status: 0, is_deleted: 0, role: 2, } });

            const totalStoreCategory = await StoreCategory.count({ where: { status: 1, is_deleted: 0, } });

            const totalStoreCategoryinacticv = await StoreCategory.count({ where: { status: 0, is_deleted: 0 } });

            const totalCategory = await ProductCategory.count({ where: { status: 1, is_deleted: 0, }, });

            const totalCategoryinactive = await ProductCategory.count({ where: { status: 0, is_deleted: 0, }, });

            const totalSubcategory = await ProductSubCategory.count({ where: { status: 1, is_deleted: 0, }, });

            const totalSubcategoryinactive = await ProductSubCategory.count({ where: { status: 0, is_deleted: 0, }, });

            const totalProduct = await Product.count({ where: { status: 1, is_deleted: 0, }, });

            const totalProductinactive = await Product.count({ where: { status: 0, is_deleted: 0, }, });

            const totalads = await AdManagers.count({ where: { status: 1, is_deleted: 0, }, });
            const totaladsinactive = await AdManagers.count({ where: { status: 0, is_deleted: 0, }, });

            const totalmarketplace = await MarketPlace.count({ where: { status: 1, is_deleted: 0, }, });
            const totalmarketplaceinactive = await MarketPlace.count({ where: { status: 0, is_deleted: 0, }, });

            const totalsubscribuy = await subscriptionBuyer.count({ where: { status: 1, is_deleted: 0, }, });
            const totalsubscribuyinactive = await subscriptionBuyer.count({ where: { status: 0, is_deleted: 0, }, });

            // let totalCount = {
            //     total_subcategory: totalSubcategory,
            //     total_category: totalCategory,
            //     total_product: totalProduct,
            //     total_user: totalUser,
            //     total_vendor: totalVendor,
            //     total_service_provider: totalServiceProvider,
            //     total_store_category: totalStoreCategory
            // };

            const result = {
                name: ['User', 'Vendor', 'Service Provider', 'Store Category', 'Category', 'Sub Category', 'Product', 'Ads', 'Market Place', 'Subscription'],
                active: [totalUser, totalVendor, totalServiceProvider, totalStoreCategory, totalCategory, totalSubcategory, totalProduct, totalads, totalmarketplace, totalsubscribuy],
                inactive: [totalUserinactive, totalVendorinactive, totalServiceProviderinactive, totalStoreCategoryinacticv, totalCategoryinactive, totalSubcategoryinactive, totalProductinactive, totaladsinactive, totalmarketplaceinactive, totalsubscribuyinactive]
            }
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_dashborad_count_success'), result);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get category list api for
     * @param {request} request
     * @param {Function} res
     */
    async categoryListRolewise(request, res) {
        try {
            const whereConditions = { is_deleted: 0, role: request.role };
            const list = await Category.findAll({
                order: [['id', 'DESC']],
                attributes: ['id', 'en_name', 'role', 'image', 'guj_name', 'status', 'createdAt', 'is_deleted'],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_category_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get store list
     * @param {request} request
     * @param {Function} res
     */
    async storeList(request, res) {
        try {
            const whereConditions = { type: 'store', is_deleted: 0 };

            const list = await UsersDetails.findAll({
                order: [['is_approved', 'ASC'], ['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'category_id',
                    'type',
                    'en_name',
                    'guj_name',
                    'gstno',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'status',
                    'is_approved',
                    'is_deleted',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('userdata.en_full_name'), 'vendor_name']
                ],
                where: whereConditions,
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    },
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    }
                ]
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Store Details
     * @param {request} request
     * @param {Function} res
     */
    async getStoreDetails(request, res) {
        try {
            const whereConditions = { id: request.store_id, type: 'store', is_deleted: 0 };

            const storeDetails = await UsersDetails.findAll({
                order: [['id', 'DESC'], ['is_approved', 'ASC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'category_id',
                    'type',
                    'en_name',
                    'guj_name',
                    'gstno',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.IMAGE_BASE_URL, GLOBALS.USER_PHOTO, SequelizePakcage.col('tbl_user_details.image'),
                        ),
                        'store_image',
                    ],
                    'whatsapp_number',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'landmark',
                    'status',
                    'is_approved',
                    'is_deleted',
                    'used_space',
                    'storage_limit',
                    'createdAt',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('userdata.en_full_name'), 'vendor_name']
                ],
                where: whereConditions,
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    },
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },

                ]
            });
            if (storeDetails != undefined && storeDetails != null && storeDetails.length > 0) {
                const planBuyDetails = await BuyPlans.findAll({
                    attributes: [
                        'id',
                        'plan_id',
                        'is_premium',
                        'start_date',
                        'end_date',
                        'plan_details',
                    ],

                    include: [
                        {
                            model: SubscriptionPlans,
                            as: 'plandata',
                            attributes: [
                                'id',
                                'title',
                                'guj_title',
                            ],
                        },
                    ],
                    where: {
                        store_service_id: storeDetails[0].id,
                        status: 1,
                        is_deleted: 0,
                    },
                });
                storeDetails[0].setDataValue('plandata', planBuyDetails[0])
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_details_success'), storeDetails[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },


    /**
     * Function to delete store
     * @param {request} request
     * @param {Function} res
     */
    async deleteStore(request, res) {
        try {
            UsersDetails.findOne({ where: { id: request.store_id } }).then(function (store) {
                if (store) {
                    UsersDetails.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.store_id } }
                    )
                        .then(async () => {

                            SaveProduct.destroy({ where: { store_id: request.store_id } })
                            await Product.update(
                                { is_deleted: 1, status: 0 },
                                {
                                    where: {
                                        store_id: request.store_id
                                    }
                                }
                            );

                            subscriptionBuyer.destroy({ where: { store_service_id: request.store_id } })

                            const storeServDetails = await UsersDetails.findOne({
                                attributes: [
                                    'en_name', 'user_id'
                                ],
                                where: { id: request.store_id }
                            });

                            const userdata = await Users.findOne({
                                attributes: [
                                    'id', 'language'
                                ], where: { is_deleted: 0, id: storeServDetails.user_id }
                            });

                            NotificationModel.prepareNotification({
                                sender_id: 0,
                                receiver_id: userdata.id,
                                action_id: 0,
                                lang: userdata.language == 'English' ? 'en' : 'guj',
                                title: {
                                    keyword: 'rest_store_serv_delete_title',
                                    components: { field: storeServDetails.en_name },
                                },
                                tag: 'admin_notification',
                                field: JSON.stringify({ field: storeServDetails.en_name }),
                                field_title: JSON.stringify({ field: storeServDetails.en_name }),
                                message: {
                                    keyword: 'rest_store_serv_delete_msg',
                                    components: { field: storeServDetails.en_name },
                                },
                                add_notification: 1,
                            });

                            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_delete_success'), null);
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_store_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update store status
     * @param {request} req
     * @param {Function} res
     */
    updateStoreStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        SaveProduct.destroy({
            where: {
                store_id: request.store_id
            }
        })
        await Product.update(
            { status: request.status },
            {
                where: {
                    store_id: request.store_id
                }
            }
        );

        const lastRecord = await subscriptionBuyer.findOne({
            where: { store_service_id: request.store_id },
            order: [['id', 'DESC']],
        });

        if (lastRecord) {
            await lastRecord.update({ status: request.status });
        }
        UsersDetails.update(param, { where: { id: request.store_id } })
            .then(async () => {
                const storeServDetails = await UsersDetails.findOne({
                    attributes: [
                        'en_name', 'user_id'
                    ],
                    where: { id: request.store_id }
                });

                const userdata = await Users.findOne({
                    attributes: [
                        'id', 'language'
                    ], where: { is_deleted: 0, id: storeServDetails.user_id }
                });

                if (request.status == 1) {
                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_active_store_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        field_title: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_active_store_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_status_update_success'), null);
                } else {
                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_inactive_store_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        field_title: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_inactive_store_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_status_update_success'), null);
                }
                // return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to  accept reject store
     * @param {request} req
     * @param {Function} res
     */
    acceptRejectStore: async function (request, res) {
        var param = {
            is_approved: request.is_approved,
        };
        UsersDetails.update(param, { where: { id: request.store_id } })
            .then(async () => {
                if (request.is_approved == '1') {

                    const storeServDetails = await UsersDetails.findOne({
                        attributes: [
                            'en_name', 'user_id'
                        ],
                        where: { id: request.store_id }
                    });

                    const userdata = await Users.findOne({
                        attributes: [
                            'id', 'language'
                        ], where: { is_deleted: 0, id: storeServDetails.user_id }
                    });

                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_store_serv_appro_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        field_title: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_store_serv_appro_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });

                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_accept_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_reject_success'), null);
                }
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get service list
     * @param {request} request
     * @param {Function} res
     */
    async serviceList(request, res) {
        try {
            const whereConditions = { type: 'service', is_deleted: 0 };

            const list = await UsersDetails.findAll({
                order: [['is_approved', 'ASC'], ['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'category_id',
                    'type',
                    'en_name',
                    'guj_name',
                    'whatsapp_number',
                    'en_work_details',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'status',
                    'is_approved',
                    'is_deleted',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name']
                ],
                where: whereConditions,
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    },
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    }
                ]
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_service_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get service deatils
     * @param {request} request
     * @param {Function} res
     */
    async getServiceDetails(request, res) {
        try {
            const whereConditions = { id: request.service_id, type: 'service', is_deleted: 0 };

            const serviceDetails = await UsersDetails.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'category_id',
                    'type',
                    'en_name',
                    'guj_name',
                    'whatsapp_number',
                    'en_work_details',
                    'guj_work_details',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.IMAGE_BASE_URL, GLOBALS.USER_PHOTO, SequelizePakcage.col('tbl_user_details.profile_image'),
                        ),
                        'service_image',
                    ],
                    'image',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'landmark',
                    'status',
                    'is_approved',
                    'is_deleted',
                    'used_space',
                    'storage_limit',
                    'createdAt',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('userdata.en_full_name'), 'service_provider_name']
                ],
                where: whereConditions,
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    },
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    }
                ]
            });
            if (serviceDetails != undefined && serviceDetails != null && serviceDetails.length > 0) {

                let imageArray = serviceDetails[0].image.split(",");
                let serviceImages = [];
                if (imageArray.length > 0) {
                    const serviceData = imageArray.map(data => (
                        serviceImages.push(GLOBALS.IMAGE_BASE_URL+ GLOBALS.USER_PHOTO + data)
                    ));
                }

                serviceDetails[0].setDataValue('service_images', serviceImages);
                const planBuyDetails = await BuyPlans.findAll({
                    attributes: [
                        'id',
                        'plan_id',
                        'is_premium',
                        'start_date',
                        'end_date',
                        'plan_details',
                    ],

                    include: [
                        {
                            model: SubscriptionPlans,
                            as: 'plandata',
                            attributes: [
                                'id',
                                'title',
                                'guj_title',
                            ],
                        },
                    ],
                    where: {
                        store_service_id: serviceDetails[0].id,
                        status: 1,
                        is_deleted: 0,
                    },
                });
                serviceDetails[0].setDataValue('plandata', planBuyDetails[0])
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_details_success'), serviceDetails[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            console.log("error", error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },


    /**
     * Function to delete service
     * @param {request} request
     * @param {Function} res
     */
    async deleteService(request, res) {
        try {
            UsersDetails.findOne({ where: { id: request.service_id } }).then(function (service) {
                if (service) {
                    UsersDetails.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.service_id } }
                    )
                        .then(async () => {

                            const storeServDetails = await UsersDetails.findOne({
                                attributes: [
                                    'en_name', 'user_id'
                                ],
                                where: { id: request.service_id }
                            });

                            const userdata = await Users.findOne({
                                attributes: [
                                    'id', 'language'
                                ], where: { is_deleted: 0, id: storeServDetails.user_id }
                            });

                            NotificationModel.prepareNotification({
                                sender_id: 0,
                                receiver_id: userdata.id,
                                action_id: 0,
                                lang: userdata.language == 'English' ? 'en' : 'guj',
                                title: {
                                    keyword: 'rest_store_serv_delete_title',
                                    components: { field: storeServDetails.en_name },
                                },
                                tag: 'admin_notification',
                                field: JSON.stringify({ field: storeServDetails.en_name }),
                                field_title: JSON.stringify({ field: storeServDetails.en_name }),
                                message: {
                                    keyword: 'rest_store_serv_delete_msg',
                                    components: { field: storeServDetails.en_name },
                                },
                                add_notification: 1,
                            });

                            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_delete_success'), null);
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_service_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update service status
     * @param {request} req
     * @param {Function} res
     */
    updateServiceStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        UsersDetails.update(param, { where: { id: request.service_id } })
            .then(async () => {

                const storeServDetails = await UsersDetails.findOne({
                    attributes: [
                        'en_name', 'user_id'
                    ],
                    where: { id: request.service_id }
                });

                const userdata = await Users.findOne({
                    attributes: [
                        'id', 'language'
                    ], where: { is_deleted: 0, id: storeServDetails.user_id }
                });

                if (request.status == 1) {
                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_active_store_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_active_store_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_status_update_success'), null);
                } else {
                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_inactive_store_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        field_title: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_inactive_store_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_status_update_success'), null);
                }


                // return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
    * Function to  accept reject store
    * @param {request} req
    * @param {Function} res
    */
    acceptRejectService: async function (request, res) {
        var param = {
            is_approved: request.is_approved,
        };
        UsersDetails.update(param, { where: { id: request.service_id } })
            .then(async () => {
                if (request.is_approved == '1') {

                    const storeServDetails = await UsersDetails.findOne({
                        attributes: [
                            'en_name', 'user_id'
                        ],
                        where: { id: request.service_id }
                    });

                    const userdata = await Users.findOne({
                        attributes: [
                            'id', 'language'
                        ], where: { is_deleted: 0, id: storeServDetails.user_id }
                    });

                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: userdata.id,
                        action_id: 0,
                        lang: userdata.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_store_serv_appro_title',
                            components: { field: storeServDetails.en_name },
                        },
                        tag: 'admin_notification',
                        field: JSON.stringify({ field: storeServDetails.en_name }),
                        field_title: JSON.stringify({ field: storeServDetails.en_name }),
                        message: {
                            keyword: 'rest_store_serv_appro_msg',
                            components: { field: storeServDetails.en_name },
                        },
                        add_notification: 1,
                    });

                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_accept_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_service_reject_success'), null);
                }
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get social links
     * @param {request} request
     * @param {Function} res
    */
    async getSocialLinks(request, res) {
        try {
            const whereConditions = { status: '1', is_deleted: 0 };

            const socialLinks = await SocialLinks.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'instagram',
                    'facebook',
                    'youtube',
                    'status',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });

            if (socialLinks != undefined && socialLinks != null && socialLinks.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_social_links_found_success'), socialLinks[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update social links
     * @param {request} req
     * @param {Function} res
     */
    async updateSocialLinks(request, res) {
        try {
            var param = {
                instagram: request.instagram,
                facebook: request.facebook,
                youtube: request.youtube,
            };
            await SocialLinks.update(param, { where: { id: request.social_id } })

            const userdata = await Users.findAll({
                attributes: [
                    'id', 'language'
                ], where: { is_deleted: 0, is_notification: 1 }
            });
            const userIds = userdata.map(user => user.id).join(',');

            // NotificationModel.prepareNotificationBulk({
            //     multiple_user_id:userIds,
            //     sender_id: 0,
            //     action_id: 0,
            //     tag: 'admin_notification',
            //     title: 'Attention Required',
            //     message: `Stay Updated: Follow Our Social Media Pages!`,
            //     add_notification: 1,
            // });

            setTimeout(() => {
                // eslint-disable-next-line array-callback-return
                userdata.map((x) => {
                    NotificationModel.prepareNotification({
                        sender_id: 0,
                        receiver_id: x.id,
                        action_id: 0,
                        lang: x.language == 'English' ? 'en' : 'guj',
                        title: {
                            keyword: 'rest_social_media_title',
                            components: {},
                        },
                        tag: 'admin_notification',
                        message: {
                            keyword: 'rest_social_media_msg',
                            components: {},
                        },
                        add_notification: 1,
                    });
                })
            }, 1000);

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_social_links_update_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
        }

    },

    /**
     * Function to get contact details
     * @param {request} request
     * @param {Function} res
    */
    async getContactDetails(request, res) {
        try {
            const whereConditions = { status: '1', is_deleted: 0 };

            const contactDetails = await ContactDetails.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'email',
                    'country_code',
                    'phone',
                    'image',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.CDN_S3_URL, "/", SequelizePakcage.col('image'),
                        ),
                        'current_image',
                    ],
                    'status'
                ],
                where: whereConditions,
            });
            if (contactDetails != undefined && contactDetails != null && contactDetails.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_contact_details_found_success'), contactDetails[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update contact details
     * @param {request} req
     * @param {Function} res
     */
    async updateContactDetails(request, res) {
        var param = {
            email: request.email,
            country_code: request.country_code,
            phone: request.phone,
            image: request.image
        };
        ContactDetails.update(param, { where: { id: request.contact_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_contact_details_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get store category list api
     * @param {request} request
     * @param {Function} res
     */
    async getStoreCategoryList(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await StoreCategory.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.CDN_S3_URL, '/', SequelizePakcage.col('image'),
                        ),
                        'image',
                    ],
                    'status',
                    'createdAt'
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },


    /**
     * Function to update store category status
     * @param {request} req
     * @param {Function} res
    */
    updateStoreCategoryStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        StoreCategory.update(param, { where: { id: request.category_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to delete store category
     * @param {request} request
     * @param {Function} res
    */
    async deleteStoreCategory(request, res) {
        try {
            StoreCategory.findOne({ where: { id: request.category_id } }).then(function (category) {
                if (category) {
                    StoreCategory.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.category_id } }
                    )
                        .then(function () {
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_store_category_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add store category
     * @param {request} request
     * @param {Function} res
    */
    async addStoreCategory(request, res) {
        try {
            const category = await StoreCategory.findOne({
                attributes: ['id'],
                where: {
                    role: request.role,
                    is_deleted: 0,
                    [Op.or]: [{ en_name: request.en_name.toLowerCase() }, { guj_name: request.guj_name.toLowerCase() }],
                },
            });
            if (category) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_store_category_already_exists'), null);
            } else {

                let categoryParams = {
                    role: request.role,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    image: request.image
                };
                const addCategory = await StoreCategory.create(categoryParams);

                const userdata = await Users.findAll({
                    attributes: [
                        'id', 'language'
                    ], where: { is_deleted: 0, is_notification: 1 }
                });
                const userIds = userdata.map(user => user.id).join(',');


                setTimeout(() => {
                    // eslint-disable-next-line array-callback-return
                    userdata.map((x) => {
                        if (request.role == 1) {
                            NotificationModel.prepareNotification({
                                sender_id: 0,
                                receiver_id: x.id,
                                action_id: 0,
                                lang: x.language == 'English' ? 'en' : 'guj',
                                title: {
                                    keyword: 'rest_new_store_cat_title',
                                    components: {},
                                },
                                tag: 'admin_notification',
                                message: {
                                    keyword: 'rest_new_store_cat_msg',
                                    components: {},
                                },
                                add_notification: 1,
                            });
                        } else {
                            NotificationModel.prepareNotification({
                                sender_id: 0,
                                receiver_id: x.id,
                                action_id: 0,
                                lang: x.language == 'English' ? 'en' : 'guj',
                                title: {
                                    keyword: 'rest_new_service_cat_title',
                                    components: {},
                                },
                                tag: 'admin_notification',
                                message: {
                                    keyword: 'rest_new_service_cat_msg',
                                    components: {},
                                },
                                add_notification: 1,
                            });
                        }
                    })
                }, 1000);

                // if (request.role == 1) {
                //     NotificationModel.prepareNotificationBulk({
                //         multiple_user_id:userIds,
                //         sender_id: 0,
                //         action_id: 0,
                //         tag: 'admin_notification',
                //         title: 'New Store Category Added : નવી સ્ટોર શ્રેણી ઉમેરાઈ છે',
                //         message: `Explore Now! હવે શોધો!`,
                //         add_notification: 1,
                //     });
                //     return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_added_success'), addCategory);
                // } else {
                //     NotificationModel.prepareNotificationBulk({
                //         multiple_user_id:userIds,
                //         sender_id: 0,
                //         action_id: 0,
                //         tag: 'admin_notification',
                //         title: 'New Service Provider Category Added',
                //         message: `Discover Our New Service Provider Category! અમારી નવી સેવા પ્રદાતા શ્રેણી શોધો!`,
                //         add_notification: 1,
                //     });
                // } 

                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_added_success'), addCategory);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get store category details
     * @param {request} request
     * @param {Function} res
    */
    async getStoreCategorydetails(request, res) {
        try {
            const category = await StoreCategory.findOne({
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    'image',
                    [
                        SequelizePakcage.fn('CONCAT',
                            GLOBALS.CDN_S3_URL, "/", SequelizePakcage.col('image'),
                        ),
                        'current_image',
                    ],
                    'status',
                ],
                where: {
                    id: request.category_id,
                    is_deleted: 0
                },
            });
            if (category != undefined && category != null) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_store_category_details'), category);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_store_category_details_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update store category details
     * @param {request} request
     * @param {Function} res
    */
    async updateStoreCategoryDetails(request, res) {
        try {
            const category = await StoreCategory.findOne({
                where: {
                    role: request.role,
                    [Op.or]: [{ en_name: request.en_name.toLowerCase() }, { guj_name: request.guj_name.toLowerCase() }],
                    id: {
                        [Op.ne]: request.category_id,
                    },
                    is_deleted: 0
                },
            });

            if (category) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_store_category_already_exists'), null);
            } else {

                let categoryParams = {
                    role: request.role,
                    en_name: request.en_name,
                    guj_name: request.guj_name,
                    image: request.image
                };

                StoreCategory.update(categoryParams, { where: { id: request.category_id } })
                    .then(function () {
                        return middleware.sendApiResponse(
                            res,
                            CODES.SUCCESS,
                            t('rest_store_category_details_update_success'),
                            null
                        );
                    })
                    .catch(function (err) {
                        return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                    });
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Market Place List
     * @param {request} request
     * @param {Function} res
    */
    async marketPlaceList(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await MarketPlace.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'name',
                    'guj_name',
                    'status',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_market_list_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Market Place Status
     * @param {request} req
     * @param {Function} res
    */
    updateMarketPlaceStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        MarketPlace.update(param, { where: { id: request.market_place_id } })
            .then(async function () {
                const data = await UsersDetails.findAll({ where: { market_place_id: request.market_place_id } });
                await adminModel.updateProductData(data, param);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_market_place_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    updateProductData: async function (stores, param) {
        for (const store of stores) {
            await UsersDetails.update(
                param,
                { where: { id: store.id } }
            );

            const products = await Product.findAll({ where: { store_id: store.id } });
            for (const element of products) {
                await Product.update(
                    param,
                    { where: { id: element.id } }
                );
                await SaveProduct.update(
                    param,
                    { where: { product_id: element.id } }
                )
            }
        };
    },

    /**
     * Function to delete Market Place
     * @param {request} request
     * @param {Function} res
    */
    async deleteMarketPlace(request, res) {
        try {
            MarketPlace.findOne({ where: { id: request.market_place_id } }).then(function (marketPlace) {
                if (marketPlace) {
                    MarketPlace.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.market_place_id } }
                    )
                        .then(async function () {
                            const data = await UsersDetails.findAll({ where: { market_place_id: request.market_place_id } });
                            await adminModel.updateProductData(data, { is_deleted: 1 });
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_market_place_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_market_place_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add Market Place
     * @param {request} request
     * @param {Function} res
    */
    async addMarketPlace(request, res) {
        try {
            const marketPlace = await MarketPlace.findOne({
                attributes: ['id'],
                where: {
                    name: request.name,
                    is_deleted: 0
                },
            });
            if (marketPlace) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_market_place_already_exists'), null);
            } else {

                let marketPlaceParams = {
                    name: request.name,
                    guj_name: request.guj_name
                };
                const addMarketPlace = await MarketPlace.create(marketPlaceParams);

                const userdata = await Users.findAll({
                    attributes: [
                        'id', 'language'
                    ], where: { is_deleted: 0, is_notification: 1 }
                });

                setTimeout(() => {
                    // eslint-disable-next-line array-callback-return
                    userdata.map((x) => {
                        NotificationModel.prepareNotification({
                            sender_id: 0,
                            receiver_id: x.id,
                            action_id: 0,
                            lang: x.language == 'English' ? 'en' : 'guj',
                            title: {
                                keyword: 'rest_create_marketplace_title',
                                components: {},
                            },
                            tag: 'admin_notification',
                            message: {
                                keyword: 'rest_create_marketplace_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                    })
                }, 1000);

                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_market_place_added_success'), addMarketPlace);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Market Place details
     * @param {request} req
     * @param {Function} res
    */
    updateMarketPlaceDetails: async function (request, res) {
        var param = {
            name: request.name,
            guj_name: request.guj_name
        };
        MarketPlace.update(param, { where: { id: request.market_place_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_market_place_details_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to get Subscription Plans
     * @param {request} request
     * @param {Function} res
    */
    async getSubscriptionPlans(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };
            const list = await SubscriptionPlans.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'title',
                    'guj_title',
                    'no_images',
                    'storage',
                    'storage_type',
                    'benefit',
                    'payment_procedure',
                    'guj_payment',
                    'guj_benefit',
                    'monthly_price',
                    'yearly_price',
                    'type',
                    'is_free',
                    'status',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_subscription_plans_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Subscription Plan Status
     * @param {request} req
     * @param {Function} res
    */
    updateSubscriptionPlanStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        SubscriptionPlans.update(param, { where: { id: request.subscription_plan_id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_subscription_plan_status_update_success'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to delete Subscription Plan
     * @param {request} request
     * @param {Function} res
    */
    async deleteSubscriptionPlan(request, res) {
        try {
            SubscriptionPlans.findOne({ where: { id: request.subscription_plan_id } }).then(function (subscriptionPlan) {
                if (subscriptionPlan) {
                    SubscriptionPlans.update(
                        {
                            is_deleted: 1,
                        },
                        { where: { id: request.subscription_plan_id } }
                    )
                        .then(function () {
                            return middleware.sendApiResponse(
                                res,
                                CODES.SUCCESS,
                                t('rest_subscription_plan_delete_success'),
                                null
                            );
                        })
                        .catch(function (err) {
                            return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                        });
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subscription_plan_not_found'), null);
                }
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add Subscription Plan
     * @param {request} request
     * @param {Function} res
    */
    async addSubscriptionPlan(request, res) {
        try {
            const subscriptionPlan = await SubscriptionPlans.findOne({
                attributes: ['id'],
                where: {
                    title: request.title,
                    no_images: request.no_images,
                    storage: request.storage,
                    storage_type: request.storage_type,
                    monthly_price: request.monthly_price,
                    yearly_price: request.yearly_price,
                    type: request.type,
                    is_free: request.is_free,
                    is_deleted: 0
                },
            });
            if (subscriptionPlan) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subscription_plan_already_exists'), null);
            } else {

                if (request.is_free == '1') {
                    const freeSubscriptionPlan = await SubscriptionPlans.findAll({
                        attributes: ['id'],
                        where: { type: request.type, is_free: '1', is_deleted: '0' },
                    });

                    if (freeSubscriptionPlan.length > 0) {
                        await SubscriptionPlans.update({ is_free: '0' }, { where: { type: request.type, is_free: '1', is_deleted: '0' } }, { multi: true });
                    }
                }

                let subscriptionPlanParams = {
                    title: request.title,
                    guj_title: request.guj_title,
                    no_images: request.no_images,
                    storage: request.storage,
                    storage_type: request.storage_type,
                    type: request.type,
                    monthly_price: request.monthly_price,
                    yearly_price: request.yearly_price,
                    benefit: request.benefit,
                    payment_procedure: request.payment_procedure,
                    guj_benefit: request.guj_benefit,
                    guj_payment: request.guj_payment,
                    is_free: request.is_free,
                };
                const addSubscriptionPlan = await SubscriptionPlans.create(subscriptionPlanParams);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_subscription_plan_added_success'), addSubscriptionPlan);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Subscription Plan Details
     * @param {request} request
     * @param {Function} res
    */
    async getSubscriptionPlanDetails(request, res) {
        try {
            const whereConditions = { id: request.subscription_plan_id, is_deleted: 0 };
            const list = await SubscriptionPlans.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'title',
                    'guj_title',
                    'no_images',
                    'storage',
                    'storage_type',
                    'benefit',
                    'payment_procedure',
                    'guj_benefit',
                    'guj_payment',
                    'monthly_price',
                    'yearly_price',
                    'type',
                    'is_free',
                    'status',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_subscription_plan_details_success'), list[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Subscription Plan Details
     * @param {request} request
     * @param {Function} res
    */
    async updateSubscriptionPlanDetails(request, res) {
        try {
            const subscriptionPlan = await SubscriptionPlans.findOne({
                attributes: ['id'],
                where: {
                    id: {
                        [Op.ne]: request.subscription_plan_id,
                    },
                    title: request.title,
                    no_images: request.no_images,
                    storage: request.storage,
                    storage_type: request.storage_type,
                    monthly_price: request.monthly_price,
                    yearly_price: request.yearly_price,
                    type: request.type,
                    is_free: request.is_free,
                    is_deleted: 0
                },
            });
            if (subscriptionPlan) {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_subscription_plan_already_exists'), null);
            } else {

                if (request.is_free == '1') {
                    const freeSubscriptionPlan = await SubscriptionPlans.findAll({
                        attributes: ['id'],
                        where: { type: request.type, is_free: '1', is_deleted: '0' },
                    });

                    if (freeSubscriptionPlan.length > 0) {
                        await SubscriptionPlans.update({ is_free: '0' }, { where: { type: request.type, is_free: '1', is_deleted: '0' } }, { multi: true });
                    }
                }

                let subscriptionPlanParams = {
                    title: request.title,
                    guj_title: request.guj_title,
                    no_images: request.no_images,
                    storage: request.storage,
                    storage_type: request.storage_type,
                    type: request.type,
                    monthly_price: request.monthly_price,
                    yearly_price: request.yearly_price,
                    benefit: request.benefit,
                    payment_procedure: request.payment_procedure,
                    guj_benefit: request.guj_benefit,
                    guj_payment: request.guj_payment,
                    is_free: request.is_free,
                };
                SubscriptionPlans.update(subscriptionPlanParams, { where: { id: request.subscription_plan_id } })
                    .then(async () => {

                        const userdata = await Users.findAll({
                            attributes: [
                                'id', 'language'
                            ], where: { is_deleted: 0, is_notification: 1, role: { [Op.ne]: 0 } }
                        });

                        setTimeout(() => {
                            // eslint-disable-next-line array-callback-return
                            userdata.map((x) => {
                                NotificationModel.prepareNotification({
                                    sender_id: 0,
                                    receiver_id: x.id,
                                    action_id: 0,
                                    lang: x.language == 'English' ? 'en' : 'guj',
                                    title: {
                                        keyword: 'rest_update_subscription_title',
                                        components: {},
                                    },
                                    tag: 'admin_notification',
                                    message: {
                                        keyword: 'rest_update_subscription_msg',
                                        components: {},
                                    },
                                    add_notification: 1,
                                });
                            })
                        }, 1000);

                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_subscription_plan_details_update_success'), null);
                    })
                    .catch(function (err) {
                        return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                    });
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get AdManager List
     * @param {request} req
     * @param {Function} res
    */
    async getAdManagerList(req, res) {
        try {
            const PageName = ["Flash Screen", "Home Page", "General Pages", "Store Category", "Service Category"];

            const adManagerData = await AdManagers.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'role',
                    'sponsor_name',
                    'sponsor_email',
                    'page_name',
                    'start_date',
                    'end_date',
                    'price',
                    'ad_status',
                    'ad_sponser',
                    'impression_count',
                    'click_count',
                    'is_default',
                    'payment_type',
                    'transaction_id',
                    'status',
                    'createdAt',
                    'is_deleted',
                ],
                where: {
                    is_deleted: 0,
                },
            });

            if (adManagerData.length > 0) {
                for (const item of adManagerData) {
                    const marketPlaceArray = item.market_place_id.split(',');

                    // Query for all market places related to this adManager in a single call
                    const marketPlaces = await MarketPlace.findAll({
                        attributes: ['id', 'name', 'status', 'is_deleted'],
                        where: {
                            id: marketPlaceArray, // Fetch all market places in one query
                            is_deleted: 0
                        }
                    });

                    // Map the fetched marketPlaces to their names
                    const marketPlaceNames = marketPlaces.map(marketPlace => marketPlace.name);
                    item.setDataValue('market_place_name', marketPlaceNames.join(', '));
                }
                for (const item of adManagerData) {
                    const pageArray = item.page_name.split(',')
                    const pages = pageArray.map(index => PageName[index - 1]);
                    item.setDataValue('page_name', pages.join(', '));
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_ad_manager_list_success'), adManagerData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get AdManager Details
     * @param {request} req
     * @param {Function} res
    */
    async getAdManagerDetails(req, res) {
        try {
            // const PageName = ["Flash Screen", "Home Page", "General Pages", "Store Category", "Service Category"];
            const PageName = ["1", "2", "3", "4", "5"];

            const adManagerData = await AdManagers.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'role',
                    'store_category_id',
                    'redirect_id',
                    'sponsor_name',
                    'sponsor_email',
                    'page_name',
                    'start_date',
                    'end_date',
                    'is_default',
                    'ad_sponser',
                    'price',
                    [col('marketplacedata.name'), 'market_place_name'],
                    'ad_status',
                    'impression_count',
                    'click_count',
                    'payment_type',
                    'transaction_id',
                    'status',
                    'is_deleted',
                ],
                where: {
                    id: req.ad_manager_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    }
                ]
            });

            const adSocialUrl = await AddSocialMedias.findAll({
                attributes: [
                    'id',
                    'url',
                    'type'
                ],
                where: {
                    ads_id: req.ad_manager_id
                }
            })

            const adImages = await AddManagerImages.findAll({
                attributes: [
                    'image'
                ],
                where: {
                    add_manager_id: req.ad_manager_id
                }
            })

            const adsImg = [];
            if (adImages.length > 0) {
                const imageads = adImages.map(data => (
                    adsImg.push(GLOBALS.IMAGE_BASE_URL + GLOBALS.ADS_BANNER_IMAGES + data.image)
                ));
            }

            if (adManagerData.length > 0) {
                for (const item of adManagerData) {
                    const pageArray = item.page_name.split(',')
                    const pages = pageArray.map(index => PageName[index - 1]);
                    item.setDataValue('page_name', pages.join(', '));
                    item.setDataValue('urls', adSocialUrl);
                    item.setDataValue('image', adsImg);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_ad_manager_list_success'), adManagerData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete AdManager
     * @param {request} request
     * @param {Function} res
    */
    async deleteAdManager(request, res) {
        try {
            AdManagers.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.ad_manager_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_ad_manager_delete_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update AdManager Status
     * @param {request} request
     * @param {Function} res
    */
    async updateAdManagerStatus(request, res) {
        try {
            AdManagers.update(
                {
                    status: request.status,
                },
                { where: { id: request.ad_manager_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_ad_manager_status_update_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add AdManager
     * @param {request} request
     * @param {Function} res
    */
    async addAdManager(request, res) {
        try {

            const checkUserWithstore = await UsersDetails.findAll({
                where: { is_deleted: 0, id: request.redirect_id, type: request.role == 1 ? 'store' : 'service' }
            })


            if (checkUserWithstore.length > 0 || request.role == 3) {


                if (request.is_default == '1') {
                    const defaultAds = await AdManagers.findAll({
                        attributes: ['id'],
                        where: { is_default: '1', is_deleted: '0' },
                    });

                    if (defaultAds.length > 0) {
                        await AdManagers.update({ is_default: '0' }, { where: { is_default: '1', is_deleted: '0' } }, { multi: true });
                    }
                }

                let addAdManagerParams = {
                    market_place_id: request.market_place_id,
                    role: request.role,
                    sponsor_name: request.sponsor_name,
                    sponsor_email: request.sponsor_email,
                    page_name: request.page_name == 'false' || request.page_name == '' ? '0' : request.page_name,
                    start_date: request.start_date,
                    end_date: request.end_date,
                    redirect_id: request.redirect_id,
                    store_category_id: request.store_category_id,
                    price: request.price,
                    payment_type: request.payment_type,
                    transaction_id: request.transaction_id,
                    is_default: request.is_default,
                    ad_sponser: request.ad_sponser,
                    ad_status: moment().utc().format('YYYY-MM-DD') >= request.start_date ? 2 : 1
                };
                const addAdManager = await AdManagers.create(addAdManagerParams);
                const imagesData = request.image.map(data => ({
                    image: data,
                    add_manager_id: addAdManager.id,
                }));

                await AddManagerImages.bulkCreate(imagesData);

                const urlData = request.redirect_url.map(data => ({
                    url: data.url,
                    type: data.type,
                    ads_id: addAdManager.id,
                }));

                await AddSocialMedias.bulkCreate(urlData);

                if (moment().utc().format('YYYY-MM-DD') >= request.start_date) {
                    const adManagerEmailTemplate = await adManagerTemplate.sendMailAdsRunning({ sponsorName: request.sponsor_name, end_date: request.end_date });
                    const sendMail = await common.sendEmail('Your Ad is Now Live on ' + GLOBALS.APP_NAME + '!', request.sponsor_email, adManagerEmailTemplate)
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_ad_manager_added_success'), null);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('Store/Service id not connected with the the selected role'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to edit AdManager
     * @param {request} request
     * @param {Function} res
    */
    async editAdManager(request, res) {
        try {

            const checkUserWithstore = await UsersDetails.findAll({
                where: { is_deleted: 0, id: request.redirect_id, type: request.role == 1 ? 'store' : 'service' }
            })

            if (checkUserWithstore.length > 0 || request.role == 3) {

                // eslint-disable-next-line no-nested-ternary
                const adStatus = request.start_date > moment().utc().format('YYYY-MM-DD') ? 1 : request.end_date < moment().utc().format('YYYY-MM-DD') ? 3 : request.end_date > moment().utc().format('YYYY-MM-DD') ? 2 : 'null';

                const editAdManagerParams = {
                    market_place_id: request.market_place_id,
                    role: request.role,
                    sponsor_name: request.sponsor_name,
                    sponsor_email: request.sponsor_email,
                    page_name: request.page_name == '' || request.page_name == 'false' ? '0' : request.page_name,
                    start_date: request.start_date,
                    end_date: request.end_date,
                    redirect_id: request.redirect_id,
                    store_category_id: request.store_category_id,
                    price: request.price,
                    payment_type: request.payment_type,
                    transaction_id: request.transaction_id,
                    is_default: request.is_default,
                    ad_sponser: request.ad_sponser,
                    ad_status: adStatus
                };
                const editAdManager = await AdManagers.update(editAdManagerParams,
                    {
                        where: {
                            id: request.ad_id
                        }
                    }
                );
                if (request.image) {
                    const imagesData = request.image.map(data => ({
                        image: data,
                        add_manager_id: request.ad_id
                    }));

                    await AddManagerImages.bulkCreate(imagesData);
                }
                await AddSocialMedias.destroy({
                    where: {
                        ads_id: request.ad_id
                    }
                })

                const urlData = request.redirect_url.map(data => ({
                    url: data.url,
                    type: data.type,
                    ads_id: request.ad_id
                }));

                await AddSocialMedias.bulkCreate(urlData);

                if (moment().utc().format('YYYY-MM-DD') >= request.start_date) {
                    const adManagerEmailTemplate = await adManagerTemplate.sendMailforEdit({ sponsorName: request.sponsor_name, start_date: request.start_date, end_date: request.end_date });
                    const sendMail = await common.sendEmail('Ad Manager' + '- ' + GLOBALS.APP_NAME, request.sponsor_email, adManagerEmailTemplate)
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_ad_manager_edited_success'), null);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('Store/Service id not connected with the the selected role'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to send Notification
     * @param {request} request
     * @param {Function} res
    */
    async sendNotification(request, res) {
        try {
            let userIds;
            if (request.role == 0) {
                const userList = await Users.findAll({
                    attributes: ['id'],
                    where: { role: 0, status: 1, is_deleted: 0, is_notification: 1 },
                });
                userIds = userList.map(user => user.id).join(',');
            } else if (request.role == 1) {
                const userList = await Users.findAll({
                    attributes: ['id'],
                    where: { role: 1, status: 1, is_deleted: 0, is_notification: 1 },
                });
                userIds = userList.map(user => user.id).join(',');
            } else if (request.role == 2) {
                const userList = await Users.findAll({
                    attributes: ['id'],
                    where: { role: 2, status: 1, is_deleted: 0, is_notification: 1 },
                });
                userIds = userList.map(user => user.id).join(',');
            } else {
                const userList = await Users.findAll({
                    attributes: ['id'],
                    where: { status: 1, is_deleted: 0, is_notification: 1 },
                });
                userIds = userList.map(user => user.id).join(',');
            }

            NotificationModel.prepareNotificationBulk({
                multiple_user_id: userIds,
                sender_id: 0,
                action_id: 0,
                tag: 'admin_notification',
                title: request.title,
                message: request.message,
                add_notification: 1,
            });
            // console.log("userList",userList)
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_send_admin_notification_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get subscription buyer list
     * @param {request} req
     * @param {Function} res
    */
    async getSubscriptionBuyerList(req, res) {
        try {

            const subscriptionBuyerData = await subscriptionBuyer.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'role',
                    [col('userdata.en_full_name'), 'user_name'],
                    [col('storeservicedata.en_name'), 'store_service_name'],
                    [col('plandata.title'), 'plan_name'],
                    'start_date',
                    'end_date',
                    'is_premium',
                    'status',
                    'createdAt',
                    'is_deleted',
                    [col('storeservicedata.is_approved'), 'is_approved']
                ],
                where: {
                    is_deleted: 0,
                },
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    },
                    {
                        model: UsersDetails,
                        as: 'storeservicedata',
                        include: [
                            {
                                model: MarketPlace,
                                as: 'marketplacedata',
                                attributes: ['id', 'name'], // Adjust attributes as needed
                            },
                            {
                                model: Category,
                                as: 'categorydata',
                                attributes: ['id', 'en_name', 'guj_name'], // Adjust attributes as needed
                            },
                        ],
                    },
                    {
                        model: SubscriptionPlans,
                        as: 'plandata',
                    },

                ]
            });

            if (subscriptionBuyerData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_subscription_buyer_list_success'), subscriptionBuyerData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_get_subscription_buyer_list_fail'), null);
            }
        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get subscription buyer details
     * @param {request} req
     * @param {Function} res
    */
    async getSubscriptionBuyerDetails(req, res) {
        try {

            const subscriptionBuyerData = await subscriptionBuyer.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'role',
                    'user_id',
                    'store_service_id',
                    'plan_id',
                    'start_date',
                    'end_date',
                    'is_premium',
                    'status',
                    'is_deleted',
                ],
                where: {
                    id: req.subscription_buyer_id,
                    is_deleted: 0,
                }
            });

            if (subscriptionBuyerData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_get_subscription_buyer_list_success'), subscriptionBuyerData[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_get_subscription_buyer_list_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },


    /**
     * Function to delete Subscription Buyer
     * @param {request} request
     * @param {Function} res
    */
    async deleteSubscriptionBuyer(request, res) {
        try {
            subscriptionBuyer.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.subscription_buyer_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_delete_subscription_buyer_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Subscription Buyer Status
     * @param {request} request
     * @param {Function} res
    */
    async updateSubscriptionBuyerStatus(request, res) {
        try {
            subscriptionBuyer.update(
                {
                    status: request.status,
                },
                { where: { id: request.subscription_buyer_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_subscription_buyer_status_update_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Users List By Role
     * @param {request} request
     * @param {Function} res
    */
    async getUsersListByRole(request, res) {
        try {
            const whereConditions = { is_deleted: 0, role: request.role };

            const list = await Users.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    'status',
                    'role',
                    'is_verified',
                    'is_available',
                    'createdAt',
                    'is_deleted',
                ],
                where: whereConditions,
            });
            // console.log("-->",list)
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_users_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Store Service By User
     * @param {request} req
     * @param {Function} res
    */
    async getStoreServiceByUser(req, res) {
        try {
            const userDetails = await UsersDetails.findAll({
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'status',
                ],
                where: {
                    user_id: req.user_id,
                    is_deleted: 0,
                    is_approved: 1
                },
            });

            if (userDetails != undefined && userDetails != null && userDetails.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userDetails);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to add Subscription Buyer
     * @param {request} request
     * @param {Function} res
    */
    async addSubscriptionBuyer(request, res) {
        console.log('request: ', request);
        try {
            const storageLimit = await SubscriptionPlans.findOne({
                // attributes: ['id', 'title','no_images', 'storage', 'storage_type','type','benefit','payment_procedure','monthly_price','yearly_price','createdAt'],
                where: { id: request.plan_id },
            });

            await subscriptionBuyer.update(
                {
                    status: 0
                },
                { where: { user_id: request.user_id, store_service_id: request.store_service_id } }
            )

            let params = {
                role: request.role,
                user_id: request.user_id,
                store_service_id: request.store_service_id,
                plan_id: request.plan_id,
                start_date: request.start_date,
                end_date: request.end_date,
                is_premium: request.is_premium,
                plan_details: JSON.stringify(storageLimit)
            };

            const addDetails = await subscriptionBuyer.create(params);

            const bytesConvert = storageLimit.storage_type == 0 ? storageLimit.storage * 1000 : storageLimit.storage_type == 1 ? storageLimit.storage * 1000000 : storageLimit.storage * 1000000
            console.log("Parsed Store Service ID:", parseInt(request.store_service_id));
            const usersData = await UsersDetails.findOne({
                attributes: ['id', 'is_sorting'],
                where: {
                    status: 1,
                    is_deleted: 0,
                    is_approved: 1,
                    // user_id: { $ne: request.user_id },
                    id: { [Sequelize.Op.ne]: parseInt(request.store_service_id, 10) }
                },
                order: [['id', 'DESC']],
            });
            console.log('storageLimit: ', storageLimit);
            const udpateUserData = await UsersDetails.update(
                {
                    is_premium: request.is_premium,
                    storage_limit: bytesConvert,
                    is_sorting: storageLimit && storageLimit.title ? (storageLimit.title.match(/golden/i) ? 2 : (storageLimit.title.match(/silver/i) ? 1 : 0)) : 0,
                    updatedAt: moment.utc().format('YYYY-MM-DD HH:mm:ss')
                },
                { where: { user_id: request.user_id, id: request.store_service_id } }
            )

            // const sortingIncre = await UsersDetails.increment(
            //     { is_sorting: +1 },
            //     // { where: { user_id: request.user_id, id: request.store_service_id } }
            // );

            const userdata = await Users.findOne({
                attributes: [
                    'id', 'language'
                ], where: { is_deleted: 0, id: request.user_id }
            });

            const storeServDetails = await UsersDetails.findOne({
                attributes: [
                    'en_name'
                ],
                where: { user_id: request.user_id, id: request.store_service_id }
            });

            NotificationModel.prepareNotification({
                sender_id: 0,
                receiver_id: userdata.id,
                action_id: 0,
                lang: userdata.language == 'English' ? 'en' : 'guj',
                title: {
                    keyword: 'rest_create_premium_title',
                    components: {},
                },
                tag: 'admin_notification',
                field: JSON.stringify({ field: storeServDetails.en_name }),
                message: {
                    keyword: 'rest_create_premium_msg',
                    components: { field: storeServDetails.en_name },
                },
                add_notification: 1,
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_add_subscription_buyer_success'), addDetails);

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to edit Subscription Buyer
    * @param {request} request
    * @param {Function} res
    */
    async editSubscriptionBuyer(request, res) {
        try {
            subscriptionBuyer.update(
                {
                    role: request.role,
                    user_id: request.user_id,
                    store_service_id: request.store_service_id,
                    plan_id: request.plan_id,
                    start_date: request.start_date,
                    end_date: request.end_date,
                    is_premium: request.is_premium
                },
                { where: { id: request.subscription_buyer_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_edit_subscription_buyer_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get User ContactUs List
     * @param {request} req
     * @param {Function} res
    */
    async getUserContactUsList(req, res) {
        try {
            const userContactUsList = await UserContactUs.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    [col('userdata.en_full_name'), 'user_name'],
                    [col('userdata.role'), 'role'],
                    'en_name',
                    'guj_name',
                    'email',
                    'phone',
                    'comment',
                    'createdAt'
                ],
                where: {
                    is_pending: 0
                },
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    }
                ]
            });

            if (userContactUsList != undefined && userContactUsList != null && userContactUsList.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userContactUsList);
            } else {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to complete User Contactus
     * @param {request} request
     * @param {Function} res
    */
    async completeUserContactus(request, res) {
        try {
            UserContactUs.update(
                {
                    is_pending: 1,
                },
                { where: { id: request.contact_us_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_user_contact_us_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Faqs By Role
     * @param {request} req
     * @param {Function} res
    */
    async getFaqsByRole(req, res) {
        try {
            const faqList = await FaqModel.findAll({
                attributes: [
                    'id',
                    'role',
                    'question',
                    'answer',
                    'guj_question',
                    'guj_answer',
                    'status',
                    'is_deleted'
                ],
                where: {
                    role: req.role,
                    is_deleted: 0
                },
            });

            if (faqList != undefined && faqList != null && faqList.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), faqList);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to delete faqs
     * @param {request} request
     * @param {Function} res
    */
    async deleteFaqs(request, res) {
        try {
            FaqModel.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.faq_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_delete_faq_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update Faqs Status
     * @param {request} request
     * @param {Function} res
    */
    async updateFaqsStatus(request, res) {
        try {
            FaqModel.update(
                {
                    status: request.status,
                },
                { where: { id: request.faq_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_faq_status_update_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add faqs
     * @param {request} request
     * @param {Function} res
    */
    async addFaqs(request, res) {
        try {

            let params = {
                role: request.role,
                question: request.question,
                answer: request.answer,
                guj_question: request.guj_question,
                guj_answer: request.guj_answer
            };

            const addDetails = await FaqModel.create(params);

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_add_faq_success'), addDetails);

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update faqs
     * @param {request} request
     * @param {Function} res
    */
    async updateFaqs(request, res) {
        try {
            FaqModel.update(
                {
                    question: request.question,
                    answer: request.answer,
                    guj_question: request.guj_question,
                    guj_answer: request.guj_answer
                },
                { where: { id: request.faq_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_update_faq_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get User Feedback List
     * @param {request} req
     * @param {Function} res
    */
    async getUserFeedbackList(req, res) {
        try {
            const userFeedbackList = await Feedback.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    [col('userdata.en_full_name'), 'user_name'],
                    [col('userdata.role'), 'role'],
                    'rating',
                    'app_in_like',
                    'comment',
                    'status',
                    'createdAt',
                    'is_deleted'
                ],
                where: {
                    is_deleted: 0
                },
                include: [
                    {
                        model: Users,
                        as: 'userdata',
                    }
                ]
            });

            if (userFeedbackList != undefined && userFeedbackList != null && userFeedbackList.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userFeedbackList);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to delete user feedback
     * @param {request} request
     * @param {Function} res
    */
    async deleteUserFeedback(request, res) {
        try {
            Feedback.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.feedback_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_delete_feedback_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update user feedback status
     * @param {request} request
     * @param {Function} res
    */
    async updateUserFeedbackStatus(request, res) {
        try {
            Feedback.update(
                {
                    status: request.status,
                },
                { where: { id: request.feedback_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_feedback_status_update_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Feedback Reason
     * @param {request} req
     * @param {Function} res
    */
    async getFeedbackReason(req, res) {
        try {
            const feedbackReasonList = await FeedbackReason.findAll({
                attributes: [
                    'id',
                    'role',
                    'en_name',
                    'guj_name',
                    'status',
                    'createdAt',
                    'is_deleted'
                ],
                where: {
                    is_deleted: 0
                }
            });

            if (feedbackReasonList != undefined && feedbackReasonList != null && feedbackReasonList.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), feedbackReasonList);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to update Feedback Reason Status
     * @param {request} request
     * @param {Function} res
    */
    async updateFeedbackReasonStatus(request, res) {
        try {
            FeedbackReason.update(
                {
                    status: request.status,
                },
                { where: { id: request.reason_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_feedback_reason_status_update_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete feedback reason
     * @param {request} request
     * @param {Function} res
    */
    async deleteFeedbackReason(request, res) {
        try {
            FeedbackReason.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.reason_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_delete_feedback_reason_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add feedback reason
     * @param {request} request
     * @param {Function} res
    */
    async addFeedbackReason(request, res) {
        try {
            const reasonData = request.data.map(data => ({
                role: data.role,
                en_name: data.en_name,
                guj_name: data.guj_name,
            }));

            await FeedbackReason.bulkCreate(reasonData);

            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                t('rest_add_feedback_reason_success'),
                null
            );
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update feedback reason
     * @param {request} request
     * @param {Function} res
    */
    async updateFeedbackReason(request, res) {
        try {
            FeedbackReason.update(
                {
                    en_name: request.en_name,
                    guj_name: request.guj_name
                },
                { where: { id: request.reason_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_update_feedback_reason_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get Sponsorship Details
     * @param {request} req
     * @param {Function} res
    */
    async getSponsorshipDetails(req, res) {
        try {
            const sponsorshipDetails = await Sponsorship.findAll({
                attributes: [
                    'id',
                    'data',
                    'guj_data',
                    'status',
                    'is_deleted'
                ],
                where: {
                    status: 1,
                    is_deleted: 0
                }
            });

            if (sponsorshipDetails != undefined && sponsorshipDetails != null && sponsorshipDetails.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), sponsorshipDetails[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.INTERNAL_ERROR, error.message, null);
        }
    },

    /**
     * Function to update Sponsorship Details
     * @param {request} request
     * @param {Function} res
    */
    async updateSponsorshipDetails(request, res) {
        try {
            Sponsorship.update(
                {
                    data: request.data,
                    guj_data: request.guj_data
                },
                { where: { id: request.sponsorship_id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_update_sponsorship_details_success'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
    * Function to get app version list
    * @param {request} request
    * @param {Function} res
    */
    async getAppVersionsList(request, res) {
        try {
            const whereConditions = { is_deleted: 0 };

            const list = await appVersion.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'androidapp_version',
                    'iosapp_version',
                    'type',
                    'guj_message',
                    'en_message',
                    'status',
                    'is_deleted',
                    'createdAt'
                ],
                where: whereConditions
            });
            if (list != undefined && list != null && list.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_app_version_list_found_success'), list);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add app version
     * @param {request} request
     * @param {Function} res
     */
    async addAppVersion(request, res) {
        console.log('request: ', request);
        try {
            let versionParams = {
                type: request.type,
                androidapp_version: request.androidapp_version,
                iosapp_version: request.iosapp_version,
                en_message: request.en_message,
                guj_message: request.guj_message
            };
            // const addAppVersions = await appVersion.create(versionParams);
            const existingVersion = await appVersion.findOne({
                where: {
                    is_deleted: 0
                },
            });

            if (existingVersion) {
                const data = await appVersion.update(versionParams, { where: { id: existingVersion.id } });
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('App Version updated successfully'), existingVersion);
            } else {
                const addAppVersions = await appVersion.create(versionParams);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('App Version added successfully'), addAppVersions);
            };
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update app version status
     * @param {request} req
     * @param {Function} res
     */
    udpateAppVersionStatus: async function (request, res) {
        var param = {
            status: request.status,
        };
        appVersion.update(param, { where: { id: request.id } })
            .then(function () {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('App Version status updated successfully'), null);
            })
            .catch(function (err) {
                return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
            });
    },

    /**
     * Function to delete app version
     * @param {request} request
     * @param {Function} res
    */
    async deleteAppVersions(request, res) {
        try {
            appVersion.update(
                {
                    is_deleted: 1,
                },
                { where: { id: request.id } }
            )
                .then(function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('App Version has been deleted successfully'),
                        null
                    );
                })
                .catch(function (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

};
export default adminModel;
