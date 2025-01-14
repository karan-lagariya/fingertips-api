import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const ContactDetails = sequelize.define('tbl_contact_details', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
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

export default ContactDetails;
