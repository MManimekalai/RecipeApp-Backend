const mongoose = require('mongoose');
const Like = require('./Like');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [Like.schema],
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe', // Reference to the Recipe model,
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
