const express = require('express');
const router = express.Router();
const app = express();

const mongoose = require('mongoose');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const Post = require('../models/post');
const Upload = require('../models/app');

// Rutes
  //
router.get('/', async (req, res) => {
  const posts = await Post.find({})
  res.render('index', {
    posts
  })
});

  // Login
router.get('/users/login', (req, res) => res.render('login'));
router.get('/users/register', (req, res) => res.render('register'));

  // App page
router.get('/app/new', ensureAuthenticated, (req, res) => res.render('newPost', {
  user: req.user
}));

router.post('/app/store', Upload.single('filePost'), ensureAuthenticated, (req, res) => {
  Post.create(req.body,(error, post) => {
    // res.json({ file: req.file });
    res.redirect('/');
  })
});

router.get('/app/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

  // Other Pages
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
  user: req.user
}));

router.get('/contact', (req, res) => res.render('contact'));


  // Route profile
const User = require('../models/user');

app.get('/profile/:name', (req, res) => {
  const name = req.params.name;
  User.findOne({ name: name }, (err, user) => {
    res.json(user);
  })
});
 module.exports = router;
