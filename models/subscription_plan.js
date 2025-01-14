import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const SubscriptionPlans = sequelize.define('tbl_subscription_plans', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guj_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_images: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    storage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storage_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(1, 2),
        defaultValue: 1,
    },
    benefit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_procedure: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guj_benefit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guj_payment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    monthly_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    yearly_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    is_free: {
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

export default SubscriptionPlans;
