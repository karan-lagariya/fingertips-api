import localizify from 'localizify';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import SequelizePakcage, { where } from 'sequelize';
import asyncLoop from 'node-async-loop';
import AWS from 'aws-sdk';
import CODES from '../../../../app-config/status_code.js';
import GLOBALS from '../../../../app-config/constants.js';
import NotificationModel from '../../../../app-config/notification.js';
import common from '../../../../app-config/common.js';
import middleware from '../../../../middleware/headerValidator.js';
import User from '../../../../models/users.js';
import Userdevice from '../../../../models/userdevice.js';
import UserDetails from '../../../../models/usersdetails.js';
import forgotPasswordTemplate from '../../../../email-templates/forgotPassword.js';
import sendOtpTemplate from '../../../../email-templates/sendOtp.js';
import signupTemplate from '../../../../email-templates/signup.js';
import staticPages from '../../../../models/static_page.js';
import MarketPlace from '../../../../models/market_place.js';
import StoreCategory from '../../../../models/store_category.js';
import ProductCategory from '../../../../models/category.js';
import ProductSubCategory from '../../../../models/subcategory.js';
import Product from '../../../../models/product.js';
import Follow from '../../../../models/follow.js';
import Review from '../../../../models/review.js';
import SaveProduct from '../../../../models/save_products.js';
import ProductImages from '../../../../models/productimages.js';
import Notification from '../../../../models/notification.js';
import SubscriptionPlans from '../../../../models/subscription_plan.js';
import ProductLikes from '../../../../models/product_like.js';
import AdManagers from '../../../../models/ad_managers.js';
import AddManagerImages from '../../../../models/ad_manager_images.js';
import AdSocialMedias from '../../../../models/ad_social_medias.js';
import Feedbacks from '../../../../models/feedbacks.js';
import FeedbackReasons from '../../../../models/feedback_reasons.js';
import UserContactUs from '../../../../models/user_contactus.js';
import ContactDetails from '../../../../models/contactdetails.js';
import PlanBuyDetails from '../../../../models/buy_plans.js';
import SocialLinks from '../../../../models/socialLinks.js';
import AppVersions from '../../../../models/app_versions.js';
import OTP from '../../../../models/otp.js';
import Category from '../../../../models/category.js';
import subCategory from '../../../../models/subcategory.js';

const { default: local } = localizify;
const { t } = localizify;
const Op = SequelizePakcage.Op;
const fn = SequelizePakcage.fn;
const col = SequelizePakcage.col;

