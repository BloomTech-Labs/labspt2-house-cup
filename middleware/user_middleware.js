const { User } = require('../Models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../auth/jwt');
const  request = require("superagent");


function inputValidation(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const missingFields = [];

  // if (!firstName) {
  //   missingFields.push('firstName');
  // }

  // if (!lastName) {
  //   missingFields.push('lastName');
  // }

const NON_INTERACTIVE_CLIENT_ID = "s9Qekd0RGrf7q6MzklrKi8n6R9HzKz06";
const NON_INTERACTIVE_CLIENT_SECRET = "09m5DSGrksPQf7WQq5OS3uTqY11l6RmLufxUGVoWvusF3Kf52Tb1ZUiE9UBOEXmO";



  if (!email) {
    missingFields.push('email');
  }
  if (!password) {
    missingFields.push('password');
  }

  if (missingFields.length) {
    res
      .status(400)
      .json(`The following fields are missing: ${missingFields.join(', ')}`);
  } else {
    next();
  }
}

function isUserRegistered(req, res, next) {
  const { email } = req.body;
  User.findOne({ where: { email: email } })
    .then(userDocument => {
      if (userDocument) {
        res
          .status(400)
          .json({ msg: `User with email ${email} already registered.` });
      } else {
        req.userDocument = userDocument;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: `Something went wrong` });
    });
}

function hashPassword(req, res, next) {
  const { password } = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hashedPassword) {
      if (err) {
        res
          .status(500)
          .json({ msg: `Something went wrong hashing the password` });
      } else {
        req.body.password = hashedPassword;
        next();
      }
    });
  });
}

function loginValidation(req, res, next) {
  const { email, password } = req.body;
  const missingFields = [];

  if (!email) {
    missingFields.push('email');
  }
  if (!password) {
    missingFields.push('password');
  }

  if (missingFields.length) {
    res
      .status(400)
      .send(`The following fields are missing: ${missingFields.join(', ')}`);
  } else {
    next();
  }
}

function findUser(req, res, next) {
  const { email } = req.body;
  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user)
        res
          .status(404)
          .json({ msg: `User with email ${email} not registered` });
      req.userDocument = user;
      //  res.status(200).json(user)
      next();
    })
    .catch(err => {
      res.status(500).json({ msg: `Something went wrong` });
    });
}



function checkPassword(req, res, next) {
  const { password } = req.body;
  const hashPassword = req.userDocument.password;
  bcrypt.compare(password, hashPassword, function(err, passwordMatching) {
    if (err) res.status(500).json({ msg: `Something went wrong` });
    if (!passwordMatching) res.status(400).json({ msg: `Incorrect password` });
    next();
  });
}

function provideAccess(req, res, next) {
  const { email } = req.body;
  const token = generateToken(email);
  if (!token) res.status(400).json({ msg: `Access Denied` });
  res.status(200).json({ token: token });
  //still need to implement using passport.js
}
const NON_INTERACTIVE_CLIENT_ID = "s9Qekd0RGrf7q6MzklrKi8n6R9HzKz06";
const NON_INTERACTIVE_CLIENT_SECRET = "09m5DSGrksPQf7WQq5OS3uTqY11l6RmLufxUGVoWvusF3Kf52Tb1ZUiE9UBOEXmO";

const authCredentials = {
  client_id: NON_INTERACTIVE_CLIENT_ID,
  client_secret: NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: "https://venky-yagatilee.auth0.com/api/v2/"
};
const authData = {
  client_id: NON_INTERACTIVE_CLIENT_ID,
  client_secret: NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: "https://venky-yagatilee.auth0.com/api/v2/"
};
function getTokenFromAuth0(req,res,next) {
  request.post('https://venky-yagatilee.auth0.com/oauth/token', authData)
         .then( response => {
            if (res.body.access_token) {
              console.log(`Line 33`, response.body.access_token)
              req.access_token = res.body.access_token;
              console.log(`Line 35 for req`, req.access_token)
              next();
            } else {
              res.send(401, 'Unauthorized');
            }
         })
         .catch(err => {
            //  response.status(500).json({msg: `Something is wrong`});
            console.log(`Error:`, err)
         }); 
}

module.exports = {
  inputValidation,
  isUserRegistered,
  hashPassword,
  loginValidation,
  findUser,
  checkPassword,
  provideAccess,
  getTokenFromAuth0
  
  };
