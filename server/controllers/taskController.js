const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, assignedTo, deadline } = req.body;
  const task = new Task({ title, description, assignedTo, deadline });
  await task.save();
  res.json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'username');
  res.json(tasks);
};

exports.getUserTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  Object.assign(task, req.body);
  await task.save();
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
