import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';
import Product from './product.js';

const review = sequelize.define('tbl_reviews', {
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
    product_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.TINYINT,
        allowNull: false,
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

review.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

review.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'productdata',
    targetKey: 'id',
});

export default review;
