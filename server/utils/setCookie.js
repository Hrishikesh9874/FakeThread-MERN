const jwt = require('jsonwebtoken');

const setCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);

    res.cookie('access_token', token, {httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000})

    return token;
}

module.exports = setCookie;