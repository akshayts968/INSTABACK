const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { addComment, getComments, deleteComment, editComment, allComment } = require('../controllers/commentController');

const router = express.Router();
//app.get("/fetchcomment", 
router.get('/',  allComment);
router.post('/:postId',  addComment);
router.get('/:id', getComments);
router.put('/:commentId',editComment);
router.delete('/:commentId',deleteComment);

module.exports = router;
