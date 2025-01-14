import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import adminDevice from './admindevice.js';

const Admin = sequelize.define('tbl_admins', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    login_status: {
        type: DataTypes.ENUM('Online', 'Offline'),
        defaultValue: 'Offline',
    },
    last_login: {
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

export default Admin;
