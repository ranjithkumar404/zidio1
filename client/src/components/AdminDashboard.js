import { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchTasks,
  addTask,
  deleteTask,
  addComment,
  addMeeting,
  fetchMeetings
} from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDesc, setMeetingDesc] = useState('');
  const [meetings, setMeetings] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Low",
  });
  const [sortByPriority, setSortByPriority] = useState(false);
  const [sortByStatus, setSortByStatus] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setCurrentUser(userData);

    loadUsers();
    loadAllTasks();
    loadMeetings();
  }, []);


  const loadMeetings = async () => {
    try {
      
      const data  = await fetchMeetings();
      console.log("now its fetched",data);
      
      setMeetings(data);  // This will update the meetings state
    } catch (error) {
      toast.error("Failed to load meetings.");
    }
  };


  const loadUsers = async () => {
    try {
      const { data } = await fetchUsers();
      const filteredUsers = data.filter((user) => user.role === "User");
      setUsers(filteredUsers);
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };
  
  const handleScheduleMeeting = async () => {
    console.log("entered1");
    
    if (!meetingTitle || !meetingDesc || selectedUsers.length === 0 || !selectedDate) {
      toast.error('Please fill all meeting fields');
      return;
    }
  console.log("will send data");
  
    try {
      await addMeeting({
        title: meetingTitle,
        description: meetingDesc,
        date: selectedDate,
        users: selectedUsers,  // ✅ match backend expected field name
      });
  console.log("sent!");
  
      toast.success('Meeting scheduled successfully!');
      const { data } = await fetchMeetings();
      console.log("now its fetched",data);
      setMeetingTitle('');
      setMeetingDesc('');
      setSelectedUsers([]);
      setSelectedDate(new Date()); // reset calendar too if needed
    } catch (err) {
      toast.error('Failed to schedule meeting');
    }
  };
  

  const loadAllTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Error fetching tasks.");
    }
  };

  const handleAddTask = async () => {
    const { title, description, assignedTo, priority } = newTask;

    if (!title.trim() || !description.trim() || !assignedTo || !priority) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      await addTask(newTask);
      toast.success("Task added successfully!");
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Low",
      });
      loadAllTasks();
    } catch (error) {
      toast.error("Failed to add task.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully!");
      loadAllTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const handleAddComment = async (taskId, commentText) => {
    if (!commentText.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    const commentData = {
      text: commentText,
      author: currentUser.userId,
    };

    try {
      const response = await addComment(taskId, commentData);
      const updatedTask = response.data;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );

      setCommentTexts((prev) => ({ ...prev, [taskId]: "" }));
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getSortedTasks = () => {
    let sorted = [...tasks];

    if (sortByStatus) {
      const statusOrder = { Pending: 1, Completed: 2 };
      sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    if (sortByPriority) {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return sorted;
  };

  const getTaskStatusCount = () => {
    const statusCount = { Pending: 0, Completed: 0 };
    tasks.forEach(task => {
      if (task.status === "Pending") statusCount.Pending++;
      else if (task.status === "Completed") statusCount.Completed++;
    });
    return statusCount;
  };

  const statusCount = getTaskStatusCount();

  const pieData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [statusCount.Pending, statusCount.Completed],
        backgroundColor: ["#FFBB33", "#4CAF50"],
        hoverBackgroundColor: ["#FF9933", "#66BB6A"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} tasks`;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
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
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <select
            className="border p-3 rounded-lg"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
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
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
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

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Status Breakdown</h2>
  <div className="w-full max-w-[400px] mx-auto"> {/* Set max-width for the chart */}
    <Pie data={pieData} options={pieOptions} />
  </div>
</div>

<div className="m-2">
  {/* Meeting Scheduler */}
  <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
    <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium">Select Date</label>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="rounded border p-2"
        />
      </div>
      <div className="space-y-3">
        <div>
          <label className="block mb-1 font-medium">Meeting Title</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={meetingDesc}
            onChange={(e) => setMeetingDesc(e.target.value)}
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Users</label>
          <div className="border rounded px-3 py-2 max-h-32 overflow-y-auto space-y-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center space-x-2">
                <input
  type="checkbox"
  value={user._id}
  checked={selectedUsers.includes(user._id)}
  onChange={(e) => {
    const checked = e.target.checked;
    const userId = e.target.value;
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  }}
/>
                <span>{user.username}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleScheduleMeeting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Schedule Meeting
        </button>
      </div>
    </div>
  </div>

  {/* Scheduled Meetings Display */}
   <div className="bg-white shadow-md rounded-2xl p-4">
    <h2 className="text-xl font-semibold mb-4">Scheduled Meetings</h2>
    {meetings.length === 0 ? (
      <p className="text-gray-600">No meetings scheduled yet.</p>
    ) : (
      <ul className="space-y-4">
        {meetings.map((meeting) => (
          <li key={meeting._id} className="border rounded p-4">
            <h3 className="text-lg font-bold">{meeting.title}</h3>
            <p className="text-sm text-gray-700 mb-1">{meeting.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              Date: {new Date(meeting.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Participants:{" "}
              {meeting.users.map((u) => u.username).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div> 
</div>


      {/* Tasks List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Tasks List</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setSortByPriority((prev) => !prev)}
              className={`px-4 py-2 rounded-lg transition ${
                sortByPriority ? "bg-blue-600" : "bg-blue-500"
              } text-white`}
            >
              {sortByPriority ? "Remove Priority Sort" : "Sort by Priority"}
            </button>
            <button
              onClick={() => setSortByStatus((prev) => !prev)}
              className={`px-4 py-2 rounded-lg transition ${
                sortByStatus ? "bg-purple-600" : "bg-purple-500"
              } text-white`}
            >
              {sortByStatus ? "Remove Status Sort" : "Sort by Status"}
            </button>
          </div>
        </div>

        <ul className="space-y-4">
          {getSortedTasks().map((task) => (
            <li
              key={task._id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-gray-500">Assigned to: {task.assignedTo?.username || "Unknown"}</p>
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

              {/* Comments */}
              {task.comments?.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Comments:</h4>
                  {task.comments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((comment, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-gray-800">
                          <strong>{comment?.author?.username ?? "Unknown"}:</strong>
                          {comment.text}
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
                  value={commentTexts[task._id] || ""}
                  onChange={(e) =>
                    setCommentTexts((prev) => ({
                      ...prev,
                      [task._id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(task._id, commentTexts[task._id]);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;