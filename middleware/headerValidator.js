import CryptoJS from 'crypto-js';
import cryptoLib from 'cryptlib';
import localizify from 'localizify';
import Validator from 'Validator';
import GLOBALS from '../app-config/constants.js';
import CODES from '../app-config/status_code.js';

import userDeviceinfo from '../models/userdevice.js';
import adminDeviceinfo from '../models/admindevice.js';

import en from '../languages/en.js';
import guj from '../languages/guj.js';

const {default: local} = localizify;
const {t} = localizify;

var app_key = cryptoLib.getHashSha256(GLOBALS.KEY, 32);
const key = CryptoJS.enc.Hex.parse(GLOBALS.KEY); // 128-bit key in hex
const iv = CryptoJS.enc.Hex.parse(GLOBALS.IV); // 128-bit IV in hex
 
// method that not require token
const bypassMethod = [
    'signup',
    'login',
    'send-otp',
    'verify-otp',
    'new-password',
    'get-static-page-content',
    'get-market-place',
    'get-store-category',
    'imageUpload',
    'homePage',
    'get-user-store-product-list',
    'getProductDetails',
    'getSimilarProducts',
    'getReviewList',
    'getAllProducts',
    'get-save-product-user-list',
    'get-top-categories',
    'getUserStoreList',
    'getAllUserStoreList',
    'getUserServiceProviderList',
    'getAllUserServiceProviderList',
    'getServiceProviderDetails',
    'ad-banner-list',
    'get-store-details',
    'get-faqs-by-role',
    'get-product-category',
    'get-product-subcategory',
    'get-sponsorship-details',
    'feedback-reasons-list',
    'add-feeback',
    'add-contactus',
    'get-contact-details',
    'check-app-version',
    'add-impression-count',
    'get-s3bucket-url',
    'get-product-category-subcategory',
];
var is_admin;

/**
 * Function to extract header language
 * @param {Req} req
 * @param {Res} res
 * @param {Function} callback
 */
const extractHeaderLanguage = (req, res, callback) => {
    is_admin = req.headers['is_admin'] != undefined && req.headers['is_admin'] != '' ? req.headers['is_admin'] : '0';
    const language =
        req.headers['accept-language'] != undefined && req.headers['accept-language'] != ''
            ? req.headers['accept-language']
            : 'en';
    req.language = language;
    if (language == 'en') {
        req.language = en;
        local.add(language, en).setLocale('en');
    } else if (language == 'guj') {
        req.language = guj;
        local.add(language, guj).setLocale('guj');
    }
    callback();
};

/**
 * Function to validate header api key
 * @param {Req} req
 * @param {Res} res
 * @param {Function} callback
 */
const validateHeaderApiKey = (req, res, callback) => {
    try {
        if (req.headers['api-key'] != undefined && req.headers['api-key'] != '') {
            if (is_admin == 1) {
                var api_key =
                    req.headers['api-key'] != undefined && req.headers['api-key'] != ''
                        ? CryptoJS.AES.decrypt(req.headers['api-key'], key, {iv: iv}).toString(CryptoJS.enc.Utf8)
                        : '';
                if (api_key == GLOBALS.API_KEY) {
                    console.log('Api-Key is set', req.ip);
                    callback();
                } else {
                    sendResponse(
                        req,
                        res,
                        CODES.UNAUTHORIZED,
                        CODES.UNAUTHORIZED,
                        {keyword: t('rest_keywords_invalid_api_key'), components: {}},
                        null
                    );
                }
            } else {
                var api_key =
                    req.headers['api-key'] != undefined && req.headers['api-key'] != ''
                        ? cryptoLib.decrypt(req.headers['api-key'], app_key, GLOBALS.IV)
                        : '';
                if (api_key == GLOBALS.API_KEY) {
                    console.log('Api-Key is set: ', req.ip);
                    callback();
                } else {
                    sendResponse(
                        req,
                        res,
                        CODES.UNAUTHORIZED,
                        CODES.UNAUTHORIZED,
                        {keyword: t('rest_keywords_invalid_api_key'), components: {}},
                        null
                    );
                }
            }
        } else {
            sendResponse(
                req,
                res,
                CODES.UNAUTHORIZED,
                CODES.UNAUTHORIZED,
                {keyword: t('rest_keywords_apikey_not_found'), components: {}},
                null
            );
        }
    } catch (error) {
        console.log(error.message);
        sendResponse(req, res, CODES.UNAUTHORIZED, CODES.UNAUTHORIZED, {keyword: error.message, components: {}}, null);
    }
};

/**
 * Function to validate header token
 * @param {Req} req
 * @param {Res} res
 * @param {Function} callback
 */
const validateHeaderToken = async (req, res, callback) => {
    try {
        const pathData = req.path.split('/');
        console.log('***************************')
        console.log('pathData',pathData[4])
        console.log('***************************')
        if (bypassMethod.indexOf(pathData[4]) === -1) {
            if (req.headers['token'] != undefined && req.headers['token'] != '') {
                if (is_admin == 1) {
                    var headtoken = decData(req.headers.token);
                } else {
                    var headtoken = cryptoLib.decrypt(req.headers['token'], app_key, GLOBALS.IV).replace(/\s/g, '');
                }
                if (headtoken != undefined && headtoken != '') {
                    if (pathData[3] == 'admin') {
                        const adminDetails = await adminDeviceinfo.findOne({
                            attributes: ['admin_id', 'token'],
                            where: {token: headtoken},
                        });
                        if (adminDetails !== null && adminDetails !== undefined) {
                            req.admin_id = adminDetails.admin_id;
                            req.token = headtoken;
                            console.log('Admin details is set');
                            callback();
                        } else {
                            sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                        }
                    } else {
                        const userDetails = await userDeviceinfo.findOne({
                            attributes: ['user_id', 'token'],
                            where: {token: headtoken},
                        });
                        if (userDetails !== null && userDetails !== undefined) {
                            req.user_id = userDetails.user_id;
                            req.lang = req.headers['accept-language'] != undefined && req.headers['accept-language'] != ''? req.headers['accept-language']: 'en';
                            req.token = headtoken;
                            console.log('User details is set');
                            callback();
                        } else {
                            sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                        }
                    }
                } else {
                    sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                }
            } else {
                sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_token_not_found'), null);
            }
        } else {
            if (req.headers['token'] != undefined && req.headers['token'] != '') {
                if (is_admin == 1) {
                    var headtoken = decData(req.headers.token);
                } else {
                    var headtoken = cryptoLib.decrypt(req.headers['token'], app_key, GLOBALS.IV).replace(/\s/g, '');
                }
                if (headtoken != undefined && headtoken != '') {
                    if (pathData[3] == 'admin') {
                        const adminDetails = await adminDeviceinfo.findOne({
                            attributes: ['admin_id', 'token'],
                            where: {token: headtoken},
                        });
                        if (adminDetails !== null && adminDetails !== undefined) {
                            req.admin_id = adminDetails.admin_id;
                            req.token = headtoken;
                            console.log('Admin details is set');
                            callback();
                        } else {
                            sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                        }
                    } else {
                        const userDetails = await userDeviceinfo.findOne({
                            attributes: ['user_id', 'token'],
                            where: {token: headtoken},
                        });
                        if (userDetails !== null && userDetails !== undefined) {
                            req.user_id = userDetails.user_id;
                            req.lang = req.headers['accept-language'] != undefined && req.headers['accept-language'] != ''? req.headers['accept-language']: 'en';
                            req.token = headtoken;
                            console.log('User details is set');
                            callback();
                        } else {
                            sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                        }
                    }
                } else {
                    sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_tokeninvalid'), null);
                }
            } else {
                callback();
            }
        }
    } catch (error) {
        console.log(error.message);
        sendApiResponse(res, CODES.UNAUTHORIZED, error.message, null);
    }
};

/**
 * Function to check validation rules
 * @param {request} request
 * @param {rules} rules
 */
const checkValidationRules = (request, rules) => {
    try {
        const v = Validator.make(request, rules);
        const validator = {
            status: true,
        };
        if (v.fails()) {
            const ValidatorErrors = v.getErrors();
            validator.status = false;
            for (const key in ValidatorErrors) {
                validator.error = ValidatorErrors[key][0];
                break;
            }
        }
        return validator;
    } catch (error) {
        logger.error(error.message);
    }
    return false;
};

/**
 * Function to send response
 * @param {req} req
 * @param {res} res
 * @param {statuscode} statuscode
 * @param {responsecode} responsecode
 * @param {responsemessage} responsemessage
 * @param {response_data} response_data
 */
