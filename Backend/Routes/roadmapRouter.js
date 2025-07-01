const express = require("express");
const router = express.Router();
const { getRoadmapsBySkills } = require("../Controller/roadmapController");

router.get("/seedroadmap", getRoadmapsBySkills);

module.exports = router;
