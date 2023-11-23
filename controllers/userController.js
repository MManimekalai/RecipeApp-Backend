// controllers/userController.js
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const {connectDB} = require('../config/database')

const UserController = {
  favoriteRecipe: async (req, res) => {
    await connectDB()
    try {
      const { user } = req;
      const { recipeId } = req.params;

      // Update user's favoriteRecipes array
      await User.findByIdAndUpdate(user._id, { $addToSet: { favoriteRecipes: recipeId } });

      res.status(200).json({ message: 'Recipe added to favorites successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add recipe to favorites', error: error.message });
    }
  },

  createCollection: async (req, res) => {
    await connectDB()
    try {
      const { user } = req;
      const { collectionName } = req.body;

      // Create a new collection
      const newCollection = { name: collectionName, recipes: [] };

      // Update user's recipeCollections array
      await User.findByIdAndUpdate(user._id, { $push: { recipeCollections: newCollection } });

      res.status(201).json({ message: 'Recipe collection created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create recipe collection', error: error.message });
    }
  },

  addToCollection: async (req, res) => {
    await connectDB()
    try {
      const { user } = req;
      const { collectionId, recipeId } = req.params;

      // Update user's recipeCollections array
      await User.updateOne(
        { _id: user._id, 'recipeCollections._id': collectionId },
        { $addToSet: { 'recipeCollections.$.recipes': recipeId } }
      );

      res.status(200).json({ message: 'Recipe added to collection successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add recipe to collection', error: error.message });
    }
  },

  getProfile: async (req, res) => {
    await connectDB()
    try {
        const id = req.user._id        
        const userProfile = await User.findById(id);
        //const recipe = await Recipe.findById(id);
        res.status(200).json(userProfile);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve user profile', error: error.message });
      }
    },

    editProfile: async (req, res) => {
        await connectDB()
        try {
            const id = req.user._id
            const { name, bio, profileImage, Mobile } = req.body;
        
            // Update the user profile in the database
            await User.findOneAndUpdate({ _id: req.user._id }, { name, bio, profileImage, Mobile });
        
            res.status(200).json({ message: 'User profile updated successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update user profile', error: error.message });
          }
        },
    
};

module.exports = UserController;
