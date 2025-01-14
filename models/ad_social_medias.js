import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import AdManagers from './ad_managers.js';

const addManagerMedias = sequelize.define('tbl_ad_social_medias', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    ads_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
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

addManagerMedias.belongsTo(AdManagers, {
    foreignKey: 'ads_id',
    as: 'social_medias',
    targetKey: 'id',
});

export default addManagerMedias;
