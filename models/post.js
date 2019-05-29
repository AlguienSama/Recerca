// Esquema Posts

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Upload = require('./app.js');

const PostSchema = new Schema({
  nomPost: {
    type: String,
    required: true
  },
  descriptionPost: {
    type: String
  },
  file: [{
    type: Schema.Types.ObjectId,
    ref: 'Upload',
    required: true
  }]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
