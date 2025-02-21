const express = require('express');
const { createTask, getTasks, getUserTasks, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:userId', getUserTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
module.exports = router;