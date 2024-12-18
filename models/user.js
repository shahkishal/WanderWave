const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose); // this plugin automatically takes username , password and add hash function and salt to it .

module.exports = mongoose.model("User" , userSchema);