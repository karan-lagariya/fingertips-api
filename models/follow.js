import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';
import User from './users.js';

const follow = sequelize.define('tbl_follows', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: DataTypes.TINYINT,
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

follow.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userdata',
    targetKey: 'id',
});

follow.belongsTo(User, {
    foreignKey: 'follower_id',
    as: 'followerdata',
    targetKey: 'id',
});

export default follow;
