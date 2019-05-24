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
  }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
