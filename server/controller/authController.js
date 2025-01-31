const User = require('../models/userModel.js');
const bcryptjs = require('bcryptjs');
const setCookie = require('../utils/setCookie.js');


const signup = async (req, res) => {
    try {        
        const {name, email, password} = req.body;
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: 'User already exist with this email!'})
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
            res.status(400).json({message: 'Invalid user data'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(`Error is signup: ${error.message}`);
    }
}

const signin = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({message: 'Invalid username!'})
        const isPassCorrect = await bcryptjs.compare(password, user.password);
        if(!isPassCorrect) return res.status(400).json({message: 'Invalid password!'});

        setCookie(user._id, res);

        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(`Error in login: `, error.message);
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({message: 'User logged out successfully!'});
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log('Error in signout: ', error.message);
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
                password: hashedPassword
            })
            await newUser.save();

            setCookie(newUser._id, res);
            const {password: pass, ...rest} = newUser._doc;
            res.status(200).json(rest);
        }
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log('Error in signup with google: ', error.message);
    }
}





module.exports = {signup, signin, logout, google};