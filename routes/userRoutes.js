// routes/user.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint to add a recipe to the user's favorite list
router.post('/favorite/:recipeId', authMiddleware, UserController.favoriteRecipe);

// Endpoint to create a new recipe collection
router.post('/collections', authMiddleware, UserController.createCollection);

// Endpoint to add a recipe to a user's collection
router.post('/collections/:collectionId/add/:recipeId', authMiddleware, UserController.addToCollection);

router.get('/profile', authMiddleware, UserController.getProfile);

router.patch('/profile', authMiddleware, UserController.editProfile);


module.exports = router;
