const profileModel = require("../Models/profileSchema");
const userModel = require("../Models/userModel");
const Roadmap = require("../Models/roadMapSchema"); // ✅ Imported Roadmap model

// ✅ Create Profile
const createProfile = async (req, res) => {
    const {
        location,
        about,
        skillsOffered,
        skillsWanted,
        availability,
        linkedin,
        github,
        instagram
    } = req.body;

    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingProfile = await profileModel.findOne({ userId: req.userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const newProfile = await profileModel.create({
            userId: req.userId,
            location,
            about,
            skillsOffered,
            skillsWanted,
            availability,
            linkedin,
            github,
            instagram
        });

        // ✅ Get matching roadmaps based on skillsWanted
        const roadmaps = await Roadmap.find({
            skillName: { $in: skillsWanted.map(skill => skill.toLowerCase()) }
        });

        res.status(201).json({
            message: "Profile created successfully",
            profile: newProfile,
            roadmaps
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating the profile", error });
    }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
    try {
        const profile = await profileModel.findOne({ userId: req.userId })
            .populate('userId', 'firstName lastName email')
            .select('-__v');

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
    const {
        location,
        about,
        skillsOffered,
        skillsWanted,
        availability,
        linkedin,
        github,
        instagram
    } = req.body;

    try {
        const profile = await profileModel.findOne({ userId: req.userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.location = location || profile.location;
        profile.about = about || profile.about;
        profile.skillsOffered = skillsOffered || profile.skillsOffered;
        profile.skillsWanted = skillsWanted || profile.skillsWanted;
        profile.availability = availability || profile.availability;
        profile.linkedin = linkedin || profile.linkedin;
        profile.github = github || profile.github;
        profile.instagram = instagram || profile.instagram;

        await profile.save();

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// ✅ Delete Profile
const deleteProfile = async (req, res) => {
    try {
        const profile = await profileModel.findOne({ userId: req.userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        await profileModel.deleteOne({ userId: req.userId });

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the profile" });
    }
};

// ✅ Rate a User Profile (with rating breakdown)
const rateUser = async (req, res) => {
    try {
        const { ratedUserId, rating } = req.body;
        const ratingUserId = req.userId;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
        }

        const profile = await profileModel.findOne({ userId: ratedUserId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        if (profile.ratedBy.includes(ratingUserId)) {
            return res.status(400).json({ message: "You have already rated this user" });
        }

        const currentCount = profile.ratingBreakdown.get(rating.toString()) || 0;
        profile.ratingBreakdown.set(rating.toString(), currentCount + 1);

        profile.totalRatings += 1;

        let totalScore = 0;
        for (let i = 1; i <= 5; i++) {
            const count = profile.ratingBreakdown.get(i.toString()) || 0;
            totalScore += i * count;
        }

        profile.averageRating = parseFloat((totalScore / profile.totalRatings).toFixed(1));
        profile.ratedBy.push(ratingUserId);
        await profile.save();

        res.status(201).json({
            message: "Rating submitted successfully!",
            averageRating: profile.averageRating,
            totalRatings: profile.totalRatings,
            ratingBreakdown: Object.fromEntries(profile.ratingBreakdown)
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while rating the user", error });
    }
};

// ✅ Get All Profiles
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await profileModel.find()
            .populate('userId', 'firstName lastName email')
            .select('-__v');

        if (profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" });
        }

        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching profiles" });
    }
};

// ✅ Get Rating Details for a User
const getUserRating = async (req, res) => {
    try {
        const profile = await profileModel.findOne({ userId: req.params.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({
            averageRating: profile.averageRating,
            totalRatings: profile.totalRatings,
            ratingBreakdown: Object.fromEntries(profile.ratingBreakdown)
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching ratings" });
    }
};

const hasAlreadyRated = async (req, res) => {
    try {
        const ratedUserId = req.params.id;
        const ratingUserId = req.userId;

        const profile = await profileModel.findOne({ userId: ratedUserId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const alreadyRated = profile.ratedBy.includes(ratingUserId);

        res.status(200).json({ alreadyRated });
    } catch (error) {
        res.status(500).json({ message: "Error checking rating status" });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    rateUser,
    getUserRating,
    getAllProfiles,
    hasAlreadyRated
};
