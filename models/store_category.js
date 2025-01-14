import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const StoreCategory = sequelize.define('tbl_store_categorys', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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

export default StoreCategory;
