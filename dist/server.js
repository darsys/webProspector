"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db/db");
require('dotenv').config();
console.log(`server starting!!`);
console.debug(`connecting db on host ${process.env.PLANTS_MONGODB_HOST}....`);
const uri = `mongodb://${process.env.PLANTS_MONGODB_USER}:${process.env.PLANTS_MONGODB_PASS}@${process.env.PLANTS_MONGODB_HOST}:27017/plants`;
console.debug(uri);
const db = new db_1.default(uri);
//console.log(`connected to db and found ${db.plantsCollection.count}`)
// import PM from "./dataSources/prairieMoon/prairieMoon"
// const pm = new PM()
// //pm.getProducts()
//# sourceMappingURL=server.js.map