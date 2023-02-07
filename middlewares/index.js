/*** helpers ***/
const helpers = require("../helpers/index");

exports.responseHeader = (req, res, next) => {
  console.log('path =>', req.path)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};

exports.decodeCookie = (req, res, next) => {
  if(!['/send-msg-to-sockets'].includes(req.path)) {
    
    if( Object.keys(req.body).length === 0 ) {
      return res.status(400).json({
        message: "Invalid data!"
        // message: "payload is required"
      });
    }
    console.log(req.path, " => request body => ", req.body)
    
    if (!req.body.cookie_ || req.body.cookie_ == null) {
      return res.status(422).json({
        message: "Cookie required!",
      });
    }

    console.log("request",req.body);

    
    req.decodedCookie = helpers.decrypt(req.body.cookie_);
    // console.log("decodedCookie =>", req.decodedCookie)
    
    if( req.decodedCookie == null ) {
      return res.status(422).json({
        message: "Invalid Cookie!",
      });
    }
  }

  next();
}