const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Carregar taula MLAB
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Comprovació d'errors
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Complete all the fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords don’t match' });
  }

  if (password.length < 4) {
    errors.push({ msg: 'More than 4 characters are required in password' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Cerca si coincideix el correu
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'E-mail already exist' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        User.findOne({ name: name }).then(user => {
          if (user) {
            errors.push({ msg: 'Username already exist' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            // Creació d'usuari
            const newUser = new User({
              name,
              email,
              password
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'Register completed! Now you can Login'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
                });
              });
            }
          });
        }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Session closed');
  res.redirect('/users/login');
});

module.exports = router;
