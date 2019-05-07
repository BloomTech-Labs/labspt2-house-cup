const express = require("express");
const { User, School, House } = require('../../Models');
const router = express.Router();
const sequelize = require("../../sequelize");
const {
  inputValidation,
  isUserRegistered,
  hashPassword,
  loginValidation,
  findUser,
  checkPassword,
  provideAccess,
  getTokenFromAuth0,
} = require("../../middleware/user_middleware");
const {jwtCheck} = require('../../auth/Express-jwt');



router.get("/", (req, res, next) => {
  getTokenFromAuth0();
  User.findAll({
    include: [{ model: School, include: [House]}],
    attributes: ["name", "email"]
  })
    .then(allUsers => {
      if (allUsers) {
        res.status(200).json({
          status: true,
          data: {
            allUsers
          }
        });
      } else {
        next({ code: 404 });
      }
    })
    .catch(err => {
      console.log(err, 'error!');
      next({ ...err, code: 500 });
      // res.status(500).json({err})
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.body;
  Users.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({
          status: true,
          data: {
            user
          }
        });
      } else {
        next({ code: 404 });
      }
    })
    .catch(err => {
      next({ ...err, code: 500 });
    });
});

router.post( "/register",
  jwtCheck,
  (req, res) => {
    console.log(`Line 64`, req.user)
    req.body.user_id = req.user.sub;    
    const userId = req.body.user_id;
    const userObj = req.body;
    User.findOne({ where: { user_id: userId } })
    .then(user => {
      if (user) {
        res
          .status(400)
          .json({ msg: `User with user_id ${userId} already registered.` });
          console.log(`User already registered`)
      } else {
        req.user = user;
        User.create(userObj)
            .then(user => {        
        res.status(201).json({
          status: true,
          data: {
            user
          }
        });
      })
      .catch(err => {
        console.log(`Error from the users/register`,err);       
      });
       
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: `Something went wrong` });
    });     
  }
);

// Update user details




module.exports = router;
