const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const https = require('https');
const fs = require('fs');

const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

const methodOverride = require('method-override');


// Passport Config
require('./config/passport')(passport);


// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/BaseM';

// mongoose.connect('mongodb://MarcFont:marcfont24.@ds039504.mlab.com:39504/prova1', { useNewUrlParser: true })
mongoose.connect(mongoURI, { useNewUrlParser: true });

var conn = mongoose.connection;

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploadApp');
  console.log('Connected DB');
});

// Middlewares
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});


app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/profile', require('./routes/profile.js'));

// gfs
app.get('/appss', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files exist
    if(!files || files.length === 0){
      return res.status(404).json({
        err: 'No files exists'
      });
    }
    return res.json(files);
  });
});

app.get('/apps/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    if (file.contentType === 'text/javascript' || file.contentType === 'text/html') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not file'
      });
    }
  });
});

app.get('/app', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render('index', {files: false});
    } else {
      files.map(files => {
        if(files.contentType === 'text/html')
        {
          files.isHTML = true;
        } else {
          files.isHTML = false;
        }
      });
    }
    res.render('pages', {files: files});
  });
});

app.delete('/apps/:filename', (req, res) => {
  gfs.remove({_id: req.params.id, root: 'uploadApp'}, (err, gridStore) => {
    if(err) {
      return res.status(404).json({err: err });
    }
    res.redirect('/profile/:name')
  });
});



// SSL config
/* const options = {
  key: fs.readFileSync('/etc/ssl/private/apache-selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/certs/apache-selfsigned.crt')
};
https.createServer(options, app).listen(4040, console.log(`Server https port: 4040`));
*/

//Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
