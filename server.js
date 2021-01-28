//*** Dependencies ***//
//====================//
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//*** Express set up ***//
//======================//
var PORT = process.env.PORT || 3000;
const app = express();

//*** Middleware ***//
//==================// 
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//*** Routers ***//
//===============//
app.use(require("./routes/html-routes.js"));
app.use(require("./routes/api-routes.js"));

//*** Listener ***//
//================//
app.listen(PORT, () => { console.log(`App running on port ${PORT}!`)});