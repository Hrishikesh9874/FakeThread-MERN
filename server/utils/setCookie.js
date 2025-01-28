const jwt = require('jsonwebtoken');

const setCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);

    res.cookie('access_token', token, {httpOnly: true})

    return token;
}

module.exports = setCookie;