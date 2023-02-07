require("dotenv").config();
const axios = require("axios");
 
exports.getonlyversion = async (getCofigs) => {
  var config = {
    method: "post",
    url: `${process.env.RD1_ENV_URI}/=${getCofigs.uid}&sub_id=${getCofigs.sub_id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config);
};
