const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.access_token;

		if (!token) return res.status(401).json({ error: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;

		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = protectRoute;