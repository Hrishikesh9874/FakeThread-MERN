const User = require('../models/userModel.js');
const bcryptjs = require('bcryptjs');
const setCookie = require('../utils/setCookie.js');


const signup = async (req, res) => {
    try {        
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or: [{email}, {username}]});

        if(user){
            return res.status(400).json({message: 'User already exist!'})
        }

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




module.exports = {signup, signin};