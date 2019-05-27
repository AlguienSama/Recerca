const express = require('express');
const router = express.Router();
const app = express();

const passport = require('passport');
const mongoose = require('mongoose');

const User = require('../models/User');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/:name', ensureAuthenticated, (req, res) => {
  const name = req.params.name;
  User.find({ 'name': name }, (err, user) => {
    if(!user) {
      res.sendStatus(404);
    }
    return res.render('dashboard', { name: name });
  })
});

module.exports = router;
