const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const { connectDB } = require('../config/database')
const Like = require('../models/Like');


exports.createComment = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
      const { recipeId } = req.params;
      const userId = req.user._id;
      const { text } = req.body;

      const newComment = new Comment({
        recipe: recipeId,
        user: userId,
        text: text,
      });

      await newComment.save();

      // Use the newComment _id as the reference in the comments array
      const updatedrecipe = await Recipe.findByIdAndUpdate(recipeId, { $push: { allcomment: newComment.text } });
        console.log(updatedrecipe);

        await updatedrecipe.save();

      res.status(201).json({ message: 'Comment created successfully', newComment });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the comment', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existingComment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update the comment' });
    }

    existingComment.text = text;
    await existingComment.save();

    res.status(200).json({ message: 'Comment updated successfully' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const existingComment = await Comment.findById(commentId);
    console.log('existingComment', existingComment);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existingComment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete the comment' });
    }

    // // Update the recipe's comment count in MongoDB
    // await Recipe.findByIdAndUpdate(existingComment.recipe, { $inc: { comments: -1 } });
    // await Recipe.deleteOne({ _id: recipeId });

    await existingComment.deleteOne(); 

    res.status(200).json({ message: 'Comment deleted successfully' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the comment', error: error.message });
  }
};


// Like a comment
exports.likeComment = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({ comment: commentId, user: userId });

    if (existingLike) {
      return res.status(400).json({ message: 'User has already liked the comment.' });
    }

    // Create a new like
    const newLike = new Like({
      comment: commentId,
      user: userId,
    });

    await newLike.save();

    res.status(200).json({ message: 'Comment liked successfully.' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like the comment.', error: error.message });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  try {
    await connectDB();
    authMiddleware(req, res, async () => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    // Find the comment to which the user is replying
    const parentComment = await Comment.findById(commentId);
    console.log('parentComment', parentComment);

    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found.' });
    }

    // Create a new reply comment
    const newReply = new Comment({
      user: userId,
      text: text,
    });

    console.log('newReply',newReply);

    await newReply.save();

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(newReply);
    const newpar = await parentComment.save();

    console.log('newpar', newpar);

    res.status(201).json({ message: 'Reply added successfully.' });
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add the reply.', error: error.message });
  }
};
