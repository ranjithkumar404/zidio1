import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "User",
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(credentials);
      navigate("/"); // Redirect to login after successful registration
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Register</h2>
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
        <select
          className="border p-2 mb-2 w-full"
          onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
          value={credentials.role}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </div>
    </div>
  );
};

export default Register;
