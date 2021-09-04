
import theDb from "./db/db"
require('dotenv').config()
console.log(`server starting!!`)
console.debug(`connecting db on host ${process.env.PLANTS_MONGODB_HOST}....`)
const uri = `mongodb://${process.env.PLANTS_MONGODB_USER}:${process.env.PLANTS_MONGODB_PASS}@${process.env.PLANTS_MONGODB_HOST}:27017/plants`
console.debug(uri)
const db = new theDb(uri)

//console.log(`connected to db and found ${db.plantsCollection.count}`)
// import PM from "./dataSources/prairieMoon/prairieMoon"
// const pm = new PM()
// //pm.getProducts()
