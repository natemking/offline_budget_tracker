//*** Dependencies ***//
//====================//
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//*** Express app ***//
//===================//
const PORT = 3000;
const app = express();

//*** Middleware ***//
//==================// 
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true 
// });

//*** Routers ***//
//===============//
app.use(require("./routes/api-routes.js"));

app.listen(PORT, () => { console.log(`App running on port ${PORT}!`)});