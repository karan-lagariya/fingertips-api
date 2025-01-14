import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';

const Notification = sequelize.define('tbl_notifications', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    action_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    field: {
        type: DataTypes.STRING,
    },
    
    field_title: {
        type: DataTypes.STRING,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_read: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

Notification.belongsTo(User, {
    foreignKey: 'sender_id',
    as: 'userdata',
    targetKey: 'id',
});

export default Notification;
