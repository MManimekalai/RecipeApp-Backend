const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const { connectDB } = require('../config/database')


exports.likeRecipe = async (req, res) => {
  console.log('getting into like controller');
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
      // Extract user information from the request
      const { user } = req;
      console.log(user);

      const { recipeId } = req.params;
      const userId = user._id;

      // Check if the user has already liked the recipe in MongoDB
      const existingLikeMongo = await Like.findOne({ recipe: recipeId, user: userId });

      if (existingLikeMongo) {
        console.log('User has already liked the recipe.');
        return res.status(400).json({ message: 'User has already liked the recipe.' });
      } else {
        const newLike = new Like({
          recipe: recipeId,
          user: userId, // Use the user's _id directly
        });

        await newLike.save();

        console.log('Like added successfully.');

        const problematicRecipes = await Recipe.find({ likes: { $type: 'array' } });
        

        // Update the recipe's likes array with the user's _id
        await Recipe.findByIdAndUpdate(recipeId, { $push: { likes: newLike._id }, $inc: { likesCount: 1 } });
   
       res.status(200).json({ message: 'Recipe liked successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like the recipe', error: error.message });
  }
};


exports.dislikeRecipe = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
      // Extract user information from the request
      const { user } = req;
      console.log(user);

      const { recipeId } = req.params;
      const userId = user._id;

      // Check if the user has already disliked the recipe in MongoDB
      const existingDislikeMongo = await Like.findOneAndDelete({ recipe: recipeId, user: userId });

      if (!existingDislikeMongo) {
        console.log('User has not disliked the recipe.');
        return res.status(400).json({ message: 'User has not disliked the recipe.' });
      } else {
        await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: -1 } });

        console.log('Dislike removed successfully.');
        res.status(200).json({ message: 'Recipe disliked successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to dislike the recipe', error: error.message });
  }
};
