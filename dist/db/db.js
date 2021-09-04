"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class theDB {
    constructor(uri, options) {
        this.mongoClient = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.mongoClient.connect()
            .then((myClient) => {
            this.mongoClient = myClient;
            this.db = myClient.db('plants');
            this.getPlants();
            console.log('database connected');
            this.getPlants;
            return this;
        })
            .catch((err) => console.log(err));
    }
    getPlants() {
        // create/connect to plants collection
        console.log('creating plant collection');
        this.db.createCollection('plants', function (err, plantCollection) {
            if (err)
                throw err;
            console.debug(`${plantCollection.collectionName} data collection created/connected.`);
            this.plantsCollection = plantCollection;
            console.debug(`connected to db and found ${this.plantsCollection.count}`);
        });
    }
}
exports.default = theDB;
//# sourceMappingURL=db.js.map