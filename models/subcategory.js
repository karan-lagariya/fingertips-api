import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import ProductCategory from './category.js';

const subCategory = sequelize.define('tbl_sub_categorys', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    store_category_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    category_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    en_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_name: {
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

subCategory.belongsTo(ProductCategory, {
    foreignKey: 'category_id',
    as: 'categorydata',
    targetKey: 'id',
});

export default subCategory;
