import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import userDevice from './userdevice.js';

const User = sequelize.define('tbl_users', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    language: {
        type: DataTypes.ENUM('English', 'Gujarati'),
        defaultValue: 'English',
    },
    en_full_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_full_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_image: {
        type: DataTypes.STRING,
        defaultValue: 'default.png',
        allowNull: true,
    },
    role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_verified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_available: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    is_notification: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    login_status: {
        type: DataTypes.ENUM('Online', 'Offline'),
        defaultValue: 'Online',
    },
    app_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email_verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    forgot_password_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_login: {
        type: 'TIMESTAMP',
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        allowNull: true,
    },
    verifiedAt: {
        type: 'TIMESTAMP',
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        allowNull: true,
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        allowNull: false,
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        allowNull: false,
    },
});

User.hasOne(userDevice, {
    foreignKey: 'user_id',
    as: 'device_information', // alias for the association
});

export default User;
