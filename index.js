const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('connected to DB');
});


// IMPORT ROUTES
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

// ROUTE MIDDLEWARES
app.use(express.json());

// all the requests to /api/user go through authRoute
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);


app.listen(3000, () => console.log('server up and running !'));