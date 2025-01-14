import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import AdManagers from './ad_managers.js';

const addManagerImages = sequelize.define('tbl_ad_manager_images', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    add_manager_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    image: {
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

addManagerImages.belongsTo(AdManagers, {
    foreignKey: 'add_manager_id',
    as: 'addManagerImages',
    targetKey: 'id',
});

export default addManagerImages;
