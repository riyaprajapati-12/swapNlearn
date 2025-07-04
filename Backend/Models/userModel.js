const mongoose = require ("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    CreatedOn:{
        type:Date,
        default:new Date().getTime()
    },
})
module.exports=mongoose.model("User",userSchema) // yeh model ready krta h db me User name hoga db me iss schema ka 