import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!credentials.username && !credentials.password) {
      toast.error("Please enter both username and password.");
      return;
    }
    if (!credentials.username) {
      toast.error("Please enter the username");
      return;
    }
    if (!credentials.password) {
      toast.error("Please enter the password");
      return;
    }

    try {
      const { data } = await login(credentials);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate(data.role === "Admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="p-8 rounded-xl shadow-md max-w-sm w-full border border-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white py-3 px-6 w-full rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register here
          </button>
        </div>
      </div>
      {/* ✅ Toast container placed here */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
