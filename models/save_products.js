import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';
import Store from './usersdetails.js';
import Product from './product.js';

const saveProducts = sequelize.define('tbl_save_products', {
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
    store_id: {
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

saveProducts.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

saveProducts.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'storedata',
    targetKey: 'id',
});

saveProducts.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'productdata',
    targetKey: 'id',
});

export default saveProducts;
