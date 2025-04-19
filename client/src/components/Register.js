import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "User",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password.");
      return;
    }

    try {
      setIsLoading(true);
      await register(credentials);
      toast.success("Registration successful!", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
      toast.error("Registration failed. Try a different username.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-700 text-center">Task Management System</h1>
      </div>

      <div className="p-8 rounded-xl shadow-md max-w-sm w-full border border-gray-200 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />

        <select
          className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={credentials.role}
          onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={handleRegister}
          className="bg-green-600 text-white py-3 px-6 w-full rounded-lg hover:bg-green-700 transition duration-300"
        >
          Register
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Login here
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
