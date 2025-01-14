import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import Category from './category.js';
import SubCategory from './subcategory.js';
import Store from './usersdetails.js';

const Products = sequelize.define('tbl_products', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    discount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    discount_type: {
        type: DataTypes.ENUM('flat', 'percentage'),
        defaultValue: 'flat',
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avg_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0.0,
    },
    total_like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    shape: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    material: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pattern: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    design: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sustainable: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    warranty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guarantee: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    replacement: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resale: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    details: {
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

Products.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'categorydata',
    targetKey: 'id',
});

Products.belongsTo(SubCategory, {
    foreignKey: 'subcategory_id',
    as: 'subcategorydata',
    targetKey: 'id',
});

Products.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'storedata',
    targetKey: 'id',
});

export default Products;
