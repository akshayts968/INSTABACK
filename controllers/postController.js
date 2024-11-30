const Post = require('../model/Post');
const User = require('../model/User');
const Comment = require('../model/Comment');
const cloudinary = require('../config/cloudinary')

const createPost = async (req, res) => {
    const id = req.params.id;
    const postUrl = req.file ? req.file.path : null;
    const body = Object.assign({}, req.body);
    const description = body.Description;
    //console.log(body,description);
    try {
        if (!postUrl) {
            throw new Error("No file uploaded");
        }

        const newPost = new Post({
            videourl: postUrl,
            postOwner:id,
            description: description || "",
        });

        const savedPost = await newPost.save();
        
        const user = await User.findByIdAndUpdate(
            id,
            { $push: { post: savedPost._id }, $inc: { nPost: 1 } },
            { new: true } 
        );

        console.log(savedPost, user);
        res.status(201).json({savedPost,user}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

const getPost = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("post");
        res.json({ data: user.post, User: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    const { commentId, post } = req.body;
      try {
          const { mention, remaining } = extractMention(req.body.comment);
        const CommentData = new Comment({
          text:remaining,
          owner: req.body.userId,
          replies: [], 
        });
        console.log("Naina",mention,remaining,CommentData);
        const savedComment = await CommentData.save();
        let updateUserResult;
        if (mention) {
          updateUserResult = await Comment.findByIdAndUpdate(
            commentId,
            {
              $push: { replies: savedComment._id },
              $inc: { nReply: 1 },
            },
            { new: true }
          );
          console.log('Comment updated:', updateUserResult);
        }else{
          updateUserResult = await Post.findByIdAndUpdate(
            req.body.post,
            {
              $push: { comments: savedComment._id },
              $inc: { nComments: 1 },
            },
            { new: true }
          );
        }
        
    
        res.status(200).json({savedComment,updateUserResult}); // Sending the saved comment back in the response
      } catch (error) {
        console.error("Error updating post with new comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };

const deletePost =  async (req, res) => {
    const { id } = req.params;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const userId = post.postOwner._id;
      console.log(post.videourl,"data to delete");
        const urlParts = post.videourl.split('/');
        const publicIdWithExtension = urlParts.slice(-1)[0];
        const publicId = publicIdWithExtension.split('.')[0];

        console.log('Extracted Public ID:', publicId); // Should print: wanderlust_DEV/jhzsrwgy5o0rddipl22u

        await cloudinary.uploader.destroy(`wanderlust_DEV/${publicId}`, (error, result) => {
        if (error) {
            console.error('Error deleting image:', error);
        } else {
            console.log('Image delete result:', result);
        }
        });
      await Post.findByIdAndDelete(id);
  
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { post: id },
          $inc: { nPost: -1 },
        },
        { new: true }
      );
  
      res.status(200).json({ message: 'Post deleted successfully',user });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
const deleteAll = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await Comment.deleteMany({});
    } catch (error) {
      console.error('Error deleting posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
const allPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('postOwner');
      //console.log(posts);
      res.json({
        posts
    });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Server error');
    }
  };

module.exports = { createPost, getPost, updatePost, deletePost, allPosts,deleteAll };
