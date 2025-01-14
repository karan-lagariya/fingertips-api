import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import MarketPlace from './market_place.js';

const AdManagers = sequelize.define('tbl_ad_managers', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    market_place_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_category_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },	
    sponsor_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sponsor_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    page_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    payment_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ad_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    ad_sponser: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
    },
    redirect_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    impression_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    click_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_default: {
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

AdManagers.belongsTo(MarketPlace, {
    foreignKey: 'market_place_id',
    as: 'marketplacedata',
    targetKey: 'id',
});


export default AdManagers;
