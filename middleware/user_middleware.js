const { User } = require('../Models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../auth/jwt');
const  request = require("request");

function inputValidation(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const missingFields = [];

  // if (!firstName) {
  //   missingFields.push('firstName');
  // }

  // if (!lastName) {
  //   missingFields.push('lastName');
  // }

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

function getTokenFromAuth0(req,res,next) {
  const options = { 
      method: 'POST',
      url: 'https://venky-yagatilee.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: {
            grant_type: 'client_credentials',
            client_id: '46Ngw5RelPCvdaCoKrqPvIWyvgFQBqvx',
            client_secret: 'S6yQ3xtx-DYjRLPBt20MWzHG6wEUFXHZGUtSf__mAfR5fD80r4qgT134CO5Ocqu3',
            audience: 'https://venky-yagatilee.auth0.com/api/v2/'
        } 
   };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
          console.log(`Line 141`, body);
         
        });
        next();
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
