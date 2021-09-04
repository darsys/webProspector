"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var theDB = /** @class */ (function () {
    function theDB(uri, options) {
        var _this = this;
        this.mongoClient = new mongodb_1.MongoClient(uri, { useNewUrlParser: true });
        this.mongoClient.connect()
            .then(function (myClient) {
            _this.mongoClient = myClient;
            _this.db = myClient.db('plants');
            console.log('database connected');
            _this.getPlants;
            return _this;
        })["catch"](function (err) { return console.log(err); });
    }
    theDB.prototype.getPlants = function () {
        // create/connect to plants collection
        this.db.createCollection('plants', function (err, res) {
            if (err)
                throw err;
            console.debug(res.collectionName + " data collection created/connected.");
            this.plantsCollection = res;
        });
    };
    return theDB;
}());
exports["default"] = theDB;
