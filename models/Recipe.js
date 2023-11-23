const mongoose = require('mongoose');
const Like = require('./Like');
const Comment = require('./Comment');
const User = require('./User'); 

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shareableLink: {
    type: String,
    unique: true,
  },
  images: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  allcomment: {
    type: [String],
  },
  
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

recipeSchema.index({ title: 'text', ingredients: 'text', tags: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
