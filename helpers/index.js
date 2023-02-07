require("dotenv").config();
const crypto = require('crypto');
const AWS = require('aws-sdk')

const hash = (string) => {
  return crypto.createHash('sha256').update(string).digest('hex');
};

const encryptionMethod = 'AES-256-CBC';
const secret = hash('@').substring(0, 32);
const iv = hash('@').substring(0, 16);

exports.encrypt = (plain_text) => {
  try {
    const encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
    const singleEncryptedMessage =
      encryptor.update(plain_text, 'utf8', 'base64') +
      encryptor.final('base64');
    return Buffer.from(singleEncryptedMessage).toString('base64');
  } catch (e) {
    return null;
  }
};

exports.decrypt = (encryptedMessage) => {
  try {
    const singleDecryptedMessage = Buffer.from(
      encryptedMessage,
      'base64',
    ).toString('ascii');
    const decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
    return (
      JSON.parse(decryptor.update(singleDecryptedMessage, 'base64', 'utf8') +
      decryptor.final('utf8'))
    );
  } catch (e) {
    return null;
  }
};

/* exports.sendCatchErrorMsg = (res, err) => {
  console.log("error1 =>", err)
  let message = '';
  if (err.response) {
    
    if (err.response.data.message) {
      
      console.log("axio error =>", err.response.data.message)
      message = err.response.data.message;
    } else {
      console.log("axio error =>", err.response.data.errors)
      message = err.response.data.errors[0].detail;
    }
  } else {
    console.log("general error =>", err.message)
    message = err.message;
  }
  return res.status(500).json({
    message: message,
  });
} */

exports.sendCatchErrorMsg = (res, err) => {
  console.log("error1 =>", err);
  let message = "Something went wrong!";
  let status = 500;
  if (err.response) {
    console.log(err.response.data);
    console.log(err.response.status);
    // console.log(err.response.headers);

    status = err.response.status;
    message = err.response.data;

    /* if (err.response.data.message) {
      console.log("axio error1 =>", err.response.data.message);
      message = err.response.data.message;
    } else {
      console.log("axio error2 =>", err.response.data.errors);
      message = err.response.data.errors[0].detail;
    } */
  } else if (err.request) {
    status = 400;
    console.log(err.request);
    message = err.request;
  } else {
    console.log("general error =>", err.message);
    message = err.message;
  }
  console.log("end => ", status, message);
  return res.status(status).json({
    status, message
  });
};

exports.sendSocketMessage = async (connectionId, body) => {
  try {
    const client = new AWS.ApiGatewayManagementApi({ endpoint: process.env.SOCKET_ENDPOINT });
    //get id from mongdb
    await client.postToConnection({
      'ConnectionId': connectionId,
      'Data': Buffer.from(JSON.stringify(body)),
    }/* , (err, data) => {
      if (err) console.log("socket error =>", err, err.stack); // an error occurred
      else     console.log("socket socket =>", data);           // successful response
    } */).promise().catch(err => console.log(err));
  } catch (err) {
    console.error(err);
  }
}
