const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = new Task({ title, description, assignedTo, deadline, priority });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// ✅ Fetch all tasks with assigned user details
// ✅ Fetch all tasks with assigned user details + comment authors
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username")
      .populate("comments.author", "username"); // ✅ Add this line
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Fetch tasks for a specific user + comment authors
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate("assignedTo", "username")
      .populate("comments.author", "username"); // ✅ Add this line
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tasks", error });
  }
};


// ✅ Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// ✅ Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

// Add comment to a task
exports.addCommentToTask = async (req, res) => {
  try {
    const { text, author } = req.body;
    const { taskId } = req.params;

    if (!text || !author) {
      return res.status(400).json({ message: "Comment text and author are required" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Push new comment
    task.comments.push({ text, author });
    await task.save();

    // Repopulate all fields for return
    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "username")
      .populate("comments.author", "username");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};
