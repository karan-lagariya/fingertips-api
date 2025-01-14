import moment from 'moment';
import DataTypes from 'sequelize';
import sequelize from './index.js';

const Faq = sequelize.define('tbl_faqs', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    question: {
        type: DataTypes.STRING,
        defaultValue: 0,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guj_question: {
        type: DataTypes.STRING,
        defaultValue: 0,
    },
    guj_answer: {
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

export default Faq;