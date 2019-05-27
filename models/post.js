// Esquema Posts

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  nomPost: {
    type: String,
    required: true
  },
  descriptionPost: {
    type: String
  },
  authorPost: {
    type: String,
    required: true
  },
  appID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploadApp.files'
  }


});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
