const express = require("express");
const profileRouter = express.Router();
const { 
    createProfile, 
    getProfile, 
    updateProfile, 
    deleteProfile, 
    rateUser,        
    getUserRating,
    getAllProfiles,
    hasAlreadyRated  
} = require("../Controller/profileController");  
const auth = require("../Middleware/auth");

// 🔹 Profile Management
profileRouter.post('/createprofile', auth, createProfile);
profileRouter.get('/getprofile', auth, getProfile);
profileRouter.put('/updateprofile', auth, updateProfile);
profileRouter.delete('/deleteprofile', auth, deleteProfile); 
profileRouter.get('/allprofiles', auth, getAllProfiles); 

// 🔹 Rating System
profileRouter.post('/rate-user', auth, rateUser); 
profileRouter.get('/user/:id/ratings', getUserRating);  
profileRouter.get('/has-rated/:id', auth, hasAlreadyRated);
module.exports = profileRouter;
