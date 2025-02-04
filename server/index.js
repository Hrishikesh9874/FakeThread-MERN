const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./db/connectDb.js');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');
const postRoute = require('./routes/postRoute.js');
const cloudinary = require('cloudinary');


const app = express();

dotenv.config();
connectDb();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);


app.listen(process.env.PORT, ()=> console.log(`Server is running on localhost ${process.env.PORT}`))