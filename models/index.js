import Sequelize from 'sequelize';
import GLOBALS from '../app-config/constants.js';

// Database configurations
const sequelize = new Sequelize(GLOBALS.DATABASE_NAME, GLOBALS.DATABASE_USER, GLOBALS.DATABASE_PASSWORD, {
    host: GLOBALS.DATABASE_HOST,
    dialect: 'mysql',
    logging: true,
});

// Check database connected or not
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database: ', error);
    });

export default sequelize;
