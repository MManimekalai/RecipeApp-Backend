// recipeController.js
// Import necessary modules, such as Recipe model
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const {connectDB} = require('../config/database')
const shortid = require('shortid');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EmailID,
    pass: process.env.password,
  },
});



// Define your recipe-related controller functions
exports.getAllRecipes = async (req, res) => {
  await connectDB()
  try {
    // Fetch all recipes from the database
    const recipes = await Recipe.find();

    // Send the recipes as a response
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  try {
    await connectDB()
    // Fetch the recipe by ID from the database
    const recipe = await Recipe.findById(id);
    console.log('recipe', recipe);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Send the recipe as a response
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recipe by ID', error: error.message });
  }
};

// Define the createRecipe controller function
exports.createRecipe = async (req, res) => {
  await connectDB()
  // Extract recipe details from the request body
  const { title, ingredients, instructions, preparationTime, imageUrl, category, tags} = req.body;

  try {
    // Middleware to ensure authentication
    authMiddleware(req, res, async () => {
      // Extract user information from the request
      const { user } = req;
      //console.log(user);
      // Create a new recipe instance
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        preparationTime,
        imageUrl,
        category,
        tags,
        // Assign the owner of the recipe
        owner: user._id,
        createdBy: user._id,
      });
      //console.log(newRecipe);

      // Save the new recipe to the database
      await newRecipe.save();

      // Respond with a success message
      res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  await connectDB()
  const recipeId = req.params.id; // Extract recipe ID from request parameters
  const { title, ingredients, instructions, preparationTime, imageUrl, category, tags } = req.body;

  try {

    authMiddleware(req, res, async () => {
      // Extract user information from the request
      const { user } = req;
    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Update the recipe properties
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.preparationTime = preparationTime;
    recipe.imageUrl = imageUrl;
    recipe.category = category;
    recipe.tags = tags;
    
    // Save the updated recipe to the database
    await recipe.save();

    // Respond with a success message and the updated recipe
    res.status(200).json({ message: 'Recipe updated successfully', recipe });
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  await connectDB()
  const recipeId = req.params.id; // Extract recipe ID from request parameters

  try {
    authMiddleware(req, res, async () => {
      // Extract user information from the request
      const { user } = req;
    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Delete the recipe from the database
    await Recipe.deleteOne({ _id: recipeId });

    // Respond with a success message
    res.status(200).json({ message: 'Recipe deleted successfully' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

exports.generateShareableLink = async (req, res) => {
  await connectDB()
  try {
    const { recipeId } = req.params;

    // Generate a unique shareable link (you can use a library for this)
    const shareableLink = generateUniqueLink();
    console.log(shareableLink);

    // Update the recipe model with the shareable link
    await Recipe.findByIdAndUpdate(recipeId, { shareableLink });

    res.status(200).json({ message: 'Shareable link generated successfully', shareableLink });
    return shareableLink; 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate shareable link', error: error.message });
  }
};

function generateUniqueLink() {
   // Generate a unique short ID
   const uniqueString = shortid.generate();
   // You can customize the format or add a domain prefix if needed
   return 'http://yourdomain.com/' + uniqueString;
}

exports.shareRecipe = async (req, res) => {
  await connectDB();
  try {
    // Middleware to ensure authentication
    authMiddleware(req, res, async () => {
      const shareableLink = generateUniqueLink();
    const { recipeId } = req.params;
    const { user } = req;
    const { recipient, method } = req.body;

    const recipe = await Recipe.findById(recipeId).populate('likes');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check the sharing method (email or in-built user)
    // if (method === 'email') {
    //   const mailOptions = {
    //     from: 'your_email@gmail.com',
    //     to: recipient,
    //     subject: 'Recipe Sharing',
    //     text: `Check out this amazing recipe: ${shareableLink}`
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Failed to send email', error: error.message });
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //       res.status(200).json({ message: 'Recipe shared successfully' });
    //     }
    //   });
    //   await sendEmail(recipient, 'Recipe Shared', `Check out this recipe: ${recipe.title}`);
    // } 
    if (method === 'in-built') {
      // Add logic to share with an in-built user
      const recipientUser = await User.findOne({ Name: recipient });

      if (!recipientUser) {
        return res.status(404).json({ message: 'Recipient user not found' });
      }

      // Update the recipient user's data as needed
      // For example, add the shared recipe to the user's collection
      await User.findByIdAndUpdate(recipientUser._id, { $addToSet: { recipes: recipeId } });
    } else {
      return res.status(400).json({ message: 'Invalid sharing method' });
    }

    res.status(200).json({ message: 'Recipe shared successfully' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to share recipe', error: error.message });
  }
};

// Hypothetical function to send email (replace with actual implementation)
// const sendEmail = async (recipient) => {
//   const shareableLink = generateUniqueLink();
//   const mailOptions = {
//     from: process.env.EmailID,
//     to: recipient,
//     subject: 'Recipe Sharing',
//     text: `Check out this amazing recipe: ${shareableLink}`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

exports.searchRecipes = async (req, res) => {
  console.log("getting into new search");
  await connectDB();

  try {
    const { query } = req.query;

    // Use MongoDB text search to find matching recipes
    const result = await Recipe.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({ recipes: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search recipes', error: error.message });
  }
};