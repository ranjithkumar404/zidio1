import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Login from "./components/Login";
import Register from "./components/Register";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null); 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setUser={setUser}/>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={user?.role === "Admin" ? <Admin /> : <Home />} />
        <Route path="/user" element={user?.role === "User" ? <User user={user} setUser={setUser} /> : <Home />} />

      </Routes>
    </Router>
  );
}
  
export default App;