const authModel = {
    /**
     * Function to signup for user
     * @param {request} request
     * @param {Function} res
     */
    async signup(request, res) {
        try {
            const checkEmailUnique = await common.checkUniqueEmail(request);
            if (checkEmailUnique) {
                const checkPhoneUnique = await common.checkPhoneUnique(request);

                if (checkPhoneUnique) {
                    if (request.role == '0') {
                        var userParams = {
                            language: request.language,
                            en_full_name: request.en_full_name,
                            guj_full_name: request.guj_full_name,
                            email: request.email,
                            country_code: request.country_code,
                            phone_no: request.phone_no,
                            password: middleware.encData(request.password),
                            role: 0,
                        };

                        const userData = await User.create(userParams);
                        const token = await common.generateRandomToken(64);

                        const deviceParams = {
                            user_id: userData.id,
                            token: token,
                            device_type: request.device_type,
                            device_token: request.device_token,
                            uuid: request.uuid,
                            os_version: request.os_version,
                            device_model: request.device_model,
                            app_version: request.app_version,
                        };

                        const userDeviceDetails = await Userdevice.create(deviceParams);
                        userData.setDataValue('language', request.language);
                        userData.setDataValue('token', userDeviceDetails.token);
                        userData.setDataValue('device_type', userDeviceDetails.device_type);
                        userData.setDataValue('device_token', userDeviceDetails.device_token);
                        userData.setDataValue('uuid', userDeviceDetails.uuid);
                        userData.setDataValue('os_version', userDeviceDetails.os_version);
                        userData.setDataValue('device_model', userDeviceDetails.device_model);
                        userData.setDataValue('app_version', userDeviceDetails.app_version);

                        NotificationModel.prepareNotification({
                            sender_id: userData.id,
                            receiver_id: userData.id,
                            action_id: userData.id,
                            lang: (request.language != undefined) ? request.language : GLOBALS.APP_LANGUAGE,
                            title: {
                                keyword: 'rest_new_account_title',
                                components: {},
                            },
                            tag: 'new_account',
                            message: {
                                keyword: 'rest_new_account_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });

                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_signup_success'), userData);
                    } else if (request.role == '1') {
                        var userParams = {
                            language: request.language,
                            en_full_name: request.en_full_name,
                            guj_full_name: request.guj_full_name,
                            email: request.email,
                            country_code: request.country_code,
                            phone_no: request.phone_no,
                            dob: request.dob,
                            password: middleware.encData(request.password),
                            role: 1,
                            profile_image: request.profile_image,
                        };

                        const userData = await User.create(userParams);
                        const subscription = await authModel.getNewPlan(request);

                        const bytesConvert = subscription.storage_type == 0 ? subscription.storage * 1000 : subscription.storage_type == 1 ? subscription.storage * 1000000 : subscription.storage * 1000000;
                        var userDeatilsParams = {
                            user_id: userData.id,
                            market_place_id: request.market_place_id,
                            category_id: request.category_id,
                            type: 'store',
                            en_name: request.en_store_name,
                            guj_name: request.guj_store_name,
                            image: request.image,
                            whatsapp_number: request.whatsapp_number,
                            ...(request.gstno != undefined && request.gstno != '' && { gstno: request.gstno }),
                            address_line_1: request.address_line_1,
                            address_line_2: request.address_line_2,
                            state: request.state,
                            city: request.city,
                            latitude: request.latitude,
                            longitude: request.longitude,
                            pincode: request.pincode,
                            storage_limit: bytesConvert,
                            landmark: request.landmark != undefined && request.landmark != '' ? request.landmark : null,
                        };

                        const userDetailsData = await UserDetails.create(userDeatilsParams);
                        var subscriptionParams = {
                            role: 1,
                            user_id: userData.id,
                            store_service_id: userDetailsData.id,
                            plan_id: subscription.id,
                            start_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                            end_date: moment().utc().add(6, 'months').format('YYYY-MM-DD HH:mm:ss'),
                            is_premium: 0,
                            plan_details: JSON.stringify(subscription),

                        };
                        await PlanBuyDetails.create(subscriptionParams);
                        const token = await common.generateRandomToken(64);

                        const deviceParams = {
                            user_id: userData.id,
                            token: token,
                            device_type: request.device_type,
                            device_token: request.device_token,
                            uuid: request.uuid,
                            os_version: request.os_version,
                            device_model: request.device_model,
                            app_version: request.app_version,
                        };

                        const userDeviceDetails = await Userdevice.create(deviceParams);
                        userData.setDataValue('language', request.language);
                        userData.setDataValue('token', userDeviceDetails.token);
                        userData.setDataValue('device_type', userDeviceDetails.device_type);
                        userData.setDataValue('device_token', userDeviceDetails.device_token);
                        userData.setDataValue('uuid', userDeviceDetails.uuid);
                        userData.setDataValue('os_version', userDeviceDetails.os_version);
                        userData.setDataValue('device_model', userDeviceDetails.device_model);
                        userData.setDataValue('app_version', userDeviceDetails.app_version);
                        NotificationModel.prepareNotification({
                            sender_id: userData.id,
                            receiver_id: userData.id,
                            action_id: userData.id,
                            lang: (request.language != undefined) ? request.language : GLOBALS.APP_LANGUAGE,
                            title: {
                                keyword: 'rest_new_account_title',
                                components: {},
                            },
                            tag: 'new_account',
                            message: {
                                keyword: 'rest_new_account_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_signup_success'), userData);
                    } else {
                        var userParams = {
                            language: request.language,
                            en_full_name: request.en_full_name,
                            guj_full_name: request.guj_full_name,
                            email: request.email,
                            country_code: request.country_code,
                            phone_no: request.phone_no,
                            dob: request.dob,
                            password: middleware.encData(request.password),
                            role: 2,
                            profile_image: request.profile_image,
                        };

                        const userData = await User.create(userParams);
                        const subscription = await authModel.getNewPlanServiceProvider(request);
                        //console.log('subscription', subscription)
                        const bytesConvert = subscription.storage_type == 0 ? subscription.storage * 1000 : subscription.storage_type == 1 ? subscription.storage * 1000000 : subscription.storage * 1000000;
                        var userDeatilsParams = {
                            user_id: userData.id,
                            en_name: request.en_name,
                            guj_name: request.guj_name,
                            market_place_id: request.market_place_id,
                            category_id: request.category_id,
                            type: 'service',
                            whatsapp_number: request.whatsapp_number,
                            en_work_details: request.en_work_details,
                            guj_work_details: request.guj_work_details,
                            address_line_1: request.address_line_1,
                            address_line_2: request.address_line_2,
                            latitude: request.latitude,
                            longitude: request.longitude,
                            state: request.state,
                            city: request.city,
                            pincode: request.pincode,
                            landmark: request.landmark,
                            profile_image: request.service_profile_image,
                            image: request.work_image.toString(),
                            storage_limit: bytesConvert,
                            latitude: request.latitude != undefined && request.latitude != '' ? request.latitude : null,
                            longitude:
                                request.longitude != undefined && request.longitude != '' ? request.longitude : null,
                        };

                        const userDetailsData = await UserDetails.create(userDeatilsParams);
                        var subscriptionParams = {
                            role: 2,
                            user_id: userData.id,
                            store_service_id: userDetailsData.id,
                            plan_id: subscription.id,
                            start_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                            end_date: moment().utc().add(6, 'months').format('YYYY-MM-DD HH:mm:ss'),
                            is_premium: 0,
                            plan_details: JSON.stringify(subscription),

                        };
                        await PlanBuyDetails.create(subscriptionParams);
                        const token = await common.generateRandomToken(64);

                        const deviceParams = {
                            user_id: userData.id,
                            token: token,
                            device_type: request.device_type,
                            device_token: request.device_token,
                            uuid: request.uuid,
                            os_version: request.os_version,
                            device_model: request.device_model,
                            app_version: request.app_version,
                        };

                        const userDeviceDetails = await Userdevice.create(deviceParams);

                        userData.setDataValue('language', request.language);
                        userData.setDataValue('token', userDeviceDetails.token);
                        userData.setDataValue('device_type', userDeviceDetails.device_type);
                        userData.setDataValue('device_token', userDeviceDetails.device_token);
                        userData.setDataValue('uuid', userDeviceDetails.uuid);
                        userData.setDataValue('os_version', userDeviceDetails.os_version);
                        userData.setDataValue('device_model', userDeviceDetails.device_model);
                        userData.setDataValue('app_version', userDeviceDetails.app_version);
                        NotificationModel.prepareNotification({
                            sender_id: userData.id,
                            receiver_id: userData.id,
                            action_id: userData.id,
                            lang: (request.language != undefined) ? request.language : GLOBALS.APP_LANGUAGE,
                            title: {
                                keyword: 'rest_new_account_title',
                                components: {},
                            },
                            tag: 'new_account',
                            message: {
                                keyword: 'rest_new_account_msg',
                                components: {},
                            },
                            add_notification: 1,
                        });
                        console.log("success");
                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_signup_success'), userData);
                    }
                } else {
                    console.log("duplicate phone");
                    return middleware.sendApiResponse(
                        res,
                        CODES.DUPLICATE_VALUE,
                        t('rest_keywords_duplicate_phonenumber'),
                        null
                    );
                }
            } else {
                console.log("duplicate email");
                return middleware.sendApiResponse(res, CODES.DUPLICATE_VALUE, t('rest_keywords_duplicate_email'), null);
            }
        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get free plan 
     * @param {request} req
     * @param {Function} res
     */
    async getNewPlan(req, res) {
        try {
            const planBuyDetails = await SubscriptionPlans.findAll({
                attributes: [
                    'id',
                    'title',
                    'guj_title',
                    'no_images',
                    'storage',
                    'storage_type',
                    'type',
                    'benefit',
                    'guj_benefit',
                    'guj_payment',
                    'payment_procedure',
                    'monthly_price',
                    'yearly_price',
                    'is_free',
                    'status',

                ],
                where: {
                    is_free: 1,
                    status: 1,
                    type: 1,
                    is_deleted: 0,
                },
            });

            if (planBuyDetails.length > 0) {
                return planBuyDetails[0]

            } else {
                return null
            }
        } catch (error) {
            return null
        }
    },

    /**
     * Function to get free plan 
     * @param {request} req
     * @param {Function} res
     */
    async getNewPlanServiceProvider(req, res) {
        try {
            const planBuyDetails = await SubscriptionPlans.findAll({
                attributes: [
                    'id',
                    'title',
                    'guj_title',
                    'no_images',
                    'storage',
                    'storage_type',
                    'type',
                    'benefit',
                    'guj_benefit',
                    'guj_payment',
                    'payment_procedure',
                    'monthly_price',
                    'yearly_price',
                    'is_free',
                    'status',

                ],
                where: {
                    is_free: 1,
                    status: 1,
                    type: 2,
                    is_deleted: 0,
                },
            });

            if (planBuyDetails.length > 0) {
                return planBuyDetails[0]

            } else {
                return null
            }
        } catch (error) {
            return null
        }
    },
    /**
     * Function to login for user
     * @param {request} request
     * @param {Function} res
     */
    async login(request, res) {
        try {
            let getUserData;
            if (request.email != undefined && request.email != '') {
                getUserData = await common.getUserDataByEmailId(request);
            } else {
                getUserData = await common.getUserDataByPhoneNumber(request.country_code, request.phone_no, request.role);
            }
            //console.log('getUserData', getUserData)
            if (getUserData != null) {
                let whereCondition;
                if (request.email != undefined && request.email != '') {
                    whereCondition = { email: request.email, password: middleware.encData(request.password), role: request.role };
                } else {
                    whereCondition = {
                        country_code: request.country_code,
                        phone_no: request.phone_no,
                        role: request.role,
                        password: middleware.encData(request.password),
                    };
                }
                //console.log('request.password',request.password)
                //console.log('whereCondition',whereCondition)
                const userData = await User.findOne({
                    attributes: ['id', 'language', 'email'],
                    where: whereCondition,
                });

                if (userData != null) {
                    const token = await common.generateRandomToken(64);

                    const deviceInformation = await Userdevice.findOne({ where: { user_id: getUserData.id } });

                    const deviceValues = {
                        token: token,
                        user_id: userData.id,
                        device_type: request.device_type,
                        device_token: request.device_token,
                        uuid: request.uuid,
                        os_version: request.os_version,
                        device_model: request.device_model,
                        app_version: request.app_version,
                    };

                    if (deviceInformation) {
                        deviceInformation.update(deviceValues, { where: { user_id: getUserData.id } });
                    } else {
                        Userdevice.create(deviceValues);
                    }

                    const updateUserData = {
                        last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        login_status: 'Online',
                        language: request.language,
                    };

                    await User.update(updateUserData, { where: { id: getUserData.id } });
                    getUserData.setDataValue('language', userData.language);
                    getUserData.setDataValue('token', deviceInformation.token);
                    getUserData.setDataValue('device_type', deviceInformation.device_type);
                    getUserData.setDataValue('device_token', deviceInformation.device_token);
                    getUserData.setDataValue('uuid', deviceInformation.uuid);
                    getUserData.setDataValue('os_version', deviceInformation.os_version);
                    getUserData.setDataValue('device_model', deviceInformation.device_model);
                    getUserData.setDataValue('app_version', deviceInformation.app_version);

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_user_login_success'),
                        getUserData
                    );
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_invalid_logindetails'), null);
                }

                // } else {
                //     return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_unverified_emailnumber'), null);
                // }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_user_doesnot_exist'), null);
            }
        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to logout user (patient/doctor/chemist)
     * @param {request} req
     * @param {Function} res
     */
    async logout(req, res) {
        try {
            User.update(
                {
                    login_status: 'Offline',
                    last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                },
                { where: { id: req.user_id } }
            );

            Userdevice.update({ token: null, device_token: null }, { where: { user_id: req.user_id } });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_userlogout_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete user
     * @param {request} req
     * @param {Function} res
     */
    async deleteAccount(req, res) {
        try {
            const storeServiceDetails = await UserDetails.findAll({
                attributes: ['id'],
                where: { user_id: req.user_id, status: 1, is_deleted: 0 },
            });

            if (storeServiceDetails.length > 0) {
                User.update(
                    {
                        is_deleted: '1',
                        login_status: 'Offline',
                        last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                    },
                    { where: { id: req.user_id } }
                );

                UserDetails.update({ is_deleted: '1' }, { where: { user_id: req.user_id } });

                Userdevice.update({ token: null, device_token: null }, { where: { user_id: req.user_id } });


                Product.update({ id_deleted: 1 }, { where: { user_id: req.user_id } })

                const prods = Product.findAll({
                    where: {
                        user_id: req.user_id
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
                    });
                };

                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_user_delete_success'), null);
            } else {
                User.update(
                    {
                        is_deleted: '1',
                        login_status: 'Offline',
                        last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                    },
                    { where: { id: req.user_id } }
                );

                Userdevice.update({ token: null, device_token: null }, { where: { user_id: req.user_id } });
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_user_delete_success'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to enable disable notification
     * @param {request} req
     * @param {Function} res
     */
    async enableDisableNotification(req, res) {
        try {
            User.update({ is_notification: req.is_notification }, { where: { id: req.user_id } });

            if (req.is_notification == 1) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_user_notification_enable'),
                    null
                );
            } else {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_user_notification_disable'),
                    null
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to send otp
     * @param {request} req
     * @param {Function} res
     */
    async sendOtp(req, res) {
        try {
            const userData = await User.findAll({
                attributes: ['id'],
                where: { email: req.email },
            });

            if (userData.length > 0) {
                const otpDetails = await OTP.findAll({
                    attributes: ['id'],
                    where: { functionality: req.functionality, email: req.email },
                });

                //const otpNumber = '1234';
                const otpNumber = Math.floor(1000 + Math.random() * 9000)

                if (otpDetails != undefined && otpDetails != null && otpDetails.length > 0) {
                    const updateOtp = await OTP.update({ otp: otpNumber }, { where: { id: otpDetails[0].id } });

                    const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                    const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, req.email, sendOtpTemplateLet)
                        .then(async (mailSent) => {
                            //console.log('mailSent=>', mailSent)
                            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);

                        });
                } else {
                    const otpParams = {
                        functionality: req.functionality,
                        email: req.email,
                        otp: otpNumber,
                    };


                    const addOtp = await OTP.create(otpParams);

                    const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                    const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, req.email, sendOtpTemplateLet)
                        .then(async (mailSent) => {
                            //console.log('mailSent=>', mailSent)
                            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);

                        });
                }
            } else {
                if (req.functionality == 'signUp') {
                    const otpDetails = await OTP.findAll({
                        attributes: ['id'],
                        where: { functionality: req.functionality, email: req.email },
                    });

                    //const otpNumber = '1234';
                    const otpNumber = Math.floor(1000 + Math.random() * 9000)

                    if (otpDetails != undefined && otpDetails != null && otpDetails.length > 0) {
                        const updateOtp = await OTP.update({ otp: otpNumber }, { where: { id: otpDetails[0].id } });

                        const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                        const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, req.email, sendOtpTemplateLet)
                            .then(async (mailSent) => {
                                //console.log('mailSent=>', mailSent)
                                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);

                            });
                    } else {
                        const otpParams = {
                            functionality: req.functionality,
                            email: req.email,
                            otp: otpNumber,
                        };
                        const addOtp = await OTP.create(otpParams);
                        const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                        const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, req.email, sendOtpTemplateLet)
                            .then(async (mailSent) => {
                                //console.log('mailSent=>', mailSent)
                                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);

                            });
                    }
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_email_not_found'), null);
                }


            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to verify otp
     * @param {request} req
     * @param {Function} res
     */
    async verifyOtp(req, res) {
        try {
            const otpDetails = await OTP.findAll({
                attributes: ['id'],
                where: { functionality: req.functionality, email: req.email, otp: req.otp },
            });

            if (otpDetails.length > 0) {
                var otpRemoveData = await OTP.destroy({
                    where: {
                        id: otpDetails[0].id,
                    },
                });

                if (otpRemoveData != 0) {
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_verify_otp_success'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_verify_otp_fail'), null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_verify_otp_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to set new password
     * @param {request} req
     * @param {Function} res
     */
    async newPassword(req, res) {
        try {
            const userData = await User.findAll({
                attributes: ['id'],
                where: { email: req.email },
            });

            if (userData.length > 0) {
                const updateOtp = await User.update(
                    { password: middleware.encData(req.password) },
                    { where: { id: userData[0].id } }
                );

                if (updateOtp[0] != 0) {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_change_password_success'),
                        null
                    );
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_change_password_fail'), null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_email_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to change password
     * @param {request} req
     * @param {Function} res
     */
    async changePassword(req, res) {
        try {
            const userData = await User.findAll({
                attributes: ['id', 'password'],
                where: { id: req.user_id },
            });

            if (userData != undefined && userData != null && userData.length > 0) {
                try {
                    const checkPassword = userData[0].password;

                    const encOldPassword = middleware.encData(req.old_password);
                    const encNewPassword = middleware.encData(req.new_password);

                    if (encOldPassword == checkPassword) {
                        if (encOldPassword != encNewPassword) {
                            await User.update({ password: encNewPassword }, { where: { id: req.user_id } });
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
                    return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user profile data
     * @param {request} req
     * @param {Function} res
     */
    async getProfile(req, res) {
        try {
            const userData = await User.findAll({
                attributes: [
                    'id',
                    'language',
                    'role',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    'is_notification',
                    'dob',
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('profile_image')),
                        'profile_image',
                    ],
                ],
                where: { id: req.user_id, status: 1, is_deleted: 0 },
            });

            if (userData.length > 0) {
                const notificationData = await Notification.findAll({
                    order: [['id', 'DESC']],
                    attributes: ['id', 'sender_id', 'receiver_id', 'field', 'field_title', 'tag', 'action_id', 'title', 'message', 'is_read', 'createdAt'],
                    where: {
                        receiver_id: req.user_id,
                        status: 1,
                        is_deleted: 0,
                        is_read: 0
                    },
                });
                userData[0].setDataValue('is_read_notification', (notificationData.length > 0) ? 1 : 0);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get market place
     * @param {request} req
     * @param {Function} res
     */
    async getMarketPlace(req, res) {
        try {
            const marketPlaceData = await MarketPlace.findAll({
                attributes: ['id', 'name', 'guj_name'],
                where: { status: 1, is_deleted: 0 },
            });

            if (marketPlaceData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_market_place_success'), marketPlaceData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_market_place_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update profile
     * @param {request} request
     * @param {Function} res
     */
    async updateProfile(req, res) {
        try {
            const userData = await User.findAll({
                attributes: ['id'],
                where: { id: req.user_id },
            });

            if (userData != undefined && userData != null && userData.length > 0) {
                try {
                    const updateData = {
                        en_full_name: req.en_full_name,
                        guj_full_name: req.guj_full_name,
                        email: req.email,
                        country_code: req.country_code,
                        phone_no: req.phone_no,
                        profile_image: req.profile_image,
                        language: req.language,
                    };

                    await User.update(updateData, { where: { id: req.user_id } });

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_profile_update_success'),
                        null
                    );
                } catch (error) {
                    return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get store category
     * @param {request} req
     * @param {Function} res
     */
    async getStoreCategory(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search is provided
            if (req.search != null && req.search !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            en_name: {
                                [Op.like]: `%${req.search}%`,
                            },
                        },
                        {
                            guj_name: {
                                [Op.like]: `%${req.search}%`,
                            },
                        },
                    ],
                };
            }

            const storeCategoryData = await StoreCategory.findAll({
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    [SequelizePakcage.fn('CONCAT', GLOBALS.CDN_S3_URL, "/", SequelizePakcage.col('image')), 'image'],
                ],
                where: {
                    role: req.role,
                    status: 1,
                    is_deleted: 0,
                    ...whereLikeConditions,

                },
            });

            if (storeCategoryData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_store_category_success'),
                    storeCategoryData
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_store_category_fail'), null);
            }
        } catch (error) {
            console.log(error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get product category
     * @param {request} req
     * @param {Function} res
     */
    async getProductCategory(req, res) {
        try {
            const productCategoryData = await ProductCategory.findAll({
                attributes: ['id', 'store_category_id', 'en_name', 'guj_name', 'role'],
                where: {
                    ...(req.store_category_id != null && req.store_category_id != '') && { store_category_id: req.store_category_id },
                    role: req.role, status: 1, is_deleted: 0
                },
            });

            if (productCategoryData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_product_category_success'),
                    productCategoryData
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_product_category_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get product sub category
     * @param {request} req
     * @param {Function} res
     */
    async getProductSubCategory(req, res) {
        try {
            const productSubCategoryData = await ProductSubCategory.findAll({
                attributes: ['id', 'store_category_id', 'category_id', 'en_name', 'guj_name'],
                where: {
                    ...(req.store_category_id != null && req.store_category_id != '' && { store_category_id: req.store_category_id }),
                    category_id: req.category_id,
                    status: 1,
                    is_deleted: 0,
                },
            });

            if (productSubCategoryData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_product_sub_category_success'),
                    productSubCategoryData
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_product_sub_category_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add product
     * @param {request} req
     * @param {Function} res
     */
    async addProduct(req, res) {
        try {
            const storeData = await UserDetails.findAll({
                attributes: ['id', 'market_place_id', 'used_space', 'storage_limit', 'is_approved'],
                where: { id: req.store_id, status: 1, is_deleted: 0 },
            });
            if (storeData.length > 0) {
                if (storeData[0].is_approved == 1) {
                    let productParams = {
                        user_id: req.user_id,
                        name: req.name,
                        category_id: req.category_id,
                        subcategory_id: req.subcategory_id,
                        store_id: req.store_id,
                        price: req.price,
                        ...(req.product_code != undefined && req.product_code != '' && { product_code: req.product_code }),
                        ...(req.discount != undefined && req.discount != '' && { discount: req.discount }),
                        ...(req.discount_type != undefined && req.discount_type != '' && { discount_type: req.discount_type }),
                        ...(req.brand != undefined && req.brand != '' && { brand: req.brand }),
                        ...(req.gender != undefined && req.gender != '' && { gender: req.gender }),
                        ...(req.color != undefined && req.color != '' && { color: req.color }),
                        ...(req.size != undefined && req.size != '' && { size: req.size }),
                        ...(req.shape != undefined && req.shape != '' && { shape: req.shape }),
                        ...(req.material != undefined && req.material != '' && { material: req.material }),
                        ...(req.pattern != undefined && req.pattern != '' && { pattern: req.pattern }),
                        ...(req.design != undefined && req.design != '' && { design: req.design }),
                        ...(req.type != undefined && req.type != '' && { type: req.type }),
                        ...(req.sustainable != undefined && req.sustainable != '' && { sustainable: req.sustainable }),
                        ...(req.warranty != undefined && req.warranty != '' && { warranty: req.warranty }),
                        ...(req.guarantee != undefined && req.guarantee != '' && { guarantee: req.guarantee }),
                        ...(req.quantity != undefined && req.quantity != '' && { quantity: req.quantity }),
                        ...(req.quality != undefined && req.quality != '' && { quality: req.quality }),
                        ...(req.service != undefined && req.service != '' && { service: req.service }),
                        ...(req.replacement != undefined && req.replacement != '' && { replacement: req.replacement }),
                        ...(req.resale != undefined && req.resale != '' && { resale: req.resale }),
                        ...(req.details != undefined && req.details != '' && { details: req.details }),
                    };

                    const productData = await Product.create(productParams);
                    const imagesData = req.images.map(data => ({
                        image: data.image,
                        product_id: productData.id,
                    }));

                    await ProductImages.bulkCreate(imagesData);
                    UserDetails.update({ used_space: req.used_space }, { where: { id: req.store_id } });
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_add_product_success'), productData);
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_store_not_approve'), null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_store_inactive'), null);
            }

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_add_product_fail'), null);
        }
    },

    /**
     * Function to delete product
     * @param {request} req
     * @param {Function} res
     */
    async deleteProduct(req, res) {
        try {
            Product.update({ is_deleted: '1' }, { where: { id: req.product_id } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_delete_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_product_delete_fail'), null);
        }
    },

    /**
     * Function to get product details
     * @param {request} req
     * @param {Function} res
     */
    async getProductDetails(req, res) {
        try {
            const productData = await Product.findAll({
                attributes: [
                    'id',
                    'name',
                    'product_code',
                    'view_count',
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
                    'total_like',
                    'status',
                    'avg_rating',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                ],
                where: {
                    id: req.product_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    },
                ],
            });

            if (productData.length > 0) {
                await Product.update(
                    { view_count: productData[0].view_count + 1 },
                    {
                        where: {
                            id: req.product_id,
                            user_id: { [Op.ne]: req.user_id }
                        }
                    }
                );
                const imagesData = await ProductImages.findAll({
                    attributes: [
                        'id',
                        [SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')), 'image'],
                    ],
                    where: { product_id: req.product_id, is_deleted: 0 },
                });

                productData[0].setDataValue('images', imagesData);

                const followerData = await Follow.findAll({
                    attributes: ['id'],
                    where: { follower_id: productData[0].store_id, status: 1, is_deleted: 0 },
                });

                productData[0].setDataValue('total_followers', followerData.length);

                const storeData = await UserDetails.findAll({
                    attributes: ['id', 'market_place_id', ['en_name', 'en_store_name'], ['guj_name', 'guj_store_name']],
                    where: { id: productData[0].store_id, status: 1 },
                });
                const userData = await User.findAll({
                    attributes: [
                        'id',
                        'language',
                        'role',
                        'en_full_name',
                        'guj_full_name',
                        'email',
                        'country_code',
                        'phone_no',
                        'is_notification',
                        'dob',
                        [
                            SequelizePakcage.fn(
                                'CONCAT',
                                GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS,
                                SequelizePakcage.col('profile_image')
                            ),
                            'profile_image',
                        ],
                    ],
                    where: { id: productData[0].user_id, status: 1, is_deleted: 0 },
                });

                //console.log('storeData', storeData[0])
                productData[0].setDataValue('store_data', storeData[0]);
                productData[0].setDataValue('userdata', userData[0]);
                const marketPlaceData = await MarketPlace.findAll({
                    attributes: ['id', 'name', 'guj_name'],
                    where: { id: storeData[0].market_place_id, status: 1, is_deleted: 0 },
                });
                productData[0].setDataValue('market_place_name', marketPlaceData[0].name);
                productData[0].setDataValue('guj_market_place_name', marketPlaceData[0].guj_name);

                const likeData = await ProductLikes.findAll({
                    attributes: ['id'],
                    where: { user_id: req.user_id, product_id: req.product_id, status: 1, is_deleted: 0 },
                });

                productData[0].setDataValue('is_liked', likeData.length > 0 ? 1 : 0);

                const followData = await Follow.findAll({
                    attributes: ['id'],
                    where: { user_id: req.user_id, follower_id: productData[0].store_id, status: 1, is_deleted: 0 },
                });

                productData[0].setDataValue('follow_status', followData.length > 0 ? 1 : 0);

                const saveProductData = await SaveProduct.findAll({
                    attributes: ['id'],
                    where: { user_id: req.user_id, product_id: req.product_id, status: 1, is_deleted: 0 },
                });

                productData[0].setDataValue('is_saved', saveProductData.length > 0 ? 1 : 0);

                const poorRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.product_id,
                        role: 1,
                        rating: 1,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                const belowAverageRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.product_id,
                        role: 1,
                        rating: 2,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                const averageRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.product_id,
                        role: 1,
                        rating: 3,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                const goodRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.product_id,
                        role: 1,
                        rating: 4,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                const excellentRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.product_id,
                        role: 1,
                        rating: 5,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                const reviewlist = await Review.findAll({
                    attributes: [
                        'id',
                        'rating',
                        'review',
                        'createdAt',
                        [col('userdata.en_full_name'), 'en_user_name'],
                        [col('userdata.guj_full_name'), 'guj_user_name'],
                        [
                            SequelizePakcage.fn(
                                'CONCAT',
                                SequelizePakcage.literal(`'${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS}'`),
                                SequelizePakcage.col('userdata.profile_image')
                            ),
                            'profile_image',
                        ],
                    ],
                    where: {
                        product_id: req.product_id,
                        status: 1,
                        role: 1,
                        is_deleted: 0,
                    },
                    include: [
                        {
                            model: User,
                            as: 'userdata',
                        },
                    ],
                });
                productData[0].setDataValue('poor_rating', poorRating.length);
                productData[0].setDataValue('below_average_rating', belowAverageRating.length);
                productData[0].setDataValue('average_rating', averageRating.length);
                productData[0].setDataValue('good_rating', goodRating.length);
                productData[0].setDataValue('excellent_rating', excellentRating.length);
                productData[0].setDataValue('review_count', reviewlist.length);
                productData[0].setDataValue('view_count', productData[0].view_count + 1);
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_product_details_success'),
                    productData[0]
                );
                console.log('productData', productData[0])
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_product_details_fail'), null);
            }
        } catch (error) {
            console.log('error', error)
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_product_details_fail'), null);
        }
    },

    /**
     * Function to update product
     * @param {request} req
     * @param {Function} res
     */
    async updateProduct(req, res) {
        try {
            let productParams = {
                user_id: req.user_id,
                name: req.name,
                category_id: req.category_id,
                subcategory_id: req.subcategory_id,
                store_id: req.store_id,
                price: req.price,
                ...(req.product_code != undefined && req.product_code != '' && { product_code: req.product_code }),
                ...(req.discount != undefined && req.discount != '' && { discount: req.discount }),
                ...(req.discount_type != undefined && req.discount_type != '' && { discount_type: req.discount_type }),
                ...(req.brand != undefined && req.brand != '' && { brand: req.brand }),
                ...(req.gender != undefined && req.gender != '' && { gender: req.gender }),
                ...(req.color != undefined && req.color != '' && { color: req.color }),
                ...(req.size != undefined && req.size != '' && { size: req.size }),
                ...(req.shape != undefined && req.shape != '' && { shape: req.shape }),
                ...(req.material != undefined && req.material != '' && { material: req.material }),
                ...(req.pattern != undefined && req.pattern != '' && { pattern: req.pattern }),
                ...(req.design != undefined && req.design != '' && { design: req.design }),
                ...(req.type != undefined && req.type != '' && { type: req.type }),
                ...(req.sustainable != undefined && req.sustainable != '' && { sustainable: req.sustainable }),
                ...(req.warranty != undefined && req.warranty != '' && { warranty: req.warranty }),
                ...(req.guarantee != undefined && req.guarantee != '' && { guarantee: req.guarantee }),
                ...(req.quantity != undefined && req.quantity != '' && { quantity: req.quantity }),
                ...(req.quality != undefined && req.quality != '' && { quality: req.quality }),
                ...(req.service != undefined && req.service != '' && { service: req.service }),
                ...(req.replacement != undefined && req.replacement != '' && { replacement: req.replacement }),
                ...(req.resale != undefined && req.resale != '' && { resale: req.resale }),
                ...(req.details != undefined && req.details != '' && { details: req.details }),
            };

            await Product.update(productParams, { where: { id: req.product_id } });

            await ProductImages.destroy({ where: { product_id: req.product_id } });

            const imagesData = req.images.map(data => ({
                image: data.image,
                product_id: req.product_id,
            }));

            await ProductImages.bulkCreate(imagesData);
            UserDetails.update({ used_space: req.used_space }, { where: { id: req.store_id } });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_update_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_product_update_fail'), null);
        }
    },

    /**
     * Function to get user store list
     * @param {request} req
     * @param {Function} res
     */
    async getStoreList(req, res) {
        try {
            const userData = await UserDetails.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'market_place_id',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'is_premium',
                    'status',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [
                        SequelizePakcage.fn(
                            'CONCAT',
                            GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO,
                            SequelizePakcage.col('tbl_user_details.image')
                        ),
                        'store_image',
                    ],
                ],
                where: { user_id: req.user_id, type: 'store', is_deleted: 0 },
                include: [
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                ],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const planBuyDetails = await PlanBuyDetails.findAll({
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
                                    'no_images',
                                    'storage',
                                    'storage_type',
                                    'type',
                                    'benefit',
                                    'guj_benefit',
                                    'guj_payment',
                                    'payment_procedure',
                                    'monthly_price',
                                    'yearly_price',
                                    'is_free',
                                ],
                            },
                        ],
                        where: {
                            store_service_id: item.id,
                            user_id: req.user_id,
                            status: 1,
                            is_deleted: 0,
                        },
                    });
                    item.setDataValue('buy_subscription_plan', (planBuyDetails.length > 0) ? planBuyDetails[0] : {});
                }

                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user store details
     * @param {request} req
     * @param {Function} res
     */
    async getStoreDetails(req, res) {
        try {
            const userData = await UserDetails.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'user_id',
                    'image',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'en_name',
                    'guj_name',
                    'market_place_id',
                    'user_id',
                    'category_id',
                    'gstno',
                    'whatsapp_number',
                    'address_line_1',
                    'address_line_2',
                    'latitude',
                    'longitude',
                    'landmark',
                    'en_work_details',
                    'guj_work_details',
                    'state',
                    'city',
                    'pincode',
                    'type',
                    'is_premium',
                    'status',
                    'is_approved',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                ],

                where: { id: req.store_id, type: 'store', is_deleted: 0 },
                include: [
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },
                ],
            });

            if (userData.length > 0) {
                const item = userData[0];
                const images = item.image ? item.image.split(',') : [];
                const imagesData = [];

                if (images.length > 0) {
                    for (const img of images) {
                        imagesData.push(`${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO}${img.trim()}`);
                    }
                }

                item.setDataValue('image', imagesData);

                const productData = await Product.findAll({
                    attributes: ['id'],
                    where: { store_id: req.store_id, status: 1, is_deleted: 0 },
                });

                userData[0].setDataValue('total_products', productData.length);
                const isFollowData = await Follow.findAll({
                    attributes: ['id'],
                    where: {
                        ...(req.user_id != undefined) && { user_id: req.user_id },
                        follower_id: req.store_id, status: 1, is_deleted: 0
                    },
                });
                userData[0].setDataValue('is_follow', isFollowData.length > 0 ? 1 : 0);
                const followerData = await Follow.findAll({
                    attributes: ['id'],
                    where: { follower_id: req.store_id, status: 1, is_deleted: 0 },
                });

                const planBuyDetails = await PlanBuyDetails.findAll({
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
                                'no_images',
                                'storage',
                                'storage_type',
                                'type',
                                'benefit',
                                'guj_benefit',
                                'guj_payment',
                                'payment_procedure',
                                'monthly_price',
                                'yearly_price',
                                'is_free',
                            ],
                        },
                    ],
                    where: {
                        store_service_id: req.store_id,
                        user_id: req.user_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });
                let productIdArray = [];
                const productsData = productData.map(data => productIdArray.push(data.id));

                const avgRating = await Product.findOne({
                    attributes: [[fn('AVG', col('avg_rating')), 'avg_rating']],
                    where: {
                        id: {
                            [Op.in]: productIdArray,
                        },
                        status: 1,
                        is_deleted: 0,
                    },
                    raw: true,
                });

                let rating = parseFloat(avgRating.avg_rating > 0 ? avgRating.avg_rating : 0);
                let avg_rating = rating.toFixed(2);
                userData[0].setDataValue('avg_rating', avg_rating);
                userData[0].setDataValue('buy_subscription_plan', (planBuyDetails.length > 0) ? planBuyDetails[0] : {});

                userData[0].setDataValue('total_followers', followerData.length);
                const userDetails = await User.findAll({
                    attributes: [
                        'id',
                        'language',
                        'role',
                        'en_full_name',
                        'guj_full_name',
                        'email',
                        'country_code',
                        'phone_no',
                        'is_notification',
                        'dob',
                        [
                            SequelizePakcage.fn(
                                'CONCAT',
                                GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS,
                                SequelizePakcage.col('profile_image')
                            ),
                            'profile_image',
                        ],
                    ],
                    where: { id: userData[0].user_id, status: 1, is_deleted: 0 },
                });
                userData[0].setDataValue('userdata', userDetails[0]);
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user product list
     * @param {request} req
     * @param {Function} res
     */
    async getStoreProductList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check for optional category_id
            if (req.category_id != null && req.category_id !== '') {
                whereLikeConditions.category_id = req.category_id;
            }
            // Check for optional subcategory_id
            if (req.subcategory_id != null && req.subcategory_id !== '') {
                whereLikeConditions.subcategory_id = req.subcategory_id;
            }

            // Check for optional price range (between price_range_start and price_range_end)
            if (
                req.price_range_start != null &&
                req.price_range_start !== '' &&
                req.price_range_end != null &&
                req.price_range_end
            ) {
                whereLikeConditions.price = {
                    [Op.between]: [parseFloat(req.price_range_start), parseFloat(req.price_range_end)],
                };
            }
            const searchCondition =
                req.search_text != undefined && req.search_text != ''
                    ? {
                        [Op.or]: [
                            { name: { [Op.like]: `%${req.search_text}%` } },
                            { product_code: { [Op.like]: `%${req.search_text}%` } },

                            SequelizePakcage.where(SequelizePakcage.col('subcategorydata.en_name'), {
                                [Op.like]: `%${req.search_text}%`,
                            }),
                            SequelizePakcage.where(SequelizePakcage.col('subcategorydata.guj_name'), {
                                [Op.like]: `%${req.search_text}%`,
                            }),
                        ],
                    }
                    : {};

            let orderBy = ['id', 'DESC'];
            if (req.is_avg != null && req.is_avg != '') {
                orderBy = ['avg_rating', req.is_avg == 1 ? 'DESC' : 'ASC'];
            }

            if (req.is_price != null && req.is_price != '') {
                orderBy = ['price', req.is_price == 1 ? 'DESC' : 'ASC'];
            }
            const userData = await Product.findAll({
                order: [[orderBy]],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                include: [
                    {
                        attributes: [],
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
                where: {
                    user_id: req.user_id,
                    store_id: req.store_id,
                    is_deleted: 0,
                    ...searchCondition,
                    ...whereLikeConditions,
                },
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to addStoreDetails for user
     * @param {request} request
     * @param {Function} res
     */
    async addStoreDetails(request, res) {
        try {
            const subscription = await authModel.getNewPlan(request);

            const bytesConvert = subscription.storage_type == 0 ? subscription.storage * 1000 : subscription.storage_type == 1 ? subscription.storage * 1000000 : subscription.storage * 1000000;

            var userDeatilsParams = {
                user_id: request.user_id,
                market_place_id: request.market_place_id,
                category_id: request.category_id,
                type: 'store',
                en_name: request.en_store_name,
                guj_name: request.guj_store_name,
                image: request.image,
                whatsapp_number: request.whatsapp_number,
                ...(request.gstno != undefined && request.gstno != '' && { gstno: request.gstno }),
                address_line_1: request.address_line_1,
                address_line_2: request.address_line_2,
                state: request.state,
                city: request.city,
                latitude: request.latitude,
                longitude: request.longitude,
                pincode: request.pincode,
                storage_limit: bytesConvert,
                landmark: request.landmark != undefined && request.landmark != '' ? request.landmark : null,
            };
            const userDetailsData = await UserDetails.create(userDeatilsParams);
            var subscriptionParams = {
                role: 1,
                user_id: request.user_id,
                store_service_id: userDetailsData.id,
                plan_id: subscription.id,
                start_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment().utc().add(6, 'months').format('YYYY-MM-DD HH:mm:ss'),
                is_premium: 0,
                plan_details: JSON.stringify(subscription),

            };
            await PlanBuyDetails.create(subscriptionParams);

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userDetailsData);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update store details
     * @param {request} request
     * @param {Function} res
     */
    async updateStoreDetails(request, res) {
        try {
            const userData = await UserDetails.findAll({
                attributes: ['id'],
                where: { user_id: request.user_id, id: request.store_id },
            });

            if (userData != undefined && userData != null && userData.length > 0) {
                try {
                    const updateData = {
                        market_place_id: request.market_place_id,
                        category_id: request.category_id,
                        en_name: request.en_store_name,
                        guj_name: request.guj_store_name,
                        image: request.image,
                        whatsapp_number: request.whatsapp_number,
                        address_line_1: request.address_line_1,
                        address_line_2: request.address_line_2,
                        state: request.state,
                        city: request.city,
                        latitude: request.latitude,
                        longitude: request.longitude,
                        pincode: request.pincode,
                        status: 0,
                        is_approved: 0,
                        ...(request.gstno != undefined && request.gstno != '' && { gstno: request.gstno }),
                        ...(request.landmark != undefined && request.landmark != '' && { landmark: request.landmark }),
                    };

                    await UserDetails.update(updateData, { where: { user_id: request.user_id, id: request.store_id } });
                    SaveProduct.destroy({
                        where: {
                            store_id: request.store_id
                        }
                    })
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_profile_update_success'),
                        null
                    );
                } catch (error) {
                    return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to deleteStoreDetails store details
     * @param {request} request
     * @param {Function} res
     */
    async deleteStoreDetails(req, res) {
        try {
            const userData = await UserDetails.findAll({
                attributes: ['id'],
                where: { user_id: req.user_id, id: req.store_id },
            });

            if (userData != undefined && userData != null && userData.length > 0) {
                try {
                    const updateData = {
                        is_deleted: 1,
                    };
                    await UserDetails.update(updateData, { where: { user_id: req.user_id, id: req.store_id } });

                    SaveProduct.destroy({
                        where: {
                            store_id: req.store_id
                        }
                    })

                    PlanBuyDetails.destroy({
                        where: {
                            store_service_id: req.store_id
                        }
                    })

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_store_delete_success'),
                        null
                    );
                } catch (error) {
                    return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user rated product list
     * @param {request} req
     * @param {Function} res
     */
    async getMostRatedProductList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            details: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            product_code: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.en_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.guj_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),
                    ],
                };
            }

            const userData = await Product.findAll({
                order: [['avg_rating', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    store_id: req.store_id,
                    is_deleted: 0,
                    ...whereLikeConditions,
                },
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    },
                    {
                        attributes: [],
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user trading product list
     * @param {request} req
     * @param {Function} res
     */
    async getMostTradingProductList(req, res) {
        let whereLikeConditions = {};
        // Check if search_text is provided
        if (req.search_text != null && req.search_text !== '') {
            whereLikeConditions = {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${req.search_text}%`,
                        },
                    },
                    {
                        details: {
                            [Op.like]: `%${req.search_text}%`,
                        },
                    },
                    {
                        product_code: {
                            [Op.like]: `%${req.search_text}%`,
                        },
                    },
                    SequelizePakcage.where(SequelizePakcage.col('subcategorydata.en_name'), {
                        [Op.like]: `%${req.search_text}%`,
                    }),
                    SequelizePakcage.where(SequelizePakcage.col('subcategorydata.guj_name'), {
                        [Op.like]: `%${req.search_text}%`,
                    }),
                ],
            };
        }
        try {
            const userData = await Product.findAll({
                order: [['total_like', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    store_id: req.store_id,
                    is_deleted: 0,
                    ...whereLikeConditions,
                },
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                    },
                    {
                        attributes: [],
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to updateProductStatus store details
     * @param {request} request
     * @param {Function} res
     */
    async updateProductStatus(req, res) {
        try {
            const userData = await Product.findAll({
                attributes: ['id'],
                where: { user_id: req.user_id, id: req.product_id },
            });

            if (userData != undefined && userData != null && userData.length > 0) {
                try {
                    const updateData = {
                        status: req.status,
                    };
                    await Product.update(updateData, { where: { user_id: req.user_id, id: req.product_id } });

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_profile_update_success'),
                        null
                    );
                } catch (error) {
                    return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to getS3BucketUrl store details
     * @param {request} request
     * @param {Function} res
     */
    async getS3BucketUrl(request, res) {
        try {
            const s3_new = new AWS.S3({
                accessKeyId: GLOBALS.AWS_S3_ACCESS_KEY,
                secretAccessKey: GLOBALS.AWS_S3_SECRET_KEY,
                region: GLOBALS.AWS_S3_REGION,
                signatureVersion: 'v4',
                useAccelerateEndpoint: false,
            });
            console.log('============')
            console.log('s3_new', s3_new)
            const fileType = request.filetype.startsWith('.') ? request.filetype.substring(1) : request.filetype;
            console.log('fileType', fileType)
            let content_type;
            if (request.filetype === '.aac') {
                content_type = 'audio/mpeg';
            } else if (request.filetype === '.mp4') {
                content_type = 'video/mp4';
            } else {
                content_type = `image/${fileType}`;
            }
            console.log('content_type', content_type)
            console.log('============')
            const s3Params = {
                Bucket: GLOBALS.AWS_S3_BUCKET_NAME,
                Key: `${request.folder_name}/${request.fileName}.${fileType}`,
                Expires: 60 * 60,
                ContentType: content_type,
                ACL: 'public-read',
            };
            console.log('Bucket', GLOBALS.AWS_S3_BUCKET_NAME)
            console.log('Key', `${request.folder_name}/${request.fileName}.${fileType}`)
            console.log('============')
            s3_new.getSignedUrl('putObject', s3Params, (err, data) => {
                if (err) {
                    return middleware.sendApiResponse(res, CODES.ERROR, err.message, null);
                }
                console.log(data)
                const returnData = {
                    uploadUrl: data,
                    downloadUrl: `${GLOBALS.CDN_S3_URL}/${request.folder_name}/${request.fileName}.${fileType}`,
                };

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_profile_update_success'),
                    returnData
                );
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get dashboard Count
     * @param {request} req
     * @param {Function} res
     */
    async getDashboardCount(req, res) {
        try {
            const productCount = await Product.count({
                where: {
                    user_id: req.user_id,
                    store_id: req.store_id,
                    status: 1,
                    is_deleted: 0,
                },
                //group: ['product_id'],
            });
            const saveCount = await SaveProduct.findAll({
                where: {
                    //user_id: req.user_id,
                    store_id: req.store_id,
                    status: 1,
                    is_deleted: 0,
                },
                group: ['product_id'],
            });
            const likeCount = await ProductLikes.findAll({
                where: {
                    //user_id: req.user_id,
                    store_id: req.store_id,
                    status: 1,
                    is_deleted: 0,
                },
                group: ['product_id'],
            });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_delete_success'), {
                total_products: productCount,
                total_saved_products: saveCount.length,
                total_like_products: likeCount.length,
            });
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_product_delete_fail'), null);
        }
    },

    /**
     * Function to get user trading product list
     * @param {request} req
     * @param {Function} res
     */
    async getSaveProductList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            details: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            product_code: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                    ],
                };
            }
            const userData = await SaveProduct.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    [SequelizePakcage.col('productdata.id'), 'product_id'],
                    [SequelizePakcage.col('productdata.name'), 'name'],
                    [SequelizePakcage.col('productdata.product_code'), 'product_code'],
                    [SequelizePakcage.col('productdata.category_id'), 'category_id'],
                    [SequelizePakcage.col('productdata.subcategory_id'), 'subcategory_id'],
                    [SequelizePakcage.col('productdata.store_id'), 'store_id'],
                    [SequelizePakcage.col('productdata.price'), 'price'],
                    [SequelizePakcage.col('productdata.discount'), 'discount'],
                    [SequelizePakcage.col('productdata.discount_type'), 'discount_type'],
                    [SequelizePakcage.col('productdata.brand'), 'brand'],
                    [SequelizePakcage.col('productdata.gender'), 'gender'],
                    [SequelizePakcage.col('productdata.color'), 'color'],
                    [SequelizePakcage.col('productdata.size'), 'size'],
                    [SequelizePakcage.col('productdata.shape'), 'shape'],
                    [SequelizePakcage.col('productdata.material'), 'material'],
                    [SequelizePakcage.col('productdata.pattern'), 'pattern'],
                    [SequelizePakcage.col('productdata.design'), 'design'],
                    [SequelizePakcage.col('productdata.type'), 'type'],
                    [SequelizePakcage.col('productdata.warranty'), 'warranty'],
                    [SequelizePakcage.col('productdata.sustainable'), 'sustainable'],
                    [SequelizePakcage.col('productdata.guarantee'), 'guarantee'],
                    [SequelizePakcage.col('productdata.quantity'), 'quantity'],
                    [SequelizePakcage.col('productdata.quality'), 'quality'],
                    [SequelizePakcage.col('productdata.service'), 'service'],
                    [SequelizePakcage.col('productdata.replacement'), 'replacement'],
                    [SequelizePakcage.col('productdata.resale'), 'resale'],
                    [SequelizePakcage.col('productdata.details'), 'details'],
                    [SequelizePakcage.col('productdata.status'), 'status'],
                    [SequelizePakcage.col('productdata.avg_rating'), 'avg_rating'],
                    [SequelizePakcage.col('productdata.subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('productdata.subcategorydata.guj_name'), 'guj_sub_category_name'],

                ],
                where: {
                    store_id: req.store_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        attributes: [],
                        model: Product,
                        as: 'productdata',
                        where: {
                            ...whereLikeConditions,
                        },
                        include: [
                            {
                                attributes: [],
                                model: ProductSubCategory,
                                as: 'subcategorydata',
                            },
                        ]

                    },
                ],
                row: true,
                group: ['productdata.id'],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.product_id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user trading product list
     * @param {request} req
     * @param {Function} res
     */
    async getSaveProductUserList(req, res) {
        try {
            const userData = await SaveProduct.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    [SequelizePakcage.col('productdata.id'), 'product_id'],
                    [SequelizePakcage.col('productdata.name'), 'name'],
                    [SequelizePakcage.col('productdata.product_code'), 'product_code'],
                    [SequelizePakcage.col('productdata.category_id'), 'category_id'],
                    [SequelizePakcage.col('productdata.subcategory_id'), 'subcategory_id'],
                    [SequelizePakcage.col('productdata.store_id'), 'store_id'],
                    [SequelizePakcage.col('productdata.price'), 'price'],
                    [SequelizePakcage.col('productdata.discount'), 'discount'],
                    [SequelizePakcage.col('productdata.discount_type'), 'discount_type'],
                    [SequelizePakcage.col('productdata.brand'), 'brand'],
                    [SequelizePakcage.col('productdata.gender'), 'gender'],
                    [SequelizePakcage.col('productdata.color'), 'color'],
                    [SequelizePakcage.col('productdata.size'), 'size'],
                    [SequelizePakcage.col('productdata.shape'), 'shape'],
                    [SequelizePakcage.col('productdata.material'), 'material'],
                    [SequelizePakcage.col('productdata.pattern'), 'pattern'],
                    [SequelizePakcage.col('productdata.design'), 'design'],
                    [SequelizePakcage.col('productdata.type'), 'type'],
                    [SequelizePakcage.col('productdata.warranty'), 'warranty'],
                    [SequelizePakcage.col('productdata.sustainable'), 'sustainable'],
                    [SequelizePakcage.col('productdata.guarantee'), 'guarantee'],
                    [SequelizePakcage.col('productdata.quantity'), 'quantity'],
                    [SequelizePakcage.col('productdata.quality'), 'quality'],
                    [SequelizePakcage.col('productdata.service'), 'service'],
                    [SequelizePakcage.col('productdata.replacement'), 'replacement'],
                    [SequelizePakcage.col('productdata.resale'), 'resale'],
                    [SequelizePakcage.col('productdata.details'), 'details'],
                    [SequelizePakcage.col('productdata.status'), 'status'],
                    [SequelizePakcage.col('productdata.avg_rating'), 'avg_rating'],
                    [SequelizePakcage.col('productdata.subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('productdata.subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    user_id: req.user_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        attributes: [],
                        model: Product,
                        as: 'productdata',
                        include: [
                            {
                                attributes: [],
                                model: ProductSubCategory,
                                as: 'subcategorydata',
                            },
                        ]
                    },
                ],
                row: true,
                group: ['productdata.id'],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.product_id, status: 1, is_deleted: 0 },
                    });
                    const likeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: { user_id: req.user_id, product_id: item.product_id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('is_liked', likeData.length > 0 ? 1 : 0);

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            console.log(error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },
    /**
     * Function to get user getLikeProductList
     * @param {request} req
     * @param {Function} res
     */
    async getLikeProductList(req, res) {
        try {
            const userData = await ProductLikes.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    [SequelizePakcage.col('productdata.id'), 'product_id'],
                    [SequelizePakcage.col('productdata.name'), 'name'],
                    [SequelizePakcage.col('productdata.product_code'), 'product_code'],
                    [SequelizePakcage.col('productdata.category_id'), 'category_id'],
                    [SequelizePakcage.col('productdata.subcategory_id'), 'subcategory_id'],
                    [SequelizePakcage.col('productdata.store_id'), 'store_id'],
                    [SequelizePakcage.col('productdata.price'), 'price'],
                    [SequelizePakcage.col('productdata.discount'), 'discount'],
                    [SequelizePakcage.col('productdata.discount_type'), 'discount_type'],
                    [SequelizePakcage.col('productdata.brand'), 'brand'],
                    [SequelizePakcage.col('productdata.gender'), 'gender'],
                    [SequelizePakcage.col('productdata.color'), 'color'],
                    [SequelizePakcage.col('productdata.size'), 'size'],
                    [SequelizePakcage.col('productdata.shape'), 'shape'],
                    [SequelizePakcage.col('productdata.material'), 'material'],
                    [SequelizePakcage.col('productdata.pattern'), 'pattern'],
                    [SequelizePakcage.col('productdata.design'), 'design'],
                    [SequelizePakcage.col('productdata.type'), 'type'],
                    [SequelizePakcage.col('productdata.warranty'), 'warranty'],
                    [SequelizePakcage.col('productdata.sustainable'), 'sustainable'],
                    [SequelizePakcage.col('productdata.guarantee'), 'guarantee'],
                    [SequelizePakcage.col('productdata.quantity'), 'quantity'],
                    [SequelizePakcage.col('productdata.quality'), 'quality'],
                    [SequelizePakcage.col('productdata.service'), 'service'],
                    [SequelizePakcage.col('productdata.replacement'), 'replacement'],
                    [SequelizePakcage.col('productdata.resale'), 'resale'],
                    [SequelizePakcage.col('productdata.details'), 'details'],
                    [SequelizePakcage.col('productdata.status'), 'status'],
                    [SequelizePakcage.col('productdata.avg_rating'), 'avg_rating'],
                    [SequelizePakcage.col('productdata.subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('productdata.subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    user_id: req.user_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        attributes: [],
                        model: Product,
                        as: 'productdata',
                        include: [
                            {
                                attributes: [],
                                model: ProductSubCategory,
                                as: 'subcategorydata',
                            },
                        ]
                    },
                ],
                row: true,
                group: ['productdata.id'],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.product_id, status: 1, is_deleted: 0 },
                    });
                    const likeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: { user_id: req.user_id, product_id: item.product_id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('is_liked', likeData.length > 0 ? 1 : 0);
                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },
    async getVenodrLikeProductList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            details: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            product_code: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                    ],
                };
            }

            const userData = await ProductLikes.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'product_id',
                    'store_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                    [SequelizePakcage.col('productdata.id'), 'product_id'],
                    [SequelizePakcage.col('productdata.name'), 'name'],
                    [SequelizePakcage.col('productdata.product_code'), 'product_code'],
                    [SequelizePakcage.col('productdata.category_id'), 'category_id'],
                    [SequelizePakcage.col('productdata.subcategory_id'), 'subcategory_id'],
                    [SequelizePakcage.col('productdata.store_id'), 'store_id'],
                    [SequelizePakcage.col('productdata.price'), 'price'],
                    [SequelizePakcage.col('productdata.discount'), 'discount'],
                    [SequelizePakcage.col('productdata.discount_type'), 'discount_type'],
                    [SequelizePakcage.col('productdata.brand'), 'brand'],
                    [SequelizePakcage.col('productdata.gender'), 'gender'],
                    [SequelizePakcage.col('productdata.color'), 'color'],
                    [SequelizePakcage.col('productdata.size'), 'size'],
                    [SequelizePakcage.col('productdata.shape'), 'shape'],
                    [SequelizePakcage.col('productdata.material'), 'material'],
                    [SequelizePakcage.col('productdata.pattern'), 'pattern'],
                    [SequelizePakcage.col('productdata.design'), 'design'],
                    [SequelizePakcage.col('productdata.type'), 'type'],
                    [SequelizePakcage.col('productdata.warranty'), 'warranty'],
                    [SequelizePakcage.col('productdata.sustainable'), 'sustainable'],
                    [SequelizePakcage.col('productdata.guarantee'), 'guarantee'],
                    [SequelizePakcage.col('productdata.quantity'), 'quantity'],
                    [SequelizePakcage.col('productdata.quality'), 'quality'],
                    [SequelizePakcage.col('productdata.service'), 'service'],
                    [SequelizePakcage.col('productdata.replacement'), 'replacement'],
                    [SequelizePakcage.col('productdata.resale'), 'resale'],
                    [SequelizePakcage.col('productdata.details'), 'details'],
                    [SequelizePakcage.col('productdata.status'), 'status'],
                    [SequelizePakcage.col('productdata.avg_rating'), 'avg_rating'],
                    [SequelizePakcage.col('productdata.subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('productdata.subcategorydata.guj_name'), 'guj_sub_category_name'],

                ],
                where: {
                    store_id: req.store_id,
                    is_deleted: 0,
                },
                include: [
                    {
                        attributes: [],
                        model: Product,
                        as: 'productdata',
                        where: {
                            ...whereLikeConditions,
                        },
                        include: [
                            {
                                attributes: [],
                                model: ProductSubCategory,
                                as: 'subcategorydata',
                            },
                        ]
                    },
                ],
                row: true,
                group: ['productdata.id'],
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.product_id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },
    /**
     * Function to get subscription plans
     * @param {request} request
     * @param {Function} res
     */
    async getSubscriptionPlans(req, res) {
        try {
            const subscriptionPlanData = await SubscriptionPlans.findAll({
                attributes: ['id', 'title', 'guj_title', 'no_images', 'monthly_price', 'yearly_price', 'guj_benefit', 'benefit', 'guj_payment', 'payment_procedure', 'storage', 'type', 'storage_type'],
                where: { type: req.type, status: 1, is_deleted: 0 },
            });

            if (subscriptionPlanData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_subscription_plan_success'),
                    subscriptionPlanData
                );
            } else {
                return middleware.sendApiResponse(
                    res,
                    CODES.ERROR,
                    t('rest_keywords_get_subscription_plan_fail'),
                    null
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get notification list
     * @param {request} request
     * @param {Function} res
     */
    async getNotificationList(req, res) {
        try {
            const sevenDaysAgo = moment().utc().subtract(7, 'days').toDate();

            const notificationData = await Notification.findAll({
                order: [['id', 'DESC']],
                attributes: ['id', 'sender_id', 'receiver_id', 'field', 'field_title', 'tag', 'action_id', 'title', 'message', 'is_read', 'createdAt'],
                where: {
                    receiver_id: req.user_id,
                    status: 1,
                    is_deleted: 0,
                    createdAt: {
                        [Op.gte]: sevenDaysAgo,
                    },
                },
            });
            if (notificationData.length > 0) {
                asyncLoop(notificationData, async function (item, next) {
                    Notification.update({ is_read: 1 }, { where: { id: item.id } });
                    //console.log('item.tag = ',item.tag)
                    //if(item.tag!='msg'){
                    if (item.field != '') {
                        let newitem = JSON.parse(item.field + '');
                        item.setDataValue("message", t(item.message, newitem));
                        if (item.field_title != '') {
                            let newtitleitem = JSON.parse(item.field_title + '');
                            item.setDataValue("title", t(item.title, newtitleitem));
                            next();
                        } else {
                            item.setDataValue("title", t(item.title.toString()));
                            next();
                        }

                    } else {
                        item.setDataValue("message", t(item.message.toString()));
                        if (item.field_title != '') {
                            let newtitleitem = JSON.parse(item.field_title + '');
                            item.setDataValue("title", t(item.title, newtitleitem));
                            next();
                        } else {
                            item.setDataValue("title", t(item.title.toString()));
                            next();
                        }
                    }
                    // }else{
                    //     next();
                    // }
                }, async function () {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_get_notification_list_success'),
                        notificationData
                    );
                })

            } else {
                return middleware.sendApiResponse(
                    res,
                    CODES.ERROR,
                    t('rest_keywords_get_notification_list_fail'),
                    null
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get services
     * @param {request} req
     * @param {Function} res
     */
    async getServices(req, res) {
        try {
            const userData = await UserDetails.findAll({
                attributes: [
                    'id',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'user_id',
                    'profile_image',
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('profile_image')),
                        'profile_image',
                    ],
                    'en_name',
                    'guj_name',
                    'en_work_details',
                    'guj_work_details',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'market_place_id',
                    'category_id',
                    'image',
                    'whatsapp_number',
                    'landmark',
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                ],
                where: { user_id: req.user_id, type: 'service', is_deleted: 0 },
                include: [
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },
                ],
            });
            if (userData.length > 0) {
                for (const item of userData) {
                    // Split the image string by commas to handle multiple images
                    const images = item.image ? item.image.split(',') : [];
                    const imagesData = [];

                    if (images.length > 0) {
                        for (const img of images) {
                            imagesData.push(`${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO}${img.trim()}`);
                        }
                    }

                    // Set the new value for image
                    item.setDataValue('image', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_get_service_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_service_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add services
     * @param {request} req
     * @param {Function} res
     */
    async addService(req, res) {
        try {
            const subscription = await authModel.getNewPlanServiceProvider(req);

            const bytesConvert = subscription.storage_type == 0 ? subscription.storage * 1000 : subscription.storage_type == 1 ? subscription.storage * 1000000 : subscription.storage * 1000000;

            var userDeatilsParams = {
                user_id: req.user_id,
                en_name: req.en_name,
                guj_name: req.guj_name,
                profile_image: req.profile_image,
                en_work_details: req.en_work_details,
                guj_work_details: req.guj_work_details,
                address_line_1: req.address_line_1,
                address_line_2: req.address_line_2,
                state: req.state,
                city: req.city,
                pincode: req.pincode,
                market_place_id: req.market_place_id,
                category_id: req.category_id,
                type: 'service',
                image: req.work_image.toString(),
                storage_limit: bytesConvert,
                whatsapp_number: req.whatsapp_number,
                landmark: req.landmark != undefined && req.landmark != '' ? req.landmark : null,
                latitude: req.latitude != undefined && req.latitude != '' ? req.latitude : null,
                longitude: req.longitude != undefined && req.longitude != '' ? req.longitude : null,
            };

            const userDetailsData = await UserDetails.create(userDeatilsParams);
            UserDetails.update({ used_space: req.used_space }, { where: { id: userDetailsData.id } });
            var subscriptionParams = {
                role: 2,
                user_id: req.user_id,
                store_service_id: userDetailsData.id,
                plan_id: subscription.id,
                start_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment().utc().add(6, 'months').format('YYYY-MM-DD HH:mm:ss'),
                is_premium: 0,
                plan_details: JSON.stringify(subscription),

            };
            await PlanBuyDetails.create(subscriptionParams);

            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                t('rest_keywords_add_service_success'),
                userDetailsData
            );
        } catch (error) {
            console.log('error', error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to update services
     * @param {request} req
     * @param {Function} res
     */
    async updateService(req, res) {
        try {
            var updateData = {
                en_name: req.en_name,
                guj_name: req.guj_name,
                profile_image: req.profile_image,
                en_work_details: req.en_work_details,
                guj_work_details: req.guj_work_details,
                address_line_1: req.address_line_1,
                address_line_2: req.address_line_2,
                state: req.state,
                city: req.city,
                pincode: req.pincode,
                market_place_id: req.market_place_id,
                category_id: req.category_id,
                image: req.work_image.toString(),
                status: 0,
                is_approved: 0,
                whatsapp_number: req.whatsapp_number,
                ...(req.landmark != undefined && req.landmark != '' && { landmark: req.landmark }),
                ...(req.latitude != undefined && req.latitude != '' && { latitude: req.latitude }),
                ...(req.longitude != undefined && req.longitude != '' && { longitude: req.longitude }),
            };
            await UserDetails.update(updateData, { where: { id: req.service_id } });
            UserDetails.update({ used_space: req.used_space }, { where: { id: req.service_id } });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_update_service_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to delete service
     * @param {request} req
     * @param {Function} res
     */
    async deleteService(req, res) {
        try {
            UserDetails.update({ is_deleted: '1' }, { where: { id: req.service_id } });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_delete_service_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_delete_service_fail'), null);
        }
    },

    /**
     * Function to get user product list
     * @param {request} req
     * @param {Function} res
     */
    async getProductList(req, res) {
        try {
            const searchCondition =
                req.search_text != undefined && req.search_text != ''
                    ? {
                        [Op.or]: [{ name: { [Op.like]: `%${req.search_text}%` } }],
                    }
                    : {};
            const userData = await Product.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                ],
                where: {
                    status: 1,
                    is_deleted: 0,
                    ...searchCondition,
                },
            });

            if (userData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to like Unlike Product
     * @param {request} req
     * @param {Function} res
     */
    async likeUnlikeProduct(req, res) {
        try {
            if (req.is_like == '1') {
                const productLikeDetails = await ProductLikes.findAll({
                    attributes: ['id'],
                    where: {
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                if (productLikeDetails.length == 0) {
                    const productLikeData = await ProductLikes.create({
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                    });

                    const likesData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: { product_id: req.product_id, status: 1, is_deleted: 0 },
                    });

                    Product.update(
                        {
                            total_like: likesData.length,
                        },
                        { where: { id: req.product_id } }
                    );

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_product_like_success'),
                        null
                    );
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        t('rest_keywords_duplicate_product_like'),
                        null
                    );
                }
            } else {
                const productLikeDetails = await ProductLikes.findAll({
                    attributes: ['id'],
                    where: {
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                if (productLikeDetails.length > 0) {
                    const productUnlikeData = await ProductLikes.destroy({
                        where: {
                            id: productLikeDetails[0].id,
                        },
                    });

                    const likesData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: { product_id: req.product_id, status: 1, is_deleted: 0 },
                    });

                    Product.update(
                        {
                            total_like: likesData.length,
                        },
                        { where: { id: req.product_id } }
                    );

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_product_unlike_success'),
                        null
                    );
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_product_unlike_fail'), null);
                }
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to save unsave product
     * @param {request} req
     * @param {Function} res
     */
    async saveUnsaveProduct(req, res) {
        try {
            if (req.is_save == '1') {
                const saveProductDetails = await SaveProduct.findAll({
                    attributes: ['id'],
                    where: {
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                if (saveProductDetails.length == 0) {
                    const saveProductData = await SaveProduct.create({
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                    });

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_save_product_success'),
                        null
                    );
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        t('rest_keywords_duplicate_save_product'),
                        null
                    );
                }
            } else {
                const saveProductDetails = await SaveProduct.findAll({
                    attributes: ['id'],
                    where: {
                        user_id: req.user_id,
                        store_id: req.store_id,
                        product_id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                if (saveProductDetails.length > 0) {
                    const unsaveProducteData = await SaveProduct.destroy({
                        where: {
                            id: saveProductDetails[0].id,
                        },
                    });

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_product_unsave_success'),
                        null
                    );
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_product_unsave_fail'), null);
                }
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get service provider list
     * @param {request} req
     * @param {Function} res
     */
    async getServiceProviderList(req, res) {
        try {
            const serviceProviderData = await User.findAll({
                attributes: [
                    'id',
                    'language',
                    'role',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'phone_no',
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('profile_image')),
                        'profile_image',
                    ],
                ],
                where: { role: 2, status: 1, is_deleted: 0 },
            });

            if (serviceProviderData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_service_provider_success'),
                    serviceProviderData
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_service_provider_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * follow unfollow vendor & service provider
     * @param {request} req
     * @param {Function} res
     */
    async followUnfollow(req, res) {
        try {
            const followerDetails = await UserDetails.findAll({
                attributes: ['id'],
                where: {
                    ...(req.role == 1 && { id: req.follower_id }),
                    ...(req.role == 2 && { user_id: req.follower_id }),
                    status: 1,
                    is_deleted: 0,
                },
            });
            //console.log('followerDetails', followerDetails);
            if (followerDetails.length > 0) {
                if (req.is_follow == '1') {
                    const followDetails = await Follow.findAll({
                        attributes: ['id'],
                        where: {
                            user_id: req.user_id,
                            follower_id: req.follower_id,
                            role: req.role,
                            status: 1,
                            is_deleted: 0,
                        },
                    });

                    if (followDetails.length == 0) {
                        const followData = await Follow.create({
                            user_id: req.user_id,
                            follower_id: req.follower_id,
                            role: req.role,
                        });

                        return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_follow_success'), null);
                    } else {
                        return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_duplicate_follow'), null);
                    }
                } else {
                    const followDetails = await Follow.findAll({
                        attributes: ['id'],
                        where: {
                            user_id: req.user_id,
                            follower_id: req.follower_id,
                            role: req.role,
                            status: 1,
                            is_deleted: 0,
                        },
                    });

                    if (followDetails.length > 0) {
                        const unfollowData = await Follow.destroy({
                            where: {
                                id: followDetails[0].id,
                            },
                        });

                        return middleware.sendApiResponse(
                            res,
                            CODES.SUCCESS,
                            t('rest_keywords_unfollow_success'),
                            null
                        );
                    } else {
                        return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_unfollow_fail'), null);
                    }
                }
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_something_went_wrong'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * add product review
     * @param {request} req
     * @param {Function} res
     */
    async addReview(req, res) {
        try {
            const reviewData = await Review.create({
                user_id: req.user_id,
                product_id: req.product_id,
                rating: req.rating,
                role: req.role,
                review: req.review,
                createdAt: moment().utc().format('YYYY-MM-DD HH:mm:ss')
            });
            if (req.role == 1) {
                const avgRating = await Review.findOne({
                    attributes: [[fn('AVG', col('rating')), 'avg_rating']],
                    where: {
                        product_id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                    raw: true,
                });

                let rating = parseFloat(avgRating.avg_rating);
                let avg_rating = rating.toFixed(2);

                Product.update(
                    {
                        avg_rating: avg_rating,
                    },
                    { where: { id: req.product_id } }
                );
            }
            let receiver_id = 0;
            let name = '';
            if (req.role == 1) {
                const productData = await Product.findOne({
                    attributes: ['id', 'user_id', 'name'],
                    where: {
                        id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                    raw: true,
                });
                receiver_id = productData.user_id;
                name = productData.name;
            } else {
                const serviceData = await UserDetails.findOne({
                    attributes: ['id', 'user_id', 'en_name',
                        'guj_name'],
                    where: {
                        id: req.product_id,
                        status: 1,
                        is_deleted: 0,
                    },
                    raw: true,
                });
                receiver_id = serviceData.user_id;
                name = serviceData.en_name;
            }
            const loginUserData = await User.findAll({
                attributes: ['id', 'language', 'is_notification', 'email', 'phone_no'],
                where: {
                    id: receiver_id
                },
            });
            if (loginUserData[0].is_notification == 1) {
                NotificationModel.prepareNotification({
                    sender_id: req.user_id,
                    receiver_id: receiver_id,
                    action_id: req.product_id,
                    lang: (loginUserData[0].language != undefined) ? loginUserData[0].language : GLOBALS.APP_LANGUAGE,
                    title: {
                        keyword: 'rest_new_review_added_title',
                        components: { field: name },
                    },
                    tag: 'new_review',
                    field_title: JSON.stringify({ field: name }),
                    field: JSON.stringify({ field: name }),
                    message: {
                        keyword: 'rest_new_review_added_msg',
                        components: { field: name },
                    },
                    add_notification: 1,
                });
            }
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_review_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_review_fail'), null);
        }
    },

    /**
     * edit product review
     * @param {request} req
     * @param {Function} res
     */
    async editReview(req, res) {
        try {
            const reviewData = await Review.update(
                {
                    rating: req.rating,
                    review: req.review,
                },
                { where: { id: req.review_id } }
            );

            const avgRating = await Review.findOne({
                attributes: [[fn('AVG', col('rating')), 'avg_rating']],
                where: {
                    product_id: req.product_id,
                    status: 1,
                    is_deleted: 0,
                },
                raw: true,
            });

            let rating = parseFloat(avgRating.avg_rating);
            let avg_rating = rating.toFixed(2);

            Product.update(
                {
                    avg_rating: avg_rating,
                },
                { where: { id: req.product_id } }
            );

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_review_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_review_fail'), null);
        }
    },

    /**
     * delete product review
     * @param {request} req
     * @param {Function} res
     */
    async deleteReview(req, res) {
        try {
            const reviewData = await Review.destroy({
                where: { id: req.review_id },
            });

            const avgRating = await Review.findOne({
                attributes: [[fn('AVG', col('rating')), 'avg_rating']],
                where: {
                    product_id: req.product_id,
                    status: 1,
                    is_deleted: 0,
                },
                raw: true,
            });

            let rating = parseFloat(avgRating.avg_rating);
            let avg_rating = rating.toFixed(2);

            Product.update(
                {
                    avg_rating: avg_rating,
                },
                { where: { id: req.product_id } }
            );

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_review_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_review_fail'), null);
        }
    },

    /**
     * get review list
     * @param {request} req
     * @param {Function} res
     */
    async getReviewList(req, res) {
        try {
            const reviewDetails = await Review.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'product_id',
                    'role',
                    'rating',
                    'review',
                    'createdAt',
                    [col('userdata.en_full_name'), 'en_user_name'],
                    [col('userdata.guj_full_name'), 'guj_user_name'],
                    [
                        SequelizePakcage.fn(
                            'CONCAT',
                            SequelizePakcage.literal(`'${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO}'`),
                            SequelizePakcage.col('userdata.profile_image')
                        ),
                        'profile_image',
                    ],
                ],
                where: { product_id: req.product_id, status: 1, is_deleted: 0, role: req.role },
                include: [
                    {
                        model: User,
                        as: 'userdata',
                    },
                ],
            });

            if (reviewDetails.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_review_success'),
                    reviewDetails
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_review_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_review_fail'), null);
        }
    },

    /**
     * get service provider details
     * @param {request} req
     * @param {Function} res
     */
    async getServiceProviderDetails(req, res) {
        try {
            const serviceProviderData = await UserDetails.findAll({
                attributes: [
                    'id',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'image',
                    'user_id',
                    'view_count',
                    'en_name',
                    'guj_name',
                    'en_work_details',
                    'guj_work_details',
                    'whatsapp_number',
                    'address_line_1',
                    'address_line_2',
                    'state',
                    'city',
                    'pincode',
                    'latitude',
                    'longitude',
                    'landmark',
                    'is_premium',
                    'status',
                    'is_approved',
                    [col('userdata.en_full_name'), 'en_user_name'],
                    [col('userdata.guj_full_name'), 'guj_user_name'],
                    [col('userdata.email'), 'email'],
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                    [col('categorydata.en_name'), 'en_category_name'],
                    [col('categorydata.guj_name'), 'guj_category_name'],
                    [
                        SequelizePakcage.fn(
                            'CONCAT',
                            GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO,
                            SequelizePakcage.col('tbl_user_details.profile_image')
                        ),
                        'profile_image',
                    ],
                ],
                where: { id: req.service_provider_id, type: 'service', is_deleted: 0 },
                include: [
                    {
                        model: User,
                        as: 'userdata',
                    },
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                    },
                ],
            });

            if (serviceProviderData.length > 0) {
                await UserDetails.update(
                    { view_count: serviceProviderData[0].view_count + 1 },
                    {
                        where: {
                            id: req.service_provider_id,
                            user_id: { [Op.ne]: req.user_id }
                        }
                    }
                );
                for (const item of serviceProviderData) {
                    // Split the image string by commas to handle multiple images
                    const images = item.image ? item.image.split(',') : [];
                    const imagesData = [];

                    if (images.length > 0) {
                        for (const img of images) {
                            imagesData.push(`${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO}${img.trim()}`);
                        }
                    }

                    // Set the new value for image
                    serviceProviderData[0].setDataValue('image', imagesData);
                }
                const followerData = await Follow.findAll({
                    attributes: ['id'],
                    where: { follower_id: serviceProviderData[0].user_id, status: 1, is_deleted: 0 },
                });

                serviceProviderData[0].setDataValue('total_followers', followerData.length);

                const reviewlist = await Review.findAll({
                    attributes: [
                        'id',
                        'rating',
                        'review',
                        'createdAt',
                        [col('userdata.en_full_name'), 'en_user_name'],
                        [col('userdata.guj_full_name'), 'guj_user_name'],
                        [
                            SequelizePakcage.fn(
                                'CONCAT',
                                SequelizePakcage.literal(`'${GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO}'`),
                                SequelizePakcage.col('userdata.profile_image')
                            ),
                            'profile_image',
                        ],
                    ],
                    where: {
                        product_id: req.service_provider_id,
                        status: 1,
                        is_deleted: 0,
                        role: 2,
                    },
                    include: [
                        {
                            model: User,
                            as: 'userdata',
                        },
                    ],
                });
                const avgRatingResult = await Review.findAll({
                    attributes: ['id', [fn('AVG', col('rating')), 'avg_rating']],
                    where: {
                        product_id: req.service_provider_id,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });
                serviceProviderData[0].setDataValue('avg_rating', avgRatingResult[0].avg_rating);
                if (reviewlist.length > 0) {
                    serviceProviderData[0].setDataValue('review_list', reviewlist);
                    serviceProviderData[0].setDataValue('review_count', reviewlist.length);
                } else {
                    serviceProviderData[0].setDataValue('review_list', []);
                    serviceProviderData[0].setDataValue('review_count', 0);
                }

                const poorRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.service_provider_id,
                        rating: 1,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });

                const belowAverageRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.service_provider_id,
                        rating: 2,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });

                const averageRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.service_provider_id,
                        rating: 3,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });

                const goodRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.service_provider_id,
                        rating: 4,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });

                const excellentRating = await Review.findAll({
                    attributes: ['id'],
                    where: {
                        product_id: req.service_provider_id,
                        rating: 5,
                        status: 1,
                        role: 2,
                        is_deleted: 0,
                    },
                });
                const isFollowData = await Follow.findAll({
                    attributes: ['id'],
                    where: {
                        user_id: req.user_id,
                        follower_id: serviceProviderData[0].user_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });



                const planBuyDetails = await PlanBuyDetails.findAll({
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
                                'no_images',
                                'storage',
                                'storage_type',
                                'type',
                                'guj_benefit',
                                'benefit',
                                'guj_payment',
                                'payment_procedure',
                                'monthly_price',
                                'yearly_price',
                                'is_free',
                            ],
                        },
                    ],
                    where: {
                        store_service_id: req.service_provider_id,
                        user_id: req.user_id,
                        status: 1,
                        is_deleted: 0,
                    },
                });

                serviceProviderData[0].setDataValue('buy_subscription_plan', (planBuyDetails.length > 0) ? planBuyDetails[0] : {});
                serviceProviderData[0].setDataValue('buy_subscription_plan', (planBuyDetails.length > 0) ? planBuyDetails[0] : {});
                serviceProviderData[0].setDataValue('is_follow', isFollowData.length > 0 ? 1 : 0);
                serviceProviderData[0].setDataValue('poor_rating', poorRating.length);
                serviceProviderData[0].setDataValue('below_average_rating', belowAverageRating.length);
                serviceProviderData[0].setDataValue('average_rating', averageRating.length);
                serviceProviderData[0].setDataValue('good_rating', goodRating.length);
                serviceProviderData[0].setDataValue('excellent_rating', excellentRating.length);
                serviceProviderData[0].setDataValue('view_count', serviceProviderData[0].view_count + 1);

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_service_provider_success'),
                    serviceProviderData[0]
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_service_provider_fail'), null);
            }
        } catch (error) {
            console.log(error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get similar products
     * @param {request} req
     * @param {Function} res
     */
    async getSimilarProducts(req, res) {
        try {
            const productData = await Product.findAll({
                order: [['id', 'DESC']],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                include: [
                    {
                        attributes: [],
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
                where: {
                    id: { [Op.ne]: req.product_id },
                    category_id: req.category_id,
                    ...(req.subcategory_id != null && req.subcategory_id !== '') && { subcategory_id: req.subcategory_id },
                    status: 1,
                    is_deleted: 0,
                },

            });

            if (productData.length > 0) {
                for (const item of productData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), productData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get top categories
     * @param {request} req
     * @param {Function} res
     */
    async getTopCategories(req, res) {
        try {
            const topCategoriesRaw = await Product.findAll({
                attributes: [
                    'category_id',
                    [SequelizePakcage.fn('AVG', SequelizePakcage.col('avg_rating')), 'avg_rating'],
                ],
                include: [
                    {
                        model: ProductCategory,
                        as: 'categorydata',
                        attributes: ['en_name', 'guj_name'],
                    },
                ],
                group: ['category_id', 'categorydata.id'],
                order: [[SequelizePakcage.fn('AVG', SequelizePakcage.col('avg_rating')), 'DESC']],
                limit: 3,
                raw: true,
            });

            const topCategories = topCategoriesRaw.map(item => ({
                category_id: item.category_id,
                avg_rating: item.avg_rating,
                en_name: item['categorydata.en_name'],
                guj_name: item['categorydata.guj_name'],
            }));

            // const topCategories = await Product.findAll({
            //     attributes: [
            //         'category_id',
            //         [SequelizePakcage.fn('AVG', SequelizePakcage.col('avg_rating')), 'avg_rating_avg'],
            //     ],
            //     group: ['category_id'],
            //     order: [[SequelizePakcage.fn('AVG', SequelizePakcage.col('avg_rating')), 'DESC']],
            //     limit: 3,
            // });

            if (topCategories.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), topCategories);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to user home page
     * @param {request} req
     * @param {Function} res
     */
    async homePage(req, res) {
        try {
            // const categoryIdCondition =
            //     req.category_id != undefined && req.category_id != 0
            //         ? {
            //             category_id: req.category_id,
            //         }
            //         : {};

            const storeData = await UserDetails.findAll({
                attributes: ['id'],
                where: {
                    market_place_id: req.market_place_id,
                    type: 'store',
                    status: 1,
                    is_deleted: 0,
                    ...(req.category_id != undefined && req.category_id != 0) && { category_id: req.category_id }
                },
            });

            const storeIdArray = storeData.map(data => data.id);

            const topRatingProductData = await Product.findAll({
                order: [['avg_rating', 'DESC']],
                limit: 5,
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
                    'avg_rating',
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    store_id: {
                        [Op.in]: storeIdArray,
                    },
                    status: 1,
                    is_deleted: 0,
                    //...categoryIdCondition,
                },
                include: [
                    {
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
            });

            if (topRatingProductData.length > 0) {
                for (const item of topRatingProductData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);

                    const isLikeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: {
                            ...(req.user_id != undefined) && { user_id: req.user_id },
                            product_id: item.id, status: 1, is_deleted: 0
                        },
                    });

                    item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                }
            }

            const mostTradingProductData = await Product.findAll({
                order: [['total_like', 'DESC']],
                limit: 5,
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
                    'avg_rating',
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    store_id: {
                        [Op.in]: storeIdArray,
                    },
                    status: 1,
                    is_deleted: 0,
                    //...categoryIdCondition,
                },
                include: [
                    {
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
            });

            if (mostTradingProductData.length > 0) {
                for (const item of mostTradingProductData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);

                    const isLikeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: {
                            ...(req.user_id != undefined) && { user_id: req.user_id },
                            product_id: item.id, status: 1, is_deleted: 0
                        },
                    });

                    item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                }
            }

            const newProductData = await Product.findAll({
                order: [['id', 'DESC']],
                limit: 5,
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
                    'avg_rating',

                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                where: {
                    store_id: {
                        [Op.in]: storeIdArray,
                    },
                    status: 1,
                    is_deleted: 0,
                    //...categoryIdCondition,
                },
                include: [
                    {
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
            });

            if (newProductData.length > 0) {
                for (const item of newProductData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('images', imagesData);

                    const isLikeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: {
                            ...(req.user_id != undefined) && { user_id: req.user_id },
                            product_id: item.id, status: 1, is_deleted: 0
                        },
                    });

                    item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                }
            }

            const productDetails = {
                top_rating_products: topRatingProductData,
                top_trading_products: mostTradingProductData,
                new_products: newProductData,
            };
            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                t('rest_keywords_get_home_page_product_success'),
                productDetails
            );
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user home page all products
     * @param {request} req
     * @param {Function} res
     */
    async getAllProducts(req, res) {
        try {
            const storeData = await UserDetails.findAll({
                attributes: ['id'],
                where: {
                    market_place_id: req.market_place_id,
                    type: 'store',
                    status: 1,
                    is_deleted: 0,
                    ...(req.store_category_id != null && req.store_category_id != '') && { "category_id": req.store_category_id }
                },
            });

            const storeIdArray = storeData.map(data => data.id);
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            details: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.en_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.guj_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),

                    ],
                };
            }


            if (req.price_range_start != null && req.price_range_start !== '' && req.price_range_end != null && req.price_range_end) {
                whereLikeConditions.price = {
                    [Op.between]: [parseFloat(req.price_range_start), parseFloat(req.price_range_end)],
                };
            }


            if (req.category_id != null && req.category_id !== '') {
                whereLikeConditions.category_id = req.category_id;
            }

            if (req.subcategory_id != null && req.subcategory_id !== '') {
                whereLikeConditions.subcategory_id = req.subcategory_id;
            }

            if (req.is_product == '1') {
                const topRatingProductData = await Product.findAll({
                    order: [
                        ['avg_rating', 'DESC'],
                        ...(req.is_price != null && req.is_price !== ''
                            ? [['price', req.is_price == 1 ? 'DESC' : 'ASC']]
                            : []),
                    ],
                    limit: req.record_count,
                    offset: req.limit,
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
                        'avg_rating',
                        [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                        [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                    ],
                    where: {
                        store_id: {
                            [Op.in]: storeIdArray,
                        },
                        status: 1,
                        is_deleted: 0,
                        ...whereLikeConditions,
                    },
                    include: [
                        {
                            model: ProductSubCategory,
                            as: 'subcategorydata',
                        },
                    ],
                });

                if (topRatingProductData.length > 0) {
                    for (const item of topRatingProductData) {
                        const imagesData = await ProductImages.findAll({
                            attributes: [
                                'id',
                                [
                                    SequelizePakcage.fn(
                                        'CONCAT',
                                        GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS,
                                        SequelizePakcage.col('image')
                                    ),
                                    'image',
                                ],
                            ],
                            where: { product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('images', imagesData);

                        const isLikeData = await ProductLikes.findAll({
                            attributes: ['id'],
                            where: { user_id: req.user_id, product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                    }

                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_get_home_page_product_success'),
                        topRatingProductData
                    );
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        t('rest_keywords_get_home_page_product_fail'),
                        null
                    );
                }
            } else if (req.is_product == '2') {
                const mostTradingProductData = await Product.findAll({
                    order: [['total_like', 'DESC']],
                    limit: req.record_count,
                    offset: req.limit,
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
                        'avg_rating',
                        [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                        [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                    ],
                    where: {
                        store_id: {
                            [Op.in]: storeIdArray,
                        },
                        status: 1,
                        is_deleted: 0,
                        ...whereLikeConditions, // Add search text conditions if available
                    },
                    include: [
                        {
                            model: ProductSubCategory,
                            as: 'subcategorydata',
                        },
                    ],
                });

                if (mostTradingProductData.length > 0) {
                    for (const item of mostTradingProductData) {
                        const imagesData = await ProductImages.findAll({
                            attributes: [
                                'id',
                                [
                                    SequelizePakcage.fn(
                                        'CONCAT',
                                        GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS,
                                        SequelizePakcage.col('image')
                                    ),
                                    'image',
                                ],
                            ],
                            where: { product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('images', imagesData);

                        const isLikeData = await ProductLikes.findAll({
                            attributes: ['id'],
                            where: { user_id: req.user_id, product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                    }
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_get_home_page_product_success'),
                        mostTradingProductData
                    );
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        t('rest_keywords_get_home_page_product_fail'),
                        null
                    );
                }
            } else {
                const newProductData = await Product.findAll({
                    order: [['id', 'DESC']],
                    limit: req.record_count,
                    offset: req.limit,
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
                        'avg_rating',
                        [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                        [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                    ],
                    where: {
                        store_id: {
                            [Op.in]: storeIdArray,
                        },
                        status: 1,
                        is_deleted: 0,
                        ...whereLikeConditions,
                    },
                    include: [
                        {
                            model: ProductSubCategory,
                            as: 'subcategorydata',
                        },
                    ],
                });

                if (newProductData.length > 0) {
                    for (const item of newProductData) {
                        const imagesData = await ProductImages.findAll({
                            attributes: [
                                'id',
                                [
                                    SequelizePakcage.fn(
                                        'CONCAT',
                                        GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS,
                                        SequelizePakcage.col('image')
                                    ),
                                    'image',
                                ],
                            ],
                            where: { product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('images', imagesData);

                        const isLikeData = await ProductLikes.findAll({
                            attributes: ['id'],
                            where: { user_id: req.user_id, product_id: item.id, status: 1, is_deleted: 0 },
                        });

                        item.setDataValue('is_liked', isLikeData.length > 0 ? 1 : 0);
                    }
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_get_home_page_product_success'),
                        newProductData
                    );
                } else {
                    return middleware.sendApiResponse(
                        res,
                        CODES.ERROR,
                        t('rest_keywords_get_home_page_product_fail'),
                        null
                    );
                }
            }
        } catch (error) {
            console.log('error', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user store list
     * @param {request} req
     * @param {Function} res
     */
    async getUserStoreList(req, res) {
        try {
            console.log('req: ', req);
            const storeCategoryData = await StoreCategory.findAll({
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    [SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('image')), 'image'],
                ],
                where: { role: '1', status: 1, is_deleted: 0 },
            });

            if (storeCategoryData.length > 0) {
                let whereLikeConditions = {};
                // Check if search_text is provided
                if (req.search_text != null && req.search_text !== '') {
                    whereLikeConditions = {
                        [Op.or]: [
                            {
                                en_name: {
                                    [Op.like]: `%${req.search_text}%`,
                                },
                            },
                            {
                                guj_name: {
                                    [Op.like]: `%${req.search_text}%`,
                                },
                            },
                        ],
                    };
                }

                for (const item of storeCategoryData) {
                    const storeData = await UserDetails.findAll({
                        order: [
                            ['is_sorting', 'DESC'],
                            ['updatedAt', 'ASC']
                        ],
                        limit: 5,
                        attributes: [
                            'id',
                            'category_id',
                            'subscription_id',
                            'used_space',
                            'storage_limit',
                            'user_id',
                            'en_name',
                            'guj_name',
                            [col('marketplacedata.name'), 'market_place_name'],
                            [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('image')),
                                'store_image',
                            ],
                        ],
                        where: {
                            category_id: item.id,
                            type: 'store',
                            status: 1,
                            is_deleted: 0,
                            is_approved: 1,
                            ...(req.market_place_id != null && req.market_place_id !== '') && { market_place_id: req.market_place_id },
                            ...whereLikeConditions,
                        },
                        include: [
                            {
                                model: MarketPlace,
                                as: 'marketplacedata',
                            },
                        ],
                    });

                    for (const itemm of storeData) {
                        const followerData = await Follow.findAll({
                            attributes: ['id'],
                            where: { follower_id: itemm.id, role: '1', status: 1, is_deleted: 0 },
                        });

                        itemm.setDataValue('total_followers', followerData.length);

                        const productData = await Product.findAll({
                            attributes: ['id'],
                            where: { store_id: itemm.id, status: 1, is_deleted: 0 },
                        });

                        let productIdArray = [];
                        const productsData = productData.map(data => productIdArray.push(data.id));

                        const avgRating = await Product.findOne({
                            attributes: [[fn('AVG', col('avg_rating')), 'avg_rating']],
                            where: {
                                id: {
                                    [Op.in]: productIdArray,
                                },
                                status: 1,
                                is_deleted: 0,
                            },
                            raw: true,
                        });

                        let rating = parseFloat(avgRating.avg_rating > 0 ? avgRating.avg_rating : 0);
                        let avg_rating = rating.toFixed(2);
                        itemm.setDataValue('avg_rating', avg_rating);
                    }

                    item.setDataValue('store_list', storeData);
                }

                // const filteredData = storeCategoryData.filter(item => Array.isArray(item.store_list) && item.store_list.length > 0);
                const filteredData = storeCategoryData.filter(
                    (category) => category.dataValues.store_list.length > 0
                );
                if (filteredData.length > 0) {
                    return middleware.sendApiResponse(
                        res,
                        CODES.SUCCESS,
                        t('rest_keywords_get_user_store_list_success'),
                        filteredData
                    );
                };
                return middleware.sendApiResponse(
                    res,
                    CODES.NOT_FOUND,
                    t('rest_keywords_nodata'),
                    null
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_user_store_list_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user all store list
     * @param {request} req
     * @param {Function} res
     */
    async getAllUserStoreList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            en_name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            guj_name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                    ],
                };
            }
            const storeData = await UserDetails.findAll({
                order: [
                    ['is_sorting', 'DESC'],
                    ['updatedAt', 'ASC']
                ],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'user_id',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'category_id',
                    'en_name',
                    'guj_name',
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('image')),
                        'store_image',
                    ],
                ],
                where: {
                    category_id: req.category_id,
                    type: 'store',
                    status: 1,
                    ...(req.market_place_id != null && req.market_place_id !== '') && { market_place_id: req.market_place_id },
                    is_deleted: 0,
                    is_approved: 1,
                    ...whereLikeConditions,
                },
                include: [
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },
                ],
            });

            if (storeData.length > 0) {
                for (const itemm of storeData) {
                    const followerData = await Follow.findAll({
                        attributes: ['id'],
                        where: { follower_id: itemm.id, role: '1', status: 1, is_deleted: 0 },
                    });

                    itemm.setDataValue('total_followers', followerData.length);

                    const productData = await Product.findAll({
                        attributes: ['id'],
                        where: { store_id: itemm.id, status: 1, is_deleted: 0 },
                    });

                    let productIdArray = [];
                    const productsData = productData.map(data => productIdArray.push(data.id));

                    const avgRating = await Product.findOne({
                        attributes: [[fn('AVG', col('avg_rating')), 'avg_rating']],
                        where: {
                            id: {
                                [Op.in]: productIdArray,
                            },
                            status: 1,
                            is_deleted: 0,
                        },
                        raw: true,
                    });

                    let rating = parseFloat(avgRating.avg_rating > 0 ? avgRating.avg_rating : 0);
                    let avg_rating = rating.toFixed(2);
                    itemm.setDataValue('avg_rating', avg_rating);
                }

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_user_store_list_success'),
                    storeData
                );
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_get_user_store_list_fail'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user service provider list
     * @param {request} req
     * @param {Function} res
     */
    async getUserServiceProviderList(req, res) {
        try {
            const serviceProviderCategoryData = await StoreCategory.findAll({
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'role',
                    [SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('image')), 'image'],
                ],
                where: { role: '2', status: 1, is_deleted: 0 },
            });

            if (serviceProviderCategoryData.length > 0) {
                let whereLikeConditions = {};
                // Check if search_text is provided
                if (req.search_text != null && req.search_text !== '') {
                    whereLikeConditions = {
                        [Op.or]: [
                            {
                                en_name: {
                                    [Op.like]: `%${req.search_text}%`,
                                },
                            },
                            {
                                guj_name: {
                                    [Op.like]: `%${req.search_text}%`,
                                },
                            },
                        ],
                    };
                }

                for (const item of serviceProviderCategoryData) {
                    const serviceProviderData = await UserDetails.findAll({
                        order: [
                            ['is_sorting', 'DESC'],
                            ['updatedAt', 'ASC']
                        ],
                        limit: 5,
                        attributes: [
                            'id',
                            'category_id',
                            'user_id',
                            'subscription_id',
                            'used_space',
                            'storage_limit',
                            'en_name',
                            'guj_name',
                            'en_work_details',
                            'guj_work_details',
                            [col('marketplacedata.name'), 'market_place_name'],
                            [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                            [
                                SequelizePakcage.fn(
                                    'CONCAT',
                                    GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO,
                                    SequelizePakcage.col('profile_image')
                                ),
                                'profile_image',
                            ],
                        ],
                        where: {
                            category_id: item.id,
                            type: 'service',
                            status: 1,
                            is_deleted: 0,
                            is_approved: 1,
                            ...(req.market_place_id != null && req.market_place_id !== '') && { market_place_id: req.market_place_id },
                            ...whereLikeConditions,
                        },
                        include: [
                            {
                                model: MarketPlace,
                                as: 'marketplacedata',
                            },
                        ],
                    });

                    for (const itemm of serviceProviderData) {
                        const followerData = await Follow.findAll({
                            attributes: ['id'],
                            where: { follower_id: itemm.user_id, role: '2', status: 1, is_deleted: 0 },
                        });

                        itemm.setDataValue('total_followers', followerData.length);

                        const isFollowData = await Follow.findAll({
                            attributes: ['id'],
                            where: { user_id: req.user_id, follower_id: itemm.user_id, status: 1, is_deleted: 0 },
                        });

                        itemm.setDataValue('is_follow', isFollowData.length > 0 ? 1 : 0);
                    }

                    item.setDataValue('service_provider_list', serviceProviderData);
                }

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_user_service_provider_list_success'),
                    serviceProviderCategoryData
                );
            } else {
                return middleware.sendApiResponse(
                    res,
                    CODES.ERROR,
                    t('rest_keywords_get_user_service_provider_list_fail'),
                    null
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to get user all service provider list
     * @param {request} req
     * @param {Function} res
     */
    async getAllUserServiceProviderList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            en_name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            guj_name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                    ],
                };
            }

            const serviceProviderCategoryData = await UserDetails.findAll({
                order: [
                    ['is_sorting', 'DESC'],
                    ['updatedAt', 'ASC']
                ],
                limit: req.record_count,
                offset: req.limit,
                attributes: [
                    'id',
                    'category_id',
                    'user_id',
                    'en_name',
                    'subscription_id',
                    'used_space',
                    'storage_limit',
                    'guj_name',
                    'en_work_details',
                    'guj_work_details',
                    [col('marketplacedata.name'), 'market_place_name'],
                    [col('marketplacedata.guj_name'), 'guj_market_place_name'],
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PHOTO, SequelizePakcage.col('profile_image')),
                        'profile_image',
                    ],
                ],
                where: {
                    category_id: req.category_id,
                    ...(req.market_place_id != null && req.market_place_id !== '') && { market_place_id: req.market_place_id },
                    type: 'service',
                    status: 1,
                    is_deleted: 0,
                    is_approved: 1,
                    ...whereLikeConditions,
                },
                include: [
                    {
                        model: MarketPlace,
                        as: 'marketplacedata',
                    },
                ],
            });

            if (serviceProviderCategoryData.length > 0) {
                for (const item of serviceProviderCategoryData) {
                    const followerData = await Follow.findAll({
                        attributes: ['id'],
                        where: { follower_id: item.user_id, role: '2', status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('total_followers', followerData.length);

                    const isFollowData = await Follow.findAll({
                        attributes: ['id'],
                        where: { user_id: req.user_id, follower_id: item.user_id, status: 1, is_deleted: 0 },
                    });

                    item.setDataValue('is_follow', isFollowData.length > 0 ? 1 : 0);
                }

                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_get_user_service_provider_list_success'),
                    serviceProviderCategoryData
                );
            } else {
                return middleware.sendApiResponse(
                    res,
                    CODES.ERROR,
                    t('rest_keywords_get_user_service_provider_list_fail'),
                    null
                );
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },
    /**
     * Function to get user product list
     * @param {request} req
     * @param {Function} res
     */
    async getUserStoreProductList(req, res) {
        try {
            let whereLikeConditions = {};
            // Check if search_text is provided
            if (req.search_text != null && req.search_text !== '') {
                whereLikeConditions = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        {
                            details: {
                                [Op.like]: `%${req.search_text}%`,
                            },
                        },
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.en_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),
                        SequelizePakcage.where(SequelizePakcage.col('subcategorydata.guj_name'), {
                            [Op.like]: `%${req.search_text}%`,
                        }),
                    ],
                };
            }
            // Check for optional price range (between price_range_start and price_range_end)
            if (
                req.price_range_start != null &&
                req.price_range_start !== '' &&
                req.price_range_end != null &&
                req.price_range_end
            ) {
                whereLikeConditions.price = {
                    [Op.between]: [parseFloat(req.price_range_start), parseFloat(req.price_range_end)],
                };
            }

            // Check for optional category_id
            if (req.category_id != null && req.category_id !== '') {
                whereLikeConditions.category_id = req.category_id;
            }
            // Check for optional subcategory_id
            if (req.subcategory_id != null && req.subcategory_id !== '') {
                whereLikeConditions.subcategory_id = req.subcategory_id;
            }
            let orderBy = ['id', 'DESC'];
            if ((req.is_avg != null && req.is_avg != '') || req.is_avg == 0) {
                orderBy = ['avg_rating', req.is_avg == 1 ? 'DESC' : 'ASC'];
            }

            if ((req.is_price != null && req.is_price != '') || req.is_price == 0) {
                orderBy = ['price', req.is_price == 1 ? 'DESC' : 'ASC'];
            }
            console.log(req)
            const userData = await Product.findAll({
                order: [[orderBy]],
                limit: req.record_count,
                offset: req.limit,
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
                    'avg_rating',
                    [SequelizePakcage.col('subcategorydata.en_name'), 'en_sub_category_name'],
                    [SequelizePakcage.col('subcategorydata.guj_name'), 'guj_sub_category_name'],
                ],
                include: [
                    {
                        attributes: [],
                        model: ProductSubCategory,
                        as: 'subcategorydata',
                    },
                ],
                where: {
                    store_id: req.store_id,
                    is_deleted: 0,
                    status: 1,
                    ...whereLikeConditions,
                },
            });

            if (userData.length > 0) {
                for (const item of userData) {
                    const imagesData = await ProductImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.USER_PRODUCTS, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { product_id: item.id, status: 1, is_deleted: 0 },
                    });
                    const likeData = await ProductLikes.findAll({
                        attributes: ['id'],
                        where: {
                            user_id: req.user_id,
                            product_id: item.id, status: 1, is_deleted: 0
                        },
                    });

                    item.setDataValue('is_liked', likeData.length > 0 ? 1 : 0);
                    item.setDataValue('images', imagesData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * add product review
     * @param {request} req
     * @param {Function} res
     */
    async chatNotification(req, res) {
        try {
            const loginUserData = await User.findAll({
                attributes: ['id', 'language', 'is_notification', 'email', 'phone_no'],
                where: {
                    id: req.notification_data.uid
                },
            });
            // console.log('=====')
            // console.log(loginUserData)
            // console.log('=====')
            if (loginUserData[0].is_notification == 1) {
                NotificationModel.prepareNotificationChat({
                    sender_id: req.user_id,
                    receiver_id: req.notification_data.uid,
                    action_id: req.notification_data.extra.storeId,
                    lang: (loginUserData[0].language != undefined) ? loginUserData[0].language : GLOBALS.APP_LANGUAGE,
                    title: {
                        keyword: 'rest_chat_notification_title',
                        components: {},
                    },
                    tag: 'msg',
                    message: {
                        keyword: 'rest_chat_notification_msg',
                        components: { field: req.notification_data.msg },
                    },

                    field: JSON.stringify({ field: req.notification_data.msg }),
                    data: req.notification_data,
                    add_notification: 1,
                });
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_review_success'), null);
            } else {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_review_success'), null);
            }

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_review_fail'), null);
        }
    },
    /**
     * Function to get user product list
     * @param {request} req
     * @param {Function} res
     */
    async adBannerList(req, res) {
        try {

            let whereLikeConditions = {};
            if (req.market_place_id != null && req.market_place_id !== '') {
                whereLikeConditions.market_place_id = {
                    [Op.like]: `%${req.market_place_id}%`
                };
            }

            if (req.store_category_id != null && req.store_category_id !== '') {
                whereLikeConditions.store_category_id = {
                    [Op.like]: `%${req.store_category_id}%`
                };
            }

            if (req.page_name != null && req.page_name !== '') {
                whereLikeConditions.page_name = {
                    [Op.like]: `%${req.page_name}%`
                };
            }
            console.log('whereLikeConditions', whereLikeConditions)
            const userData = await AdManagers.findAll({
                //order: [['id', 'DESC']],
                order: SequelizePakcage.literal('RAND()'),
                limit: 1,
                attributes: [
                    'id',
                    'market_place_id',
                    'is_default',
                    'impression_count',
                    'click_count',
                    'store_category_id',
                    'role',
                    'ad_sponser',
                    'page_name',
                    'start_date',
                    'end_date',
                    'price',
                    'ad_status',
                    'redirect_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                    ad_status: 2,
                    ...whereLikeConditions
                },
            });

            if (userData.length > 0) {
                await AdManagers.update(
                    { impression_count: userData[0].impression_count + 1 },
                    {
                        where: {
                            id: userData[0].id,
                        }
                    }
                );
                for (const item of userData) {
                    const imagesData = await AddManagerImages.findAll({
                        attributes: [
                            'id',
                            [
                                SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.ADS_BANNER_IMAGES, SequelizePakcage.col('image')),
                                'image',
                            ],
                        ],
                        where: { add_manager_id: item.id, status: 1, is_deleted: 0 },
                    });
                    item.setDataValue('images', imagesData);

                    const socialData = await AdSocialMedias.findAll({
                        attributes: [
                            'id',
                            'url',
                            'type',
                            'ads_id',
                        ],
                        where: { ads_id: item.id },
                    });
                    item.setDataValue('social_media', socialData);
                }
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                //default ads fetch

                const userData = await AdManagers.findAll({
                    order: [['id', 'DESC']],
                    limit: 1,
                    attributes: [
                        'id',
                        'market_place_id',
                        'is_default',
                        'impression_count',
                        'click_count',
                        'store_category_id',
                        'role',
                        'page_name',
                        'start_date',
                        'end_date',
                        'price',
                        'ad_status',
                        'redirect_id',
                        'status',
                        'is_deleted',
                        'createdAt',
                        'updatedAt',
                    ],
                    where: {
                        is_deleted: 0,
                        status: 1,
                        is_default: 1,
                    },
                });

                if (userData.length > 0) {
                    await AdManagers.update(
                        { impression_count: userData[0].impression_count + 1 },
                        {
                            where: {
                                id: userData[0].id,
                            }
                        }
                    );
                    for (const item of userData) {
                        const imagesData = await AddManagerImages.findAll({
                            attributes: [
                                'id',
                                [
                                    SequelizePakcage.fn('CONCAT', GLOBALS.IMAGE_BASE_URL + GLOBALS.ADS_BANNER_IMAGES, SequelizePakcage.col('image')),
                                    'image',
                                ],
                            ],
                            where: { add_manager_id: item.id, status: 1, is_deleted: 0 },
                        });
                        item.setDataValue('images', imagesData);

                        const socialData = await AdSocialMedias.findAll({
                            attributes: [
                                'id',
                                'url',
                                'type',
                                'ads_id',
                            ],
                            where: { ads_id: item.id },
                        });
                        item.setDataValue('social_media', socialData);
                    }
                    return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
                } else {
                    return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
                }
            }
        } catch (error) {
            console.log('error', error)
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to send otp
     * @param {request} req
     * @param {Function} res
     */
    async sendOtpEditProfile(req, res) {
        try {
            const userData = await User.findAll({
                attributes: ['id', 'email', 'phone_no'],
                where: {
                    id: {
                        [Op.ne]: req.user_id,
                    },
                    is_deleted: 0,
                    ...(req.role != undefined && req.role != '' && { role: req.role }),
                    ...(req.phone_no != undefined && req.phone_no != '' && { phone_no: req.phone_no }),
                    ...(req.email != undefined && req.email != '' && { email: req.email }),
                },
            });
            const loginUserData = await User.findAll({
                attributes: ['id', 'email', 'phone_no'],
                where: {
                    id: req.user_id
                },
            });
            console.log(userData)
            if (userData.length > 0) {
                //already register
                if (req.email != null && req.email != '') {
                    return middleware.sendApiResponse(res, CODES.DUPLICATE_VALUE, t('rest_keywords_duplicate_email'), null);
                } else {
                    return middleware.sendApiResponse(res, CODES.DUPLICATE_VALUE, t('rest_keywords_duplicate_phonenumber'), null);
                }

            } else {
                const otpDetails = await OTP.findAll({
                    attributes: ['id'],
                    where: { functionality: 'updateProfile', email: loginUserData[0].email },
                });

                //const otpNumber = '1234';
                const otpNumber = Math.floor(1000 + Math.random() * 9000)

                if (otpDetails != undefined && otpDetails != null && otpDetails.length > 0) {
                    const updateOtp = await OTP.update({ otp: otpNumber }, { where: { id: otpDetails[0].id } });

                    const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                    const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, loginUserData[0].email, sendOtpTemplateLet)
                        .then(async (mailSent) => {
                            //console.log('mailSent=>', mailSent)
                            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);

                        });
                } else {
                    const otpParams = {
                        functionality: 'updateProfile',
                        email: loginUserData[0].email,
                        otp: otpNumber,
                    };

                    const addOtp = await OTP.create(otpParams);
                    const sendOtpTemplateLet = await sendOtpTemplate.sendMail({ otp: otpNumber });
                    const sendMail = await common.sendEmail('OTP' + '- ' + GLOBALS.APP_NAME, loginUserData[0].email, sendOtpTemplateLet)
                        .then(async (mailSent) => {
                            if (mailSent == 1) {
                                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_sendingotp_success'), null);
                            } else {
                                return middleware.sendApiResponse(res, CODES.ERROR, t("rest_lead_create_mail_not_sent_error"), null);
                            }
                        });
                }
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * add feedback
     * @param {request} req
     * @param {Function} res
     */
    async addFeeback(req, res) {
        try {
            const feedbackData = await Feedbacks.create({
                user_id: req.user_id,
                rating: req.rating,
                app_in_like: req.app_in_like,
                ...(req.comment != undefined && req.comment != '' && { comment: req.comment }),
            });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_feeback_success'), null);
        } catch (error) {
            console.log('error', error)
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_feeback_fail'), null);
        }
    },

    /**
     * add contactUs
     * @param {request} req
     * @param {Function} res
     */
    async addContactUs(req, res) {
        try {
            const contactData = await UserContactUs.create({
                user_id: req.user_id,
                en_name: req.en_name,
                guj_name: req.guj_name,
                email: req.email,
                phone: req.phone,
                comment: req.comment,
            });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_add_contacus_success'), null);
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_add_contacus_fail'), null);
        }
    },
    /**
     * Function to get user feedback reasons list
     * @param {request} req
     * @param {Function} res
     */
    async feedbackReasonsList(req, res) {
        try {
            const userData = await FeedbackReasons.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'en_name',
                    'guj_name',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                ],
                where: {
                    is_deleted: 0,
                    role: req.role,
                    status: 1,
                },
            });
            if (userData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), userData);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add impression count
     * @param {request} req
     * @param {Function} res
     */
    async addImpressionCount(req, res) {
        try {
            const userData = await AdManagers.findAll({
                order: [['id', 'DESC']],
                limit: 1,
                attributes: [
                    'id',
                    'market_place_id',
                    'is_default',
                    'impression_count',
                    'click_count',
                    'store_category_id',
                    'role',
                    'page_name',
                    'start_date',
                    'end_date',
                    'price',
                    'ad_status',
                    'redirect_id',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                    id: req.ads_id
                },
            });

            if (userData.length > 0) {
                await AdManagers.update(
                    { click_count: userData[0].click_count + 1 },
                    {
                        where: {
                            id: req.ads_id,
                        }
                    }
                );
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), null);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to add impression count
     * @param {request} req
     * @param {Function} res
     */
    async getContactDetails(req, res) {
        try {
            const userData = await ContactDetails.findAll({
                order: [['id', 'DESC']],
                limit: 1,
                attributes: [
                    'id',
                    'email',
                    'country_code',
                    'phone',
                    [
                        SequelizePakcage.fn('CONCAT', GLOBALS.CDN_S3_URL, "/", SequelizePakcage.col('image')),
                        'image',
                    ],
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                },
            });
            const socialData = await SocialLinks.findAll({
                order: [['id', 'DESC']],
                limit: 1,
                attributes: [
                    'id',
                    'instagram',
                    'facebook',
                    'youtube',
                    'status',
                    'is_deleted',
                    'createdAt',
                    'updatedAt',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,

                },
            });
            let resoonce = { "conatct_details": [], "social_links": (socialData.length > 0) ? socialData[0] : [] }
            if (userData.length > 0) {
                resoonce.conatct_details = userData[0];
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), resoonce);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), resoonce);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    /**
     * Function to check app version
     * @param {request} req
     * @param {Function} res
     */
    async checkAppVersion(req, res) {
        try {
            let whereCondition;
            req.version = req.version + '.0';
            if (req.device_type == 'A') {
                whereCondition = SequelizePakcage.literal(`INET_ATON(CONCAT(androidapp_version, '.0')) > INET_ATON('${req.version}')`);
            } else {
                whereCondition = SequelizePakcage.literal(`INET_ATON(CONCAT(iosapp_version, '.0')) > INET_ATON('${req.version}')`);
            }
            const appVersion = await AppVersions.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'androidapp_version',
                    'iosapp_version',
                    'type',
                    'en_message',
                    'guj_message',
                    'status',
                    'createdAt',
                    'is_deleted',
                ],
                where: {
                    [Op.and]: [
                        // whereCondition,
                        //{ role: req.role },
                        { status: 1 },
                        { is_deleted: 0 },
                    ]
                },
                limit: 1
            });

            if (appVersion.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), appVersion[0]);
            } else {
                return middleware.sendApiResponse(res, CODES.ERROR, t('rest_user_not_found'), null);
            }
        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    async getStoreCategorySubcategory(req, res) {
        try {
            // Fetch category data first
            const rawCatData = await UserDetails.findAll({
                attributes: [],
                where: {
                    id: req.store_id
                },
                include: [
                    {
                        model: StoreCategory,
                        as: 'categorydata',
                        attributes: ["id", "en_name", "guj_name"]
                    }
                ],
            });

            const categoryData = await Promise.all(
                rawCatData.map(async (item) => {
                    const category = item.categorydata;

                    const subCategoryData = await subCategory.findAll({
                        attributes: ["id", "en_name", "guj_name"],
                        where: {
                            category_id: category.id,
                        },
                    });

                    const subCategoryList = subCategoryData.map(sub => ({
                        id: sub.id,
                        en_name: sub.en_name,
                        guj_name: sub.guj_name,
                    }));

                    return {
                        id: category.id,
                        en_name: category.en_name,
                        guj_name: category.guj_name,
                        sub_category_data: subCategoryList,
                    };
                })
            );

            if (categoryData.length > 0) {
                return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_success'), categoryData[0]);
            };
            return middleware.sendApiResponse(res, CODES.ERROR, t('rest_keywords_nodata'), null);

        } catch (error) {
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },

    async getProductCategorySubcategory(req, res) {
        try {
            // Fetch category and subcategory data concurrently
            const [rawCatData] = await Promise.all([
                Product.findAll({
                    attributes: [
                        'category_id',
                        [fn('COUNT', col('tbl_products.id')), 'productCount']
                    ],
                    where: { store_id: req.store_id },
                    include: [
                        {
                            model: Category,
                            as: 'categorydata',
                            attributes: ["id", "en_name", "guj_name"]
                        }
                    ],
                    group: ['category_id']
                }),

            ]);

            const mainData = await Promise.all(
                rawCatData.map(async (item) => {
                    let a = {};
                    try {
                        const res = await Product.findAll({
                            attributes: [
                                'subcategory_id',
                                [fn('COUNT', col('tbl_products.id')), 'productCount']
                            ],
                            where: { store_id: req.store_id, category_id: item.category_id },
                            include: [
                                {
                                    model: subCategory,
                                    as: 'subcategorydata',
                                    attributes: ["id", "en_name", "guj_name"]
                                }
                            ],
                            group: ['subcategory_id'],
                        });
                        const plainRes = res.map(row => row.toJSON());
                        a = item.toJSON();
                        a.subcategory_data = plainRes.length ? plainRes : [];
                    } catch (err) {
                        a.subcategory_data = [];
                    }
                    return a;
                })
            );

            const formattedData = mainData.map(item => ({
                category_id: item.categorydata.id,
                en_name: item.categorydata.en_name,
                guj_name: item.categorydata.guj_name,
                subcategory_data: item.subcategory_data.map(subitem => ({
                  subcategory_id: subitem.subcategory_id,
                  en_name: subitem.subcategorydata.en_name,
                  guj_name: subitem.subcategorydata.guj_name,
                })),
              }));

            if (formattedData.length) {
                return middleware.sendApiResponse(
                    res,
                    CODES.SUCCESS,
                    t('rest_keywords_success'),
                    formattedData
                );
            }
            return middleware.sendApiResponse(
                res,
                CODES.ERROR,
                t('rest_keywords_nodata'),
                null
            );

        } catch (error) {
            console.log('error: ', error);
            return middleware.sendApiResponse(res, CODES.ERROR, error.message, null);
        }
    },
};

export default authModel;
