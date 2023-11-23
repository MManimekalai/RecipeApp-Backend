const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(  
  {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe', // Reference to the Recipe model
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
