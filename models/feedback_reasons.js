import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';



const feedback_reasons = sequelize.define('tbl_feedback_reasons', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    en_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guj_name: {
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


export default feedback_reasons;
