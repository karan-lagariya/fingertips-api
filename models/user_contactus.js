import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';


const userContacts = sequelize.define('tbl_user_contacts', {
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
    en_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guj_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_pending: {
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

userContacts.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

export default userContacts;
