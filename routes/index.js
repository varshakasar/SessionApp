const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

let userSchema = require('../models/userSchema.js');
let User = mongoose.model('user', userSchema);

router.post('/login', (req, res) => {
  //validation
  if ((typeof req.body.email == undefined) || req.body.email == "") {
    return res.json({
      success: false,
      message: ' Email Not Defined..'
    })
  }
  if ((typeof req.body.pass == undefined) || req.body.pass == "") {
    return res.json({
      success: false,
      message: ' Password Not Defined..'
    })
  }
  let email = req.body.email;
  let pass = req.body.pass;

  User.findOne({
    email:email
    }).exec((err, result) => {
    if (result) {
      if(result.pass == req.body.pass){
        req.session.email = req.body.email;
        req.session.pass = req.body.pass;
        res.json({
        success: true,
        message: 'Valid User and login successfully'
      })
      }
      else{
        res.json({
        success: false,
        message: 'Incorrect password'
      })
      }

    } else {
      res.json({
        success: false,
        message: 'Invalid User'
      })
    }
  })
});
router.get('/users', isLoggedIn, (req, res, next) => {
  User.find({}).exec((err, data) => {
    if (err) {
      next(err);
    } else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})
router.post('/createUser', isLoggedIn, (req, res, next) => {
  if ((typeof req.body.email == undefined) || req.body.email == "") {
    return res.json({
      success: false,
      message: ' Email Not Defined..'
    })
  }
  if ((typeof req.body.pass == undefined) || req.body.pass == "") {
    return res.json({
      success: false,
      message: ' Password Not Defined..'
    })
  }
  if ((typeof req.body.user == undefined) || req.body.user == "") {
    return res.json({
      success: false,
      message: ' User Name Not Defined..'
    })
  }
  let userName = req.body.user;
  let email = req.body.email;
  let pass = req.body.pass;
  //find email in db
  User.findOne({
    email: email
  }).exec((err, result) => {
    if (result) {
      res.json({
        success: false,
        message: 'User already exist'
      })
    } else {
      let userObject = new User({
        userName: userName,
        email: email,
        pass: pass
      });
      userObject.save((err, data) => {
        if (err) {
          next(err);
        } else {
          res.json({
            success: true,
            data: data,
            message: 'User created'
          })
        }
      })
    }
  })
})
router.put('/updateUser', isLoggedIn, (req, res, next) => {
  let email = req.body.email;
  let user = req.body.user;
  let pass = req.body.pass;
  let obj = {
    userName: user,
    pass: pass
  };
  var query = {
    $set: obj
  };
  User.findOneAndUpdate({
      email: email
    },
    query,
    (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json({
          success: true,
          data: data,
          message: 'Successfully updated'
        })
      }
    })
})
router.delete('/user', isLoggedIn, (req, res, next) => {
  let email = req.body.email;
  User.findOneAndDelete({
      email: email
    },
    (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json({
          success: true,
          data: data,
          message: 'Successfully deleted'
        })
      }
    })
})

function isLoggedIn(req, res, next) {
  // check user is authenticated or not
  if (req.session.email && req.session.pass) {
    next();
  } else {
    res.send('You are not logged in First Login..')
  }
}
router.get('/isUserAuthenticated', (req, res) => {
  if (req.session.email && req.session.pass) {
    res.send("User is authenticated with email : " + req.session.email);
    res.end();
  } else {
    res.send('Please,Login first');
    res.end();
  }
});
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) {
      next(err);
    } else {
      res.send("logout!!!");
    }
  });
});
module.exports = router;