import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const Login = ({ setUser }) => {
  //console.log("setUser in Login.js:", setUser);  // Debugging

  if (!setUser) {
    console.error("setUser prop is not passed correctly to Login.js!");
  }

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await login(credentials);
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);  // Make sure this doesn't crash!
      console.log("didn't crash");  // Debugging
      
      navigate(data.role === "Admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Haven't registered yet?</p>
          <button 
            onClick={() => navigate("/register")} 
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
