const mongoose = require("mongoose");
const itemSchema= new mongoose.Schema(
    {
        type:{
            type:String,
            enum:["LOST","FOUND"],
            required:true
        },
        category:{
            type:String,
            required:true,
            trim:true
        },
        itemName: {
            type:String,
            required:true,
            trim:true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        color:{
            type:String,
            trim:true
        },
        location:{
            type:String,
            required:true,
            trim:true
        },
        area: {
            type: String,
            required: true,
            trim: true
        },
        specificPlace:{
            type:String,
            required:true,
            trim:true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        images: [
           {
            url: {
                type: String,
                required: true
                },
            publicId: {
                type: String,
                required: true
                }
           }
        ],
        
        video: {
            url: String,
            publicId: String
        },
        status:{
            type:String,
            enum:["AVAILABLE","RETURNED"],
            default:"AVAILABLE"
        },

    },
    {
        timestamps:true
    }

);
const Item=mongoose.model("Item",itemSchema);
module.exports = Item;