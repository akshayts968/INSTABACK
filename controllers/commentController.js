const Comment = require('../model/Comment');
const Post = require('../model/Post');
const allComment = async (req, res) => {
    try {
      const comments = await Comment.find({}).populate("owner");
      res.json(comments); 
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
  };
const addComment = async (req, res) => {
    const { content, author } = req.body;
    const { postId } = req.params;
    const comment = new Comment({ content, author, post: postId });
    await comment.save();
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
};

const getComments = async (req, res) => {
    const id = req.params.id;
    try {
const post = await Post.findById(id)
  .populate({
    path: 'comments',
    populate: {
      path: 'replies',
      populate: {
        path: 'replies', 
        populate: { path: 'owner' } 
      }
    }
  })
  .populate('postOwner');
      //const commentowner = post.comments.populate("");
      //console.log("comments jbjbj",post);
      res.json(post); 
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
};

const editComment = async (req, res) => {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
    res.status(200).json(updatedComment);
};

const deleteComment = async (req, res) => {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
};

module.exports = { addComment, getComments, editComment, deleteComment, allComment };
