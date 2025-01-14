import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import Users from './users.js';
import UsersDetails from './usersdetails.js';
import SubscriptionPlans from './subscription_plan.js';

const BuyPlans = sequelize.define('tbl_buy_plans', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },	
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    store_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER,
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
    is_premium: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan_details: {
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

BuyPlans.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

BuyPlans.belongsTo(UsersDetails, {
    foreignKey: 'store_service_id',
    as: 'storeservicedata',
    targetKey: 'id',
});

BuyPlans.belongsTo(SubscriptionPlans, {
    foreignKey: 'plan_id',
    as: 'plandata',
    targetKey: 'id',
});

export default BuyPlans;