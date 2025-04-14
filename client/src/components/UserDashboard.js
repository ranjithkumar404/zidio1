import { useEffect, useState } from "react";
import { fetchUserTasks, updateTask } from "../services/api";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${task.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"}`}>
                {task.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Priority: {task.priority}</span>
              {task.status !== "Completed" && (
                <button
                  onClick={() => handleCompleteTask(task._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
