// commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Define your comment-related routes
router.post('/:recipeId', commentController.createComment);
router.put('/edit/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);



// Like a comment
router.post('/:commentId/like',  commentController.likeComment);

// Reply to a comment
router.post('/:commentId/reply', commentController.replyToComment);

module.exports = router;
