const express = require("express");
const { createTask, getTasks, getUserTasks, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

// ✅ Admin fetches all tasks
router.get("/", getTasks);

// ✅ User fetches their own tasks
router.get("/user/:userId", getUserTasks);

// ✅ Admin assigns a task
router.post("/", createTask);

// ✅ User/Admin updates a task (e.g., mark as completed)
router.put("/:id", updateTask);

// ✅ Admin deletes a task
router.delete("/:id", deleteTask);

module.exports = router;
