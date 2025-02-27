const User = require("../models/User"); // Import the User model

// Fetch all users (only returning `id` and `username` for security)
const getUsers = async (req, res) => {
    try {
      const users = await User.find({}, "username _id role"); // Include 'role' field
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  };
  

module.exports = { getUsers };
