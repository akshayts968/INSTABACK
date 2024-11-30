const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getUser, updateUser, followUser, fetchAllUsers } = require('../controllers/userController');
const upload = require ('../config/upload')
const router = express.Router();

router.get('/:id', getUser);
//app.post('/:id/edit',upload.single('profile') , 
router.put('/:id/edit',upload.single('profile'), updateUser);
//app.put("/user/:id/:uId", 
router.put('/:id/:uId',followUser);
router.get('/all', fetchAllUsers);

module.exports = router;
