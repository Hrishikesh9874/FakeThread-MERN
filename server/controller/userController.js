const User = require('../models/userModel.js');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');


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
	}
}


const updateUser = async (req, res) => {
	try {

		if(req.body.password){
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}
		
		const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: {
				name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                bio: req.body.bio,
				profilePic: req.body.profilePic
            }
        }, {new: true});

		if(!updatedUser){
			return res.status(400).json({error: 'User not found!'});
		}

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getUserProfile = async (req, res) => {
	const {query} = req.params;
	try {
		let user;
		if(mongoose.Types.ObjectId.isValid(query)){
			user = await User.findOne({_id: query}).select("-password").select("-updatedAt");
		}else{
			user = await User.findOne({username: query}).select("-password").select("-updatedAt");
		}
		if(!user) return res.status(400).json({error: 'User not found!'});
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}




module.exports = {followUnfollow, updateUser, getUserProfile};