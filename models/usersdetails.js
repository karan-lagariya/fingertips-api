import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import Category from './store_category.js';
import MarketPlace from './market_place.js';
import User from './users.js';

const UserDetails = sequelize.define('tbl_user_details', {
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
    market_place_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    used_space: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    storage_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    category_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    type: {
        type: DataTypes.ENUM('store', 'service'),
        defaultValue: 'store',
    },
    en_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gstno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address_line_1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_line_2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    whatsapp_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    en_work_details: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_work_details: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_premium: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_approved: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_sorting: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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

UserDetails.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

UserDetails.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'categorydata',
    targetKey: 'id',
});

UserDetails.belongsTo(MarketPlace, {
    foreignKey: 'market_place_id',
    as: 'marketplacedata',
    targetKey: 'id',
});

export default UserDetails;
