import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const appVersion = sequelize.define('tbl_app_versions', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },

    androidapp_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    iosapp_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    guj_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    en_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

export default appVersion;
