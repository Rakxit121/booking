import React, { useContext } from "react";
import { UserContext } from "../userContext/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";
const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/api/auth/logout");
    setUser(null);
    navigate("/");
    toast.success("Logout successfully");
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;
