import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('tbl_user_device_informations', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    device_type: {
        type: DataTypes.ENUM('W', 'A', 'I'),
        defaultValue: 'W',
        comment: 'W => Web(ReactJs), A => Android, I => Iphone',
    },
    device_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    os_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    device_model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    app_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        allowNull: false,
        type: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    updatedAt: {
        allowNull: false,
        type: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    },
});

export default User;
