const User = require('../model/User');
const cloudinary = require('../config/cloudinary')
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { username, name, email } = req.body;
      const profileUrl = req.file ? req.file.path : null; 
      console.log(req.body,"data is this i am waiting for")
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (profileUrl && user.profile) {
        const urlParts = user.profile.split('/');
        const oldImagePublicId = urlParts[urlParts.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(`wanderlust_DEV/${oldImagePublicId}`);
      }
      const updatedUser = await User.findByIdAndUpdate(id, {
        username,
        name,
        email,
        profile: profileUrl || user.profile, 
      }, { new: true });
  
      res.json({user:updatedUser});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  };

const followUser = async (req, res) => {
    try {
        const { id, uId } = req.params;
        const { action } = req.body; // expect 'addFollower', 'removeFollower', 'addFollowing', 'removeFollowing'
        const user = await User.findById(id);
        const targetUser = await User.findById(uId);
        console.log("KOK",targetUser.followings.includes(id));
        
        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
            if (!targetUser.followings.includes(id)) {
                const Man = await User.findByIdAndUpdate(uId, {
                    $push: { followings: id },
                    $inc: { nFollowing: 1 }
                }, { new: true });
                const coMan = await User.findByIdAndUpdate(id, {
                    $push: { followers: uId },
                    $inc: { nFollowers: 1 }
                }, { new: true });
                res.json({ message: "Follower added successfully",user:Man,coMan });
            }else{
                const Man =  await User.findByIdAndUpdate(uId, {
                    $pull: { followings: id },
                    $inc: { nFollowing: -1 }
                }, { new: true });
                const coMan =  await User.findByIdAndUpdate(id, {
                    $pull: { followers: uId },
                    $inc: { nFollowers: -1 }
                }, { new: true });
                res.json({ message: "Follower removed successfully",user:Man,coMan });
            }
            console.log(user,targetUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fetchAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

module.exports = { getUser, updateUser, followUser, fetchAllUsers };
