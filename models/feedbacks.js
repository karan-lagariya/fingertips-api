import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';


const feedbacks = sequelize.define('tbl_feedbacks', {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    app_in_like: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
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

feedbacks.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

export default feedbacks;
