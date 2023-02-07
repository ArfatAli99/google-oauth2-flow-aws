require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const GoogleConnectModel = require('./models/google_connect.model');
require("./config/db");

/*** helpers ***/
const helpers = require("./helpers/index");
const common_helpers = require("./helpers/common_helpers");
const { responseHeader, decodeCookie } = require("./middlewares/index");

const PATH_TO_SERVICE_ACCOUNT_KEY = require("./path-to-secret-service-file");
const businessmessages = require('businessmessages');
const uuidv4 = require('uuid').v4;
const { google } = require('googleapis');

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

// Set the scope that we need for the Business Messages API
const scopes = [
    'https://www.googleapis.com/auth/businessmessages',
    'https://www.googleapis.com/auth/businesscommunications'
];

// Set the private key to the service account file
const privatekey = PATH_TO_SERVICE_ACCOUNT_KEY;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(responseHeader);
/* cookie decoded here for post routes and you can also add exception in this middleware */

app.get('/redirect_from_google', async function (req, res, next) {
    try {
        if (req.query.state && req.query.code) {
            let the_state = req.query.state;
            const myArray = the_state.split(",");
            console.log("myArray===", myArray);
            let st_store_id = myArray[0];
            let url_back = myArray[1];
            const url_back2 = url_back.replace("arfhash", "#");
            const url_back3 = url_back2.replace("andarf", "&") + "?type=settings&connected=true";
            let getCofigs = await GoogleConnectModel.findOne({ store_id: st_store_id });
            const getAccessTokenData = {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: req.query.code,
                redirect_uri: process.env.REDIRECT_URL,
                grant_type: "authorization_code"
            };
            const getAccessTokenReq = {
                method: 'post',
                url: 'https://accounts.google.com/o/oauth2/token',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: getAccessTokenData
            };
            const result = await axios(getAccessTokenReq);
            const tokens = result.data;
            let updateBody = { access_token: tokens.access_token, token_type: tokens.token_type, id_token: tokens.id_token };
            let googleUpdation = await GoogleConnectModel.findOneAndUpdate({ store_id: st_store_id }, updateBody);

            res.redirect(url_back3);


        } else {

        }
    } catch (error) {

    }
    console.log(req.body);
    console.log(JSON.stringify(req.body));
    res.status(200).json(req.query);
});

app.post("*", decodeCookie);

 

app.post("/outh-google", async (req, res, next) => {
    // not using this endpoint
    try {
        const Client_ID = process.env.Client_ID;
        const REDIRECT_URL = process.env.REDIRECT_URL;
        const Local_Redirect_Uri = process.env.Redirect_Uri;
        const url = req.body.url;
        const url_back = url.replace("#", "arfhash");
        const url_back2 = url_back.replace("&", "andarf");
        const scopes = "https://www.googleapis.com/auth/businesscommunications https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/cloud-platform";
        let findUser = await GoogleConnectModel.findOne({ store_id: req.decodedCookie.store_id }).exec();
        if (findUser) {
            let redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scopes}&access_type=offline&include_granted_scopes=true&response_type=code&state=${findUser.store_id},${url_back2}&redirect_uri=${Local_Redirect_Uri}&client_id=${Client_ID}`;
            console.log("redirectUrl from getAuthUrl=================", redirectUrl);
            return res.json({
                data: redirectUrl
            });
        } else {
            throw new Error('User Not Found');
        }

    } catch (error) {
        helpers.sendCatchErrorMsg(res, error);
        // console.log(error)
        // throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
});


module.exports.handler = serverless(app);
