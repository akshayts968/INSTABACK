const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { allPost, createPost, getPost, updatePost, deletePost, allPosts, deleteAll } = require('../controllers/postController');
const cloudinary = require('../config/cloudinary');
const upload = require ('../config/upload')

const router = express.Router();
//app.get('/api/posts',
router.get('/all', allPosts);
//app.get('/deleteAllPosts/:userId', 
router.delete('/',deleteAll)
//app.post("/:id/Post", upload.single('Post'), 
router.post('/:id/create',upload.single('Post'), createPost);
//app.get("/post/:id", 
router.get('/:id',getPost);
//app.put("/post/:id", 
router.put('/:id',updatePost);
router.delete('/:id',  deletePost);
router.get('/all', allPosts);
router.post("/Messages/:sendId/:rId",);
module.exports = router;
