import { useEffect, useState } from "react";
import { fetchUsers, fetchUserTasks, addTask, deleteTask,fetchTasks } from "../services/api";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "" });
  const navigate = useNavigate(); 
  useEffect(() => {
    loadUsers();
    loadAllTasks();
  }, []);

  const loadUsers = async () => {
    const { data } = await fetchUsers();
    console.log("data ",data);
    
    const filteredUsers = data.filter(user => user.role === "User");
    console.log("filtered users ",filteredUsers);
    
    setUsers(filteredUsers);
  };
  

  const loadAllTasks = async () => {
    try {
        const { data } = await fetchTasks(); 
       console.log("the tasks are ",data)
        setTasks(data);
    } catch (error) {
        console.error(" Error fetching tasks:", error.response?.data || error.message);
    }
};

  const handleAddTask = async () => {
    if (!newTask.assignedTo) {
      alert("Please select a user to assign the task.");
      return;
    }

    await addTask(newTask);
    setNewTask({ title: "", description: "", assignedTo: "" });
    loadAllTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    loadAllTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Title" className="border p-2 mr-2" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
        <input type="text" placeholder="Description" className="border p-2 mr-2" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />

        <select className="border p-2 mr-2" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}>
  <option value="">Select User</option>
  {users.map(user => <option key={user._id} value={user._id}>{user.username}</option>)}
</select>

        <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded">Add Task</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task._id} className="border p-2 flex justify-between items-center mb-2">
            <span>{task.title}: {task.description} (Assigned to: {task.assignedTo.username})</span>
            <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
