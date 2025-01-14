const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Check current environment & fetch configurations as per that
if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: '.env.development'});
} else if (process.env.NODE_ENV === 'staging') {
    dotenv.config({path: '.env.staging'});
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({path: '.env.production'});
}

const GLOBALS = {
    KEY: process.env.API_ENC_KEY,
    IV: process.env.API_ENC_IV,
};

module.exports = GLOBALS;
