import Sequelize from 'sequelize';
import nodemailer from 'nodemailer';
import randtoken from 'rand-token';
import User from '../models/users.js';
import Admin from '../models/admins.js';
import userDevice from '../models/userdevice.js';
import adminDevice from '../models/admindevice.js';
import PlanBuyDetails from '../models/buy_plans.js';
import UserDetails from '../models/usersdetails.js';
import GLOBALS from './constants.js';
import AdManagers from '../models/ad_managers.js';
import adManagerTemplate from '../email-templates/adRunning.js';
import moment from 'moment';
import NotificationModel from './notification.js';


const Op = Sequelize.Op;
const fn = Sequelize.fn;

const common = {
    // function for check unique email
    async checkUniqueEmail(req) {
        try {
            const user = await User.findOne({
                attributes: ['id'],
                where: { email: req.email, is_deleted: 0, role: req.role },
            });

            const sendResponse = !(user != '' && user != null);
            return sendResponse;
        } catch (error) {
            return error;
        }
    },

    // function for check unique phone_no
    async checkPhoneUnique(req) {
        try {
            const user = await User.findOne({
                attributes: ['id'],
                where: { phone_no: req.phone_no, is_deleted: 0, role: req.role },
            });

            const sendResponse = !(user != '' && user != null);
            return sendResponse;
        } catch (error) {
            return error;
        }
    },

    // function for get user data by email id
    async getAdminDataByEmailId(email) {
        try {
            const admin = await Admin.findOne({
                attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'createdAt'],
                where: { email: email, status: 1, is_deleted: 0 },
            });
            return admin;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    },

    // function for generate random token for user
    async generateRandomToken(length) {
        return randtoken.generate(length, '0123456789abcdefghijklnmopqrstuvwxyz');
    },

    // function for get user data by email
    async getUserDataByEmailId(request) {
        try {
            const userData = await User.findOne({
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'login_status',
                    'is_available',
                    'is_notification',
                    'is_deleted',
                    'status',
                    'phone_no',
                    'dob',
                    'role',
                    'createdAt',
                    'is_verified',
                    [Sequelize.col('device_information.token'), 'token'],
                    [
                        Sequelize.fn('concat', GLOBALS.PROFILE_IMAGE_AWS_FOLDER_URL, Sequelize.col('profile_image')),
                        'profile_image',
                    ],
                ],
                where: { email: request.email, status: 1, is_deleted: 0, role: request.role },
                include: [{ model: userDevice, as: 'device_information', attributes: [] }],
            });
            return userData;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // function for get user data by phone number
    async getUserDataByPhoneNumber(country_code, phone_no, role) {
        try {
            const userData = await User.findOne({
                attributes: [
                    'id',
                    'en_full_name',
                    'guj_full_name',
                    'email',
                    'country_code',
                    'login_status',
                    'is_available',
                    'is_notification',
                    'is_deleted',
                    'status',
                    'phone_no',
                    'dob',
                    'role',
                    'createdAt',
                    'is_verified',
                    [Sequelize.col('device_information.token'), 'token'],
                    [
                        Sequelize.fn('concat', GLOBALS.PROFILE_IMAGE_AWS_FOLDER_URL, Sequelize.col('profile_image')),
                        'profile_image',
                    ],
                ],
                where: { country_code: country_code, phone_no: phone_no, status: 1, is_deleted: 0, role: role },
                include: [{ model: userDevice, as: 'device_information', attributes: [] }],
            });
            return userData;
        } catch (error) {
            // console.log(error.message);
            return null;
        }
    },

    // function for get admin data by id
    async getAdminDataById(user_id) {
        try {
            const adminData = await Admin.findOne({
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'login_status',
                    'profile_image',
                    'role',
                    'createdAt',
                ],
                where: { id: user_id, is_deleted: 0 },
            });

            const adminDeviceData = await adminDevice.findOne({
                attributes: ['id', 'token'],
                where: { admin_id: user_id },
            });

            adminData.setDataValue('token', adminDeviceData.token);
            return adminData;
        } catch (error) {
            return null;
        }
    },

    // function for get password only by id for admin
    async getAdminPasswordById(admin_id) {
        try {
            const adminData = await Admin.findOne({
                attributes: ['id', 'password'],
                where: { id: admin_id },
            });
            return adminData;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    },


    /*=============================================================================================================================
            Send email
    =============================================================================================================================*/

    async sendEmail(subject, to_email, message) {

        // var transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true, // true for 465, false for other ports
        //     auth: {
        //         user: GLOBALS.EMAIL_ID, // generated ethereal user
        //         pass: GLOBALS.EMAIL_PASS // generated ethereal password
        //     }
        // });
        const transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            port: 465,
            debug: true,
            auth: {
                user: GLOBALS.EMAIL_ID, // generated ethereal user
                pass: GLOBALS.EMAIL_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        //console.log(message);
        var mailOptions = {
            from: GLOBALS.APP_NAME + ' App <' + GLOBALS.FROM_EMAIL + '>', // sender address
            to: to_email, // list of receivers
            //to: 'jagdishdharviya@gmail.com',
            subject: subject, // Subject line
            html: message
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            //console.log(info);
            if (error) {
                console.log("ERROR FOUND :::::::: ++++++++++++++ ")
                console.log(error);
                return 0
            } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                return 1
            }


        });
    },
    async adsExpire() {
        console.log('adsExpire call the function')
        try {
            const userData = await AdManagers.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'is_default',
                    'sponsor_email',
                    'sponsor_name',
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
                    ad_status: 2,
                },
            });
            console.log('userData', userData[0])
            if (userData.length > 0) {
                let currentDate = moment().utc().format('YYYY-MM-DD')
                for (const item of userData) {
                    if (currentDate > item.end_date) {
                        await AdManagers.update(
                            { ad_status: 3, status: 0 },
                            {
                                where: {
                                    id: item.id,
                                }
                            }
                        );
                        const adManagerEmailTemplate = await adManagerTemplate.sendMailAdsExpire({ sponsorName: item.sponsor_name, impression_count: item.impression_count, click_count: item.click_count });

                        const sendMail = await common.sendEmail('Your Ad Campaign Has Ended: Performance Overview' + '- ' + GLOBALS.APP_NAME, item.sponsor_email, adManagerEmailTemplate);
                    }

                }
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    },
    async adsRunningStatusChange() {
        console.log('===========')
        console.log('ads running')
        try {
            const userData = await AdManagers.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'market_place_id',
                    'is_default',
                    'sponsor_email',
                    'sponsor_name',
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
                    ad_status: 1,
                },
            });

            if (userData.length > 0) {
                let currentDate = moment().utc().format('YYYY-MM-DD')
                for (const item of userData) {
                    if (currentDate >= item.start_date && currentDate <= item.end_date) {
                        await AdManagers.update(
                            { ad_status: 2 },
                            {
                                where: {
                                    id: item.id,
                                }
                            }
                        );
                        const adManagerEmailTemplate = await adManagerTemplate.sendMailAdsRunning({ sponsorName: item.sponsor_name, end_date: item.end_date });
                        const sendMail = await common.sendEmail('Your Ad is Now Live on ' + GLOBALS.APP_NAME + '!', item.sponsor_email, adManagerEmailTemplate)
                    }

                }
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    },

    async subscriptionPlanExpire() {
        try {
            const userData = await PlanBuyDetails.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'user_id',
                    'store_service_id',
                    'plan_id',
                    'is_premium',
                    'start_date',
                    'end_date',
                    'plan_details',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                },
            });

            if (userData.length > 0) {
                let currentDate = moment().utc().format('YYYY-MM-DD')
                for (const item of userData) {
                    if (currentDate > item.end_date) {
                        await PlanBuyDetails.update(
                            { status: 0 },
                            {
                                where: {
                                    id: item.id,
                                }
                            }
                        );
                        await UserDetails.update(
                            {
                                is_sorting: 0,
                                is_premium: 0,
                            },
                            {
                                where: {
                                    id: item.store_service_id,
                                }
                            }
                        );
                        const loginUserData = await User.findAll({
                            attributes: ['id', 'is_notification', 'language', 'email', 'phone_no'],
                            where: {
                                id: item.user_id
                            },
                        });

                        if (loginUserData[0].is_notification == 1) {
                            NotificationModel.prepareNotification({
                                sender_id: item.user_id,
                                receiver_id: item.user_id,
                                action_id: item.store_service_id,
                                lang: (loginUserData[0].language != undefined) ? loginUserData[0].language : GLOBALS.APP_LANGUAGE,
                                title: {
                                    keyword: 'rest_expired_plan_title',
                                    components: {},
                                },
                                tag: 'expired_plan',
                                message: {
                                    keyword: 'rest_expired_plan_msg',
                                    components: {},
                                },
                                add_notification: 1,
                            });
                        }
                    }

                }
                return 1;

            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    },

    async subscriptionPlanSevenDayBeforeExpire() {
        try {
            const userData = await PlanBuyDetails.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'user_id',
                    'store_service_id',
                    'plan_id',
                    'is_premium',
                    'start_date',
                    'end_date',
                    'plan_details',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                },
            });

            if (userData.length > 0) {
                let currentDate = moment().utc().format('YYYY-MM-DD');
                let datePlusSevenDays = moment(currentDate).add(7, 'days').format('YYYY-MM-DD');

                for (const item of userData) {
                    if (datePlusSevenDays == item.end_date) {
                        const loginUserData = await User.findAll({
                            attributes: ['id', 'is_notification', 'language', 'email', 'phone_no'],
                            where: {
                                id: item.user_id
                            },
                        });
                        if (loginUserData[0].is_notification == 1) {
                            NotificationModel.prepareNotification({
                                sender_id: item.user_id,
                                receiver_id: item.user_id,
                                action_id: item.store_service_id,
                                lang: (loginUserData[0].language != undefined) ? loginUserData[0].language : GLOBALS.APP_LANGUAGE,
                                title: {
                                    keyword: 'rest_expired_plan_seven_day_before_title',
                                    components: {},
                                },
                                tag: 'expired_plan',
                                message: {
                                    keyword: 'rest_expired_plan_seven_day_before_msg',
                                    components: {},
                                },
                                add_notification: 1,
                            });

                        }
                    }
                }
                return 1;

            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    },

    async autoDeleteUser() {
        try {
            const userData = await User.findAll({
                order: [['id', 'DESC']],
                attributes: [
                    'id',
                    'last_login',
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                },
            });

            if (userData.length > 0) {
                const currentDate = moment();

                for (const item of userData) {
                    const lastLoginDate = moment(item.last_login);
                    if (currentDate.diff(lastLoginDate, 'months') >= 6) {
                        await User.update(
                            {
                                status: 0,
                            },
                            {
                                where: {
                                    id: item.id,
                                }
                            }
                        );

                        console.log(`User ID ${item.id} has been deleted due to inactivity.`);
                    }
                }

                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    },
};

export default common;
