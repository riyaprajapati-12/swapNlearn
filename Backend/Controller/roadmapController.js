const Roadmap = require("../Models/roadMapSchema");

exports.getRoadmapsBySkills = async (req, res) => {
  
  const { skillsWanted } = req.query;


  if (!skillsWanted) {
    return res.status(400).json({ message: "Skills are required to fetch roadmaps" });
  }

  const skills = skillsWanted.split(",").map(skill => skill.trim().toLowerCase()); 
  try {
    // Fetch roadmaps matching any of the skills
    const roadmaps = await Roadmap.find({
      skillName: { $in: skills }
    });

    if (!roadmaps.length) {
      return res.status(404).json({ message: "No matching roadmaps found" });
    }

    res.status(200).json(roadmaps); // Return the found roadmaps
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
