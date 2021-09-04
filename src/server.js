"use strict";
exports.__esModule = true;
console.log("server starting....);
var db_1 = require("./db/db");
var uri = 'mongodb://root:mypass@192.168.88.15:27017';
var db = new db_1["default"](uri);
//console.log(`connected to db and found ${db.plantsCollection.count}`)
