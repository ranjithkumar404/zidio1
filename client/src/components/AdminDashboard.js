import { useEffect, useState } from "react";
import { fetchUsers, fetchTasks, addTask, deleteTask } from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", priority: "Low" });
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadAllTasks();
  }, []);

  const loadUsers = async () => {
    const { data } = await fetchUsers();
    const filteredUsers = data.filter(user => user.role === "User");
    setUsers(filteredUsers);
  };

  const loadAllTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.assignedTo) {
      alert("Please select a user to assign the task.");
      return;
    }

    await addTask(newTask);
    setNewTask({ title: "", description: "", assignedTo: "", priority: "Low" });
    loadAllTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    loadAllTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            className="border p-3 rounded-lg"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Task Description"
            className="border p-3 rounded-lg"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            className="border p-3 rounded-lg"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <select
            className="border p-3 rounded-lg"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={handleAddTask}
            className="bg-green-500 text-white px-6 py-3 rounded-lg col-span-2 hover:bg-green-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tasks List</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-gray-500">Assigned to: {task.assignedTo.username}</p>
                  <p className="text-gray-500">
                    Status:{" "}
                    {task.status === "Pending" ? (
                      <span className="text-yellow-500">Pending</span>
                    ) : (
                      <span className="text-green-500">Completed</span>
                    )}
                  </p>
                  <p className="text-gray-500">Priority: {task.priority}</p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
