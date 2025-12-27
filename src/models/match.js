// const express = require('express');
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const matchSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    status: {
        type: String,
        enum : ["matched", "unmatched"],
        default: "matched"
    }

},{timestamps:true});


const Match = model("match",matchSchema);

module.exports = Match;