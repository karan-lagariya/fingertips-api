import Sequelize from 'sequelize';
import userDevice from '../models/userdevice.js';
import Notification from '../models/notification.js';
import GLOBALS from './constants.js';
import admin from 'firebase-admin';
import headerFile from '../middleware/headerValidator.js';
import path from 'path';
import moment from 'moment';
import {fileURLToPath} from 'url';

const Op = Sequelize.Op;
// Initialize Firebase Admin SDK
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = path.resolve(__dirname, GLOBALS.JSON_FILE_FCM);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const common = {
    
    async prepareNotificationChat(data) {
        try {
            const userDeviceData = await userDevice.findOne({
                attributes: ['id', 'user_id', 'token', 'device_type', 'device_token'],
                where: {
                    user_id: data.receiver_id,
                    device_token: {[Op.ne]: null},
                },
            });
            if (userDeviceData != null) {
                let title = '';

                if (Object.keys(data.title.components).length === 0) {
                    headerFile.getMessage(data.lang, data.title.keyword.toString(), {}, function (formedmsg) {
                        title = formedmsg;
                    });
                } else {
                    headerFile.getMessage(
                        data.lang,
                        data.title.keyword.toString(),
                        data.title.components,
                        function (formedmsg) {
                            title = formedmsg;
                        }
                    );
                }
                let msg = '';
                if (Object.keys(data.message.components).length === 0) {
                    headerFile.getMessage(data.lang, data.message.keyword.toString(), {}, function (formedmsg) {
                        msg = formedmsg;
                    });
                } else {
                    headerFile.getMessage(
                        data.lang,
                        data.message.keyword.toString(),
                        data.message.components,
                        function (formedmsg) {
                            msg = formedmsg;
                        }
                    );
                }

                
                console.log(data)
                const message = {
                    notification: {
                        title: title,
                        body: msg,
                    },
                    data: {
                        action_id: data.action_id.toString(),
                        title: title,
                        body: msg,
                        tag: data.tag,
                        uid: data.data.uid, 
                        msg: data.data.msg, 
                        tag: data.data.tag, 
                        convId: data.data.extra.convId, 
                        name: data.data.extra.name, 
                        senderId: data.data.extra.uid, 
                        storeId: data.data.extra.storeId, 
                    },
                    token: userDeviceData.device_token, // FCM device token
                };
                console.log('==========');
                console.log(message);
                console.log('==========');
                admin
                    .messaging()
                    .send(message)
                    .then(response => {
                        console.log('Successfully sent message:', response);
                        return 1;
                    })
                    .catch(error => {
                        console.error('Error sending message:', error);
                        return 0;
                    });

                if (data.add_notification == 1) {
                    var notificationParams = {
                        sender_id: data.sender_id,
                        receiver_id: data.receiver_id,
                        action_id: data.action_id,
                        //title: title,
                        //message: msg,
                        title: data.title.keyword,
                        message: data.message.keyword,
                        tag: data.tag,
                        ...(data.field != undefined) && { "field": data.field },
                        ...(data.field_title != undefined) && { "field_title":data.field_title },
                        tag: data.tag,
                        createdAt:moment().utc().format('YYYY-MM-DD HH:mm:ss')
                    };

                    await Notification.create(notificationParams);
                }
            } else {
                console.error('token not found');
                return 0;
            }
        } catch (error) {
            console.error('catch:-', error);
            return 0;
        }
    },
    async prepareNotification(data) {
        try {
            const userDeviceData = await userDevice.findOne({
                attributes: ['id', 'user_id', 'token', 'device_type', 'device_token'],
                where: {
                    user_id: data.receiver_id,
                    device_token: {[Op.ne]: null},
                },
            });
            if (userDeviceData != null) {
                let title = '';

                if (Object.keys(data.title.components).length === 0) {
                    headerFile.getMessage(data.lang, data.title.keyword.toString(), {}, function (formedmsg) {
                        title = formedmsg;
                    });
                } else {
                    headerFile.getMessage(
                        data.lang,
                        data.title.keyword.toString(),
                        data.title.components,
                        function (formedmsg) {
                            title = formedmsg;
                        }
                    );
                }
                let msg = '';
                if (Object.keys(data.message.components).length === 0) {
                    headerFile.getMessage(data.lang, data.message.keyword.toString(), {}, function (formedmsg) {
                        msg = formedmsg;
                    });
                } else {
                    headerFile.getMessage(
                        data.lang,
                        data.message.keyword.toString(),
                        data.message.components,
                        function (formedmsg) {
                            msg = formedmsg;
                        }
                    );
                }

              
                const message = {
                    notification: {
                        title: title,
                        body: msg,
                    },
                    data: {
                        action_id: data.action_id.toString(),
                        title: title,
                        body: msg,
                        tag: data.tag,
                        custom_param_1: 'value1', // Add custom parameters here
                        custom_param_2: 'value2',
                    },
                    token: userDeviceData.device_token, // FCM device token
                };
                console.log('==========');
                console.log(message);
                console.log('==========');
                admin
                    .messaging()
                    .send(message)
                    .then(response => {
                        console.log('Successfully sent message:', response);
                        return 1;
                    })
                    .catch(error => {
                        console.error('Error sending message:', error);
                        return 0;
                    });

                if (data.add_notification == 1) {
                    console.log('moment()=>',moment().utc().format('YYYY-MM-DD HH:mm:ss'))
                    var notificationParams = {
                        sender_id: data.sender_id,
                        receiver_id: data.receiver_id,
                        action_id: data.action_id,
                        //title: title,
                        //message: msg,
                        title: data.title.keyword,
                        message: data.message.keyword,
                        tag: data.tag,
                        ...(data.field != undefined) && { "field": data.field },
                        ...(data.field_title != undefined) && { "field_title":data.field_title },
                        tag: data.tag,
                        createdAt:moment().utc().format('YYYY-MM-DD HH:mm:ss')
                        
                    };

                    await Notification.create(notificationParams);
                }
            } else {
                console.error('token not found');
                return 0;
            }
        } catch (error) {
            console.error('catch:-', error);
            return 0;
        }
    },
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    async prepareNotificationBulk(data) {
        try {
            const userDeviceData = await userDevice.findAll({
                attributes: ['id', 'user_id', 'token', 'device_type', 'device_token'],
                where: {
                    user_id: {
                        [Op.in]: data.multiple_user_id.split(',').map(id => Number(id)), // Split string and convert to array of numbers
                    },
                    device_token: {[Op.ne]: null},
                },
            });
            if (userDeviceData != null) {
                let title = data.title;
                let msg = data.message;

                // Prepare tokens in chunks (maximum allowed tokens per request is 500)
                const chunkedTokens = common.chunkArray(
                    userDeviceData.map(device => device.device_token),
                    500
                );
                
                for (let i = 0; i < chunkedTokens[0].length; i++) {
                    const tokens = chunkedTokens[0][i];
                    
                    const message = {
                        notification: {
                            title: title,
                            body: msg,
                        },
                        data: {
                            action_id: data.action_id.toString(),
                            title: title,
                            body: msg,
                            tag: data.tag,
                        },
                        token: tokens, // FCM device token
                    };
                    admin
                        .messaging()
                        .send(message)
                        .then(response => {
                            console.log('Successfully sent message:', response);
                            return 1;
                        })
                        .catch(error => {
                            console.error('Error sending message:', error);
                            return 0;
                        });

                    if (data.add_notification == 1) {
                        var notificationParams = {
                            sender_id: data.sender_id,
                            receiver_id: userDeviceData[i].user_id,
                            action_id: data.action_id,
                            title: title,
                            tag: data.tag,
                            message: msg,
                            createdAt:moment().utc().format('YYYY-MM-DD HH:mm:ss')
                        };

                        await Notification.create(notificationParams);
                    }
                }
            } else {
                console.error('token not found');
                return 0;
            }
        } catch (error) {
            console.error('catch:-', error);
            return 0;
        }
    },
};

export default common;
