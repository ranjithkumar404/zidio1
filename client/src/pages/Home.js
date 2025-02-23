import React from "react";
import Login from "../components/Login";

const Home = ({ setUser }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Task Management System</h1>
      <Login setUser={setUser} />
    </div>
  );
};

export default Home;
