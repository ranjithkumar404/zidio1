import { useEffect, useState } from "react";
import { fetchUserTasks, updateTask } from "../services/api";
import { useNavigate } from "react-router-dom";
const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    console.log("the user is ",user);
    
    if (user?.userId) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    console.log("the user is " ,user);
    console.log("the user id is ",user.userId);
    
    
    const { data } = await fetchUserTasks(user.userId);
    setTasks(data);
  };

  const handleCompleteTask = async (id) => {
    await updateTask(id, { status: "Completed" });
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/login"); // Redirect to login page
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="border p-2 flex justify-between items-center mb-2">
            <span>{task.title}: {task.description} - {task.status}</span>
            {task.status !== "Completed" && <button onClick={() => handleCompleteTask(task._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Mark Complete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
