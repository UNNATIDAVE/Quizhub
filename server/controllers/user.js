var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var events = require('events');

var userModel = require('../models/users.js');
var eventEmitter = new events.EventEmitter();

//Cerate nodemailer to send welcome mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth :{
        user: 'testecommerce98@gmail.com',
        pass: 'support@123'
    }
});

// for welcome message
eventEmitter.on('welcomeMessage', function(data){
        var mailOptions = {
            from: 'testecommerce98@gmail.com',
            to: data.email,
            subject: 'Welcome to Support System',
            html: '<h2>Hi ' + data.name + ',</h2><h2> Thank you for choosing us.</h2> <h4> We provide you the best support service </h4>'
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
}); //end welcome message


eventEmitter.on('forgotPass', function(data){
var mailOptions = {
        to: data.email,
        from: 'testecommerce98@gmail.com',
        subject: '✔ Reset your password on QuizHub',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + data.host + '/reset/' + data.token + '\n\n' +
        'Note: Reset Password Link will Expire in 1 Hour.<br>If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err,info) {
        if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
      });
});

eventEmitter.on('changePass', function(data){
      var mailOptions = {
        from: 'testecommerce98@gmail.com',
        to: data.email,
        subject: 'Your quizHub password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + data.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err,info) {
         if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
      });
});
// Generating token 
function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, "875916b9aa8591781khiladi287df573c07ed56ecc697ebb88b744329af117468be5953");
};

/* Login required middleware */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
  /* POST /login Sign in with email and password  */
  exports.loginPost = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();  

    if (errors) {
      return res.status(400).send(errors);
    }

    userModel.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'
        });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ token: generateToken(user), user: user.toJSON() });
      });
    });
  };  //End login

/* POST /signup */
exports.signupPost = function(req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
  userModel.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
    return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
    }
    user = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err) {
    eventEmitter.emit('welcomeMessage', user);
    res.send({ token: generateToken(user), user: user });
    });
  });
};  //End signin


/* Update profile information OR change password. */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  userModel.findById(req.user.id, function(err, user) {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
      user.gender = req.body.gender;
      user.location = req.body.location;
      user.website = req.body.website;
    }
    user.save(function(err) {
      if ('password' in req.body) {
        res.send({ msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
      } else {
        res.send({ user: user, msg: 'Your profile information has been updated.' });
      }
    });
  });
};  //End API

/* POST /forgot */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      userModel.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        //user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        var data = {
          host: req.headers.host,
          token: token,
          email:user.email
        };
        user.save(function(err) {
          eventEmitter.emit('forgotPass', data);
          done(err, token, user);
          res.send({ user: user, msg: 'Send Email to your mail Id.' });

        });
      });
    }
  ]);
};//End api

/* reset password */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);
  var errors = req.validationErrors();
  if (errors) {
      return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      userModel.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          var data = user.email;
          user.save(function(err) {
            eventEmitter.emit('changePass', data);
            res.send({ user: user, msg: 'Password Reset Successfully.' });
            done(err, user);
          });
        });
    }
  ]);
};  //End reset password

/* Sign in with Facebook */
exports.authFacebook = function(req, res) {
  var profileFields = ['id', 'name', 'email', 'gender', 'location'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + profileFields.join(',');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "d5001cfa5ffd462545e0bf3eb99f46bf",
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (accessToken.error) {
      return res.status(500).send({ msg: accessToken.error.message });
    }

    // Step 2. Retrieve user's profile information.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ msg: profile.error.message });
      }

      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        userModel.findOne({ facebook: profile.id }, function(err, user) {
          if (user) {
            return res.status(409).send({ msg: 'There is already an existing account linked with Facebook that belongs to you.' });
          }
          user = req.user;
          user.name = user.name || profile.name;
          user.gender = user.gender || profile.gender;
          user.picture = user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.facebook = profile.id;
          user.save(function() {
            res.send({ token: generateToken(user), user: user });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        userModel.findOne({ facebook: profile.id }, function(err, user) {
          if (user) {
            return res.send({ token: generateToken(user), user: user });
          }
          userModel.findOne({ email: profile.email }, function(err, user) {
            if (user) {
              return res.status(400).send({ msg: user.email + ' is already associated with another account.' })
            }
            user = new userModel({
              name: profile.name,
              email: profile.email,
              gender: profile.gender,
              location: profile.location && profile.location.name,
              picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
              facebook: profile.id
            });
            user.save(function(err) {
              return res.send({ token: generateToken(user), user: user });
            });
          });
        });
      }
    });
  });
};

exports.authFacebookCallback = function(req, res) {
  res.send('Loading...');
};//End FB login auth

/* Sign in with Google */
exports.authGoogle = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "fKsChA2S0_wWLP_qnRyWaKL7",
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve user's profile information.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message });
      }
      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        userModel.findOne({ google: profile.sub }, function(err, user) {
          if (user) {
            return res.status(409).send({ msg: 'There is already an existing account linked with Google that belongs to you.' });
          }
          user = req.user;
          user.name = user.name || profile.name;
          user.gender = profile.gender;
          user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
          user.location = user.location || profile.location;
          user.google = profile.sub;
          user.save(function() {
            res.send({ token: generateToken(user), user: user });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        userModel.findOne({ google: profile.sub }, function(err, user) {
          if (user) {
            return res.send({ token: generateToken(user), user: user });
          }
          user = new userModel({
            name: profile.name,
            email: profile.email,
            gender: profile.gender,
            picture: profile.picture.replace('sz=50', 'sz=200'),
            location: profile.location,
            google: profile.sub
          });
          user.save(function(err) {
            res.send({ token: generateToken(user), user: user });
          });
        });
      }
    });
  });
};

exports.authGoogleCallback = function(req, res) {
  res.send('Loading...');
};  //end google oauth login