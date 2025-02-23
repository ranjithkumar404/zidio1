const express = require("express");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

// Route to get all registered users
router.get("/", getUsers);

module.exports = router;
