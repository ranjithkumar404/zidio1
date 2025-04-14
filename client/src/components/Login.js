import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await login(credentials);
      if (!credentials.username || !credentials.password) {
        alert("Please enter both username and password.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate(data.role === "Admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
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
    </div>
  );
};

export default Login;
