"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlantSchema = new mongoose_1.Schema({
    name: String,
    commonname: String,
    description: String,
    created: {
        yar, type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    },
    price_per_oz: Number,
    seeds_per_oz: Number,
    germination: String,
    lifecyle: String,
    light_pref: [String],
    moisture: [String],
    height: Number,
    bloom_months: [String],
    flower_color: String,
    features: [String],
    zones: [Number],
    spacing: { min: Number, max: Number },
});
exports.default = PlantSchema;
//# sourceMappingURL=plants.schema.js.map