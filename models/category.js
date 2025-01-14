import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import StoreCategory from './store_category.js';

const Category = sequelize.define('tbl_categorys', {
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
    en_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.TINYINT,
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

Category.belongsTo(StoreCategory, {
    foreignKey: 'store_category_id',
    as: 'storecategorydata',
    targetKey: 'id',
});

export default Category;
