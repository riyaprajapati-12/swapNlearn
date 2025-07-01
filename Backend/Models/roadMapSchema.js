const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  steps: [String]
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
