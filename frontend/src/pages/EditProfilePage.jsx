import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/EditProfilePage.css";

function EditProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    profession: "",
    dateOfBirth: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get current profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const user = response.data.user;

        setFormData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          profession: user.profession || "",
          dateOfBirth: user.dateOfBirth
            ? user.dateOfBirth.split("T")[0]
            : ""
        });

        if (user.profileImage?.url) {
          setPreviewImage(user.profileImage.url);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // 1. Update profile information
      const profileData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        dateOfBirth: formData.dateOfBirth
      };

      await api.put("/auth/profile", profileData);

      // 2. Upload profile picture
      if (profileImage) {
        const imageData = new FormData();

        imageData.append("profileImage", profileImage);

        await api.put(
          "/auth/profile-image",
          imageData
        );
      }

      showToast(
        "Profile updated successfully!",
        "success"
      );

      navigate("/profile");

    } catch (error) {
      console.error("Failed to update profile", error);

      showToast(
        error.response?.data?.message ||
          "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="edit-profile-page">

      {/* Header */}
      <div className="edit-profile-header">

        <Link
          to="/profile"
          className="edit-profile-back"
        >
          ← Back to Profile
        </Link>

        <h1>Edit Profile</h1>

        <p>
          Update your personal information and profile picture.
        </p>

      </div>

      {/* Card */}
      <div className="edit-profile-card">

        {/* Profile Picture */}
        <div className="edit-profile-image-section">

          <div className="edit-profile-image-wrapper">

            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="edit-profile-image"
              />
            ) : (
              <div className="edit-profile-placeholder">
                👤
              </div>
            )}

          </div>

          <div className="profile-image-controls">

            <label
              htmlFor="profileImage"
              className="change-profile-image-btn"
            >
              📷 Change Profile Picture
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <p>
              Choose a JPG, PNG or other image.
            </p>

          </div>

        </div>

        {/* Form */}
        <form
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div className="edit-profile-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Username */}
          <div className="edit-profile-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email */}
          <div className="edit-profile-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          {/* Phone */}
          <div className="edit-profile-group">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Profession */}
          <div className="edit-profile-group">
            <label>Profession</label>

            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Enter your profession"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="edit-profile-group">
            <label>Date of Birth</label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="edit-profile-actions">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProfilePage;