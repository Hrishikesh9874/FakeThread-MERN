const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./db/connectDb.js');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute.js');


const app = express();

dotenv.config();
connectDb();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use('/api/auth', authRoute);


app.listen(process.env.PORT, ()=> console.log(`Server is running on localhost ${process.env.PORT}`))