// recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Define your recipe-related routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/create', recipeController.createRecipe);
router.put('/edit/:id', recipeController.updateRecipe);
router.delete('/delete/:id', recipeController.deleteRecipe);
router.post('/:recipeId/generateShareableLink', recipeController.generateShareableLink);
// Share route
router.post('/:recipeId/share', recipeController.shareRecipe);

router.get('/new/searchRecipes', recipeController.searchRecipes);

module.exports = router;
