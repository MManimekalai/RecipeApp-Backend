const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Mobile: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String, // This could be a URL or a reference to a stored image
    },
    favoriteRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    recipeCollections: [
      {
        name: String,
        recipes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
          },
        ],
      },
    ],
  },
  { collection: "Users" }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
