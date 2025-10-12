"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({  email: "", bio: "", role: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users");
        setUser(res.data.user);
        console.log("User Data: ", res.data);
        
        setFormData({
          // name: res.data.user.name || "No name yet",
          email: res.data.email || "",
          bio: res.data.bio || "no bio yet",
          role: res.data.role || "",
        });
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/users/${user._id}`, formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (err) {
      console.log("Error updating user:", err);
    }
  };

  if (!user) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">Your Profile</h1>

      {!editMode ? (
        <div className="space-y-3">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio || "No bio added yet"}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write about yourself..."
            className="w-full p-2 border rounded-md"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
