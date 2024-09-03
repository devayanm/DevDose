import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../services/api";

function UserProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUserProfile();
      dispatch({ type: "SET_USER", payload: userData });
      setFormData({
        username: userData.username,
        email: userData.email,
      });
    };

    loadUser();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      dispatch({ type: "SET_USER", payload: formData });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <div>Please log in to see your profile.</div>;
  }

  return (
    <div className="user-profile">
      <h2>Profile</h2>
      <div>
        <label>
          Username:
          {editMode ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          ) : (
            <span>{user.username}</span>
          )}
        </label>
      </div>
      <div>
        <label>
          Email:
          {editMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </label>
      </div>
      {editMode ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
    </div>
  );
}

export default UserProfile;
