import { useEffect, useState } from "react";
import { fetchUserTasks, updateTask, addComment,fetchMeetings } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      loadTasks();
      loadMeetings();
    }
  }, [user]);

  const loadMeetings = async () => {
    try {
      const data = await fetchMeetings();
    
      
      // Assuming each meeting has a `participants` array of userIds
      const userMeetings = data.filter(meeting =>
        meeting.users?.some(u => u._id === user.userId)
      );
      
      
      
      setMeetings(userMeetings);
    } catch (error) {
      toast.error("Failed to load meetings.");
    }
  };

  const loadTasks = async () => {
    try {
      const { data } = await fetchUserTasks(user.userId);
      setTasks(data || []);
    } catch (error) {
      toast.error("Failed to load tasks.");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await updateTask(id, { status: "Completed" });
      loadTasks();
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddComment = async (taskId, commentText) => {
    if (!commentText.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    const commentData = {
      text: commentText,
      author: user.userId,
    };

    try {
      await addComment(taskId, commentData);
      toast.success("Comment added!");
      loadTasks();
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const generatePieData = () => {
    const taskStatusCount = tasks.reduce(
      (acc, task) => {
        if (task.status === "Pending" || task.status === "Completed") {
          acc[task.status]++;
        }
        return acc;
      },
      { Pending: 0, Completed: 0 }
    );

    return {
      labels: ["Pending", "Completed"],
      datasets: [
        {
          data: [taskStatusCount.Pending, taskStatusCount.Completed],
          backgroundColor: ["#FF6347", "#32CD32"],
        },
      ],
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>




      {/* Task Status Breakdown Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Status Breakdown</h2>
        <div className="w-full max-w-[400px] mx-auto">
          <Pie data={generatePieData()} options={{ responsive: true }} />
        </div>
      </div>


{/* Scheduled Meetings */}
<div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Scheduled Meetings</h2>
  {meetings.length === 0 ? (
    <p className="text-gray-600">No upcoming meetings scheduled.</p>
  ) : (
    <ul className="space-y-3">
      {meetings.map((meeting, index) => (
        <li key={index} className="border p-4 rounded-lg bg-gray-50">
          <p className="text-lg font-medium text-gray-700">Topic: {meeting.title}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(meeting.date).toLocaleDateString()} | Time:{" "}
            {new Date(meeting.date).toLocaleTimeString()}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>
      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-600 mt-6">
          No tasks assigned yet. Please contact an admin.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === "Completed"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
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

              {/* Comments */}
              {task.comments?.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Comments:</h4>
                  {task.comments.map((comment, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-gray-800">
                        <span className="font-medium">
                          {comment.author?.username || "Unknown"}
                        </span>
                        : {comment.text}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="border p-2 rounded-lg w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(task._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UserDashboard;
