const User = require("../models/userModel.js");
const Post = require("../models/postModel.js");


const createPost = async (req, res) => {
  try {
    const { text, img } = req.body;

    if (!text) {
      res
        .status(400)
        .json({ message: "Postedby and text fields are required!" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (text.length > 500) {
      return res
        .status(400)
        .json({ message: "Text must be less than 500 characters" });
    }

    const postedBy = req.user.id;
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json({ message: "Posts created successfully!", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in creating post: ", error.message);
  }
}

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("message: 'Post not found");
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.postedBy.toString() !== req.user.id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete the post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not Found!" });
    }

    const userLikedPost = post.likes.includes(req.user.id);

    if (userLikedPost) {
      await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.user.id } }
      );
      res.status(200).json({ message: "Post unliked Successfully!" });
    } else {
      post.likes.push(req.user.id);
      await post.save();
      res.status(200).json({ message: "Post liked Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(404).json({ message: "The text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    post.save();
    res.status(201).json({message: 'Reply added successfully!', post});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1});
        res.status(200).json({feedPosts});
    } catch (error) {
        console.log('Error in getFeedPosts: ', error.message);
        res.status(500).json({message: error.message});        
    }
}


module.exports = {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts
};
