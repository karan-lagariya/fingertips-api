import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

// Check current environment & fetch configurations as per that
if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: '.env.development'});
} else if (process.env.NODE_ENV === 'staging') {
    dotenv.config({path: '.env.staging'});
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({path: '.env.production'});
}

const GLOBALS = {
    APP_ENVIRONMENT: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    API_KEY: process.env.API_KEY,
    ARROW_IMAGE: 'images/app_icon.png',
    DEFAULT_IMAGE: 'images/default.jpeg',
    BASE_URL: process.env.BASE_URL,
    PORT_BASE_URL: process.env.PORT_BASE_URL,
    PORT: process.env.PORT,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    KEY: process.env.API_ENC_KEY,
    IV: process.env.API_ENC_IV,
    JSON_FILE_FCM: process.env.JSON_FILE_FCM,
    TIME_ZONE: 'UTC',
    PER_PAGE: process.env.PER_PAGE,
    ADMIN_URL: process.env.ADMIN_URL,
    SWAGGER_USERNAME: process.env.SWAGGER_USERNAME,
    SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD,
    API_KEY_ENCRYPTED: process.env.API_KEY_ENCRYPTED,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    CDN_S3_URL: process.env.CDN_S3_URL,
    PROFILE_IMAGE_AWS_FOLDER_URL: process.env.PROFILE_IMAGE_AWS_FOLDER_URL,
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
    USER_PHOTO: process.env.USER_PHOTO,
    USER_PRODUCTS: process.env.USER_PRODUCTS,
    APP_LANGUAGE: process.env.APP_LANGUAGE,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASS: process.env.EMAIL_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    ADS_BANNER_IMAGES: process.env.ADS_BANNER_IMAGES,
    
};
export default GLOBALS;
