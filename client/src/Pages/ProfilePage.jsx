import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { UserContext } from "../userContext/UserContext";
import PlacesPage from "./PlacesPage";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/auth/update-profile", {
        name,
        email,
        password
      });
      if (res.data.success) {
        setUser(res.data.user); // Update user context
        toast.success("Profile updated successfully");
        setEditMode(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

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
          {editMode ? (
            <form onSubmit={handleUpdate} className="max-w-md mx-auto">
              <h2 className="text-2xl mb-4">Update Profile</h2>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password (leave blank to keep current)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="primary max-w-sm mt-2" type="submit">
                Save Changes
              </button>
              <button
                className="secondary max-w-sm mt-2 ml-2"
                type="button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>Logged in as {user.name} ({user.email})</p>
              <button className="primary max-w-sm mt-2" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
              <button className="secondary max-w-sm mt-2 ml-2" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;
