const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const key = process.env.ACCESS_SECRET_TOKEN;

const auth = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied, token required" });
    }

    token = token.split(" ")[1]; // Extract token after 'Bearer'
    
    try {
        const decoded = jwt.verify(token, key);
        req.userId = decoded.id;
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = auth;
