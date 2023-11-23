// likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Define your like-related routes
router.post('/:recipeId', likeController.likeRecipe);
//router.delete('/:recipeId', likeController.dislikeRecipe);

module.exports = router;
