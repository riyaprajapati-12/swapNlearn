const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const key = process.env.ACCESS_SECRET_TOKEN;

//signup

const signup = async(req,res) =>{
    const {firstName,lastName,email,password} = req.body;

    try{
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
            return res.status(400).json({message:"user already exist"});
        }
        const result = await userModel.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password
        });
        const token = jwt.sign({email:result.email,id:result._id},key)
        res.json({user:result,token:token});
    }catch(error)
    {
        res.status(500).json({message:"Something went wrong"});
    }
}

//login

const signin = async (req,res) =>{
    try{
        const{email,password}=req.body;
        const existingUser= await userModel.findOne({email:email});
        if(!existingUser)
        {
            return res.status(404).json({message:"user not found"});
        }

        if (existingUser.password !== password) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},key);
        res.status(200).json({user:existingUser,token:token});
    }catch(error)
    {
        return res.status(404).json({message:"Something invalid"});
    }
}

//getUser

const getUser = async(req,res)=>{
    try{
        const getUser = await userModel.findOne({_id:req.userId});

        if(!getUser)
        {
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({
            firstName:getUser.firstName,
            lastName:getUser.lastName,
            email : getUser.email,
            _id: getUser._id
        });
    }catch(error)
    {
        res.status(500).json({message:"something went wrong"});
    }
};
module.exports = {getUser,signin,signup}