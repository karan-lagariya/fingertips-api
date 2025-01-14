import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import adminRoute1 from './modules/v1/admin/route/adminRoute.js';
import authRoute1 from './modules/v1/auth/route/authRoute.js';
import GLOBALS from './app-config/constants.js';
import common from './app-config/common.js';
import middleware from './middleware/headerValidator.js';
import cron from 'node-cron';
import fs from 'fs';
import https from 'https';
import sslRootCas from 'ssl-root-cas';

// https.globalAgent.options.ca = sslRootCas.create();

// const ssloptions = {
//     key: fs.readFileSync('/etc/letsencrypt/live/fingertipsapp.in/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/fingertipsapp.in/cert.pem'),
//     ca: fs.readFileSync('/etc/letsencrypt/live/fingertipsapp.in/fullchain.pem'),
//     rejectUnauthorized: true
// };


const app = express();
app.use(cors());

//Schedule cron to run every day at 7 AM

//cron.schedule("0 7 * * *", function() {
cron.schedule("30 22 * * *", function() {

    common.adsExpire();
    common.adsRunningStatusChange();
    common.subscriptionPlanExpire();
    common.subscriptionPlanSevenDayBeforeExpire();
    common.autoDeleteUser();
});



app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

app.use(bodyParser.text());

app.use(cookieParser());

app.use(express.text());
app.use(express.urlencoded({extended: false}));

app.use(express.text());
app.use(express.urlencoded({extended: false}));

//  ====================================== Version v1 swagger documents  ======================================
const options = {};

// const swaggerDocumentAPIv1 = JSON.parse(fs.readFileSync('./document/v1/api_swagger_doc.json', 'utf-8'));

// app.use(
//     '/api-docs-v1',
//     authenticateDocument.authenticateDoc,
//     swaggerUI.serveFiles(swaggerDocumentAPIv1, options),
//     swaggerUI.setup(swaggerDocumentAPIv1)
// );

//  ====================================== end  ======================================

//  ====================================== version 1 routes  ======================================

// Set Header for language using middleware
app.use(middleware.extractHeaderLanguage);

// Validate apikey using middleware
// app.use(middleware.validateHeaderApiKey);

// Validate token of user using middleware
app.use(middleware.validateHeaderToken);

app.use('/api/v1/admin/', adminRoute1);
app.use('/api/v1/auth/', authRoute1);

//  ====================================== end  ======================================

// Listen to port for Training app
try {
    app.listen(GLOBALS.PORT);
    // https.createServer(ssloptions, app).listen(GLOBALS.PORT, () => { });
    console.log(`Connected to ${GLOBALS.APP_NAME} ${process.env.NODE_ENV} app On PORT : `, GLOBALS.PORT);
} catch (err) {
    console.log(err);
    console.log('Failed to connect');
}
