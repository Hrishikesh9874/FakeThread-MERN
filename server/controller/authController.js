const User = require('../models/userModel.js');
const bcryptjs = require('bcryptjs');
const setCookie = require('../utils/setCookie.js');


const signup = async (req, res) => {
    try {        
        const {firstName, lastName, email, password} = req.body;
        const name = firstName.trim() + ' ' + lastName.trim();
        const user = await User.findOne({email});
        if(!firstName){
            return res.status(400).json({error: 'First name is required!'});
        }
        if (!email.includes('@') || (!email.endsWith(".in") && !email.endsWith(".com"))) {
            return res.status(400).json({ error: 'Enter a valid email!' });
        }        
        if(!password || password.length < 6){
            return res.status(400).json({error: 'Password should atleast be 6 characters long'});
        }

        if(user){
            return res.status(400).json({error: 'User already exist with this email!'})
        }
        const username = name.split(" ").join("").toLowerCase() + "_" + Math.random().toString(36).slice(-4);
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            name, email, username, password: hashedPassword
        })
        await newUser.save();

        if(newUser){
            res.status(201).json({message: `Hi ${name}, You have successfully signed up!`});
        }else{
            res.status(400).json({error: 'Invalid user data'});
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const signin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error: 'Invalid email!'})
        const isPassCorrect = await bcryptjs.compare(password, user.password);
        if(!isPassCorrect) return res.status(400).json({error: 'Invalid password!'});

        setCookie(user._id, res);

        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({message: 'User logged out successfully!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const google = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            setCookie(user._id, res);
            const {password: pass, ...rest} = user._doc;
            res.status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                name: req.body.name,
                username: req.body.name.split(" ").join("").toLowerCase() + "_" + Math.random().toString(36).slice(-4),
                email: req.body.email,
                profilePic: req.body.profilePic,
                password: hashedPassword
            })
            await newUser.save();

            setCookie(newUser._id, res);
            const {password: pass, ...rest} = newUser._doc;
            res.status(200).json(rest);
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}





module.exports = {signup, signin, logout, google};