const User = require('../models/userModel.js');
const bcryptjs = require('bcryptjs');


const followUnfollow = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
}


const updateUser = async (req, res) => {
	const {name, email, username, password, profilePic, bio} = req.body;
	const userId = req.user._id;
	try {
		const user = await User.findById(userId);
		if(!user) return res.status(400).json({message: 'User not found!'});

		if(password){
			const hashedPassword = bcryptjs.hashSync(password, 10);
			user.password = hashedPassword;
		}
	} catch (error) {
		res.status(500).json({message: error.message});
		console.log('Error in updateUser: ', error.message);
	}
}




module.exports = {followUnfollow, updateUser};