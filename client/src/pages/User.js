import React from "react";
import UserDashboard from "../components/UserDashboard";

const User = ({user, setUser}) => {
  return (
    <div>
      <UserDashboard user={user} />
    </div>
  );
};

export default User;
