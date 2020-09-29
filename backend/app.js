const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const postsRoutes = require('./routes/posts')
const app = express();

// Connect to DB
mongoose
  .connect(
    "mongodb+srv://SY:mongoboner@cluster0.ywepy.mongodb.net/accordeon?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// set Headers and allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  // KVP, allow any domain origins
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept"  // allow these extra Headers in addition to the default ones
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" // OPTIONS is sent by default prior to POST requests to check if valid
  );
  next();
});

// using the routes
app.use('/api/posts', postsRoutes);




module.exports = app;
