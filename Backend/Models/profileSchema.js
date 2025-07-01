const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  skillsOffered: [{
    type: String,
    required: true,
  }],
  skillsWanted: [{
    type: String,
    required: true,
  }],
  availability: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  averageRating: { 
    type: Number, 
    default: 0 
  },
  totalRatings: { 
    type: Number, 
    default: 0 
  },
  ratingBreakdown: {
    type: Map,
    of: Number,
    default: () => ({
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    }),
  },
  ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
