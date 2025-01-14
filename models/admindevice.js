import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const adminDevice = sequelize.define('tbl_admin_device_informations', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    admin_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    device_type: {
        type: DataTypes.ENUM('W', 'A', 'I'),
        defaultValue: 'W',
        comment: 'W => Web(ReactJs), A => Android, I => Iphone',
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    },
});

export default adminDevice;