const sendResponse = (req, res, statuscode, responsecode, responsemessage, response_data) => {
    getMessage(req.lang, responsemessage.keyword, responsemessage.components, function (formedmsg) {
        if (response_data != null) {
            response_data = {code: responsecode, message: formedmsg, data: response_data};
            encryption(response_data, function (response) {
                res.status(statuscode);
                res.json(response);
            });
        } else {
            response_data = {code: responsecode, message: formedmsg};
            encryption(response_data, function (response) {
                res.status(statuscode);
                res.json(response);
            });
        }
    });
};

/**
 * Function to send response
 * @param {req} req
 * @param {res} res
 * @param {statuscode} statuscode
 * @param {responsecode} responsecode
 * @param {responsemessage} responsemessage
 * @param {response_data} response_data
 */
const sendApiResponse = (res, resCode, msgKey, resData) => {
    const responsejson = {
        code: resCode,
        message: msgKey,
    };
    if (resData != null) {
        responsejson.data = resData;
    }
    encryption(responsejson, function (response) {
        res.status(resCode);
        res.json(response);
    });
};

// Function to encryption & send response
const encData = data => {
    try {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }

        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
        }).toString();

        return encrypted;
    } catch (error) {
        // console.log('Encryption error:- ', error.message);
        return {};
    }
};

// Function to decryption & send response
const decData = data => {
    if (data != undefined) {
        const decrypted = CryptoJS.AES.decrypt(data, key, {
            iv: iv,
        });

        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
        let decryptionSend = decryptedData;
        try {
            decryptionSend = JSON.parse(decryptedData);
        } catch (error) {
            decryptionSend = decryptedData; // Return as string if not a valid JSON
        }
        return decryptionSend;
    } else {
        return {};
    }
};

/**
 * Function to get message
 * @param {requestLanguage} requestLanguage
 * @param {keywords} keywords
 * @param {components} components
 * @param {Function} callback
 */
const getMessage = (requestLanguage, keywords, components, callback) => {
    console.log('requestLanguage',requestLanguage)
    if(requestLanguage=='en' || requestLanguage=='English'){
        local.add('en', en).setLocale('en');
    }else{
        local.add('guj', guj).setLocale('guj');
    }
    const returnmessage = t(keywords, components);
    callback(returnmessage);
};

/**
 * Function is for decryption
 * @param {req} req
 * @param {Function} callback
 */
const decryption = (req, callback) => {
    if (is_admin == 1) {
        if (req != undefined && req.trim() != '') {
            const decrypted = CryptoJS.AES.decrypt(req, key, {
                iv: iv,
            });

            const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

            let decryptionSend = decryptedData;
            try {
                decryptionSend = JSON.parse(decryptedData);
            } catch (error) {
                decryptionSend = decryptedData; // Return as string if not a valid JSON
            }
            callback(decryptionSend);
        } else {
            callback({});
        }
    } else {
        if (req != undefined && Object.keys(req).length !== 0) {
            // console.log("------>",cryptoLib.decrypt(req, Key, GLOBALS.IV))
            var decryptedData = JSON.parse(cryptoLib.decrypt(req, app_key, GLOBALS.IV));
            // request.language = req.language;
            // request.user_id = req.user_id;
            // request.role = req.role;
            // console.log("decryption",request)
            callback(decryptedData);
        } else {
            callback({});
        }
    }
};

/**
 * Function is for encryption
 * @param {req} req
 * @param {Function} callback
 */
const encryption = (req, callback) => {
    if (is_admin == 1) {
        try {
            if (typeof req === 'object') {
                req = JSON.stringify(req);
            }
            const encrypted = CryptoJS.AES.encrypt(req, key, {
                iv: iv,
            }).toString();

            callback(encrypted);
        } catch (error) {
            // console.log('Encryption error:- ', error.message);
            callback({});
        }
    } else {
        var encrypted = cryptoLib.encrypt(JSON.stringify(req), app_key, GLOBALS.IV);
        callback(encrypted);
    }
};

export default {
    validateHeaderApiKey,
    extractHeaderLanguage,
    validateHeaderToken,
    checkValidationRules,
    sendResponse,
    decryption,
    encryption,
    getMessage,
    sendApiResponse,
    encData,
    decData,
};
