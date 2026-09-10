import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import useNotification from "../context/useNotification";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { showToast, showConfirm } = useNotification();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = await showConfirm(
      "Are you sure you want to permanently delete your account? This will delete all your items, claims, notifications, and profile data. This action cannot be undone.",
      "Delete Account"
    );

    if (!confirmDelete) return;

    const secondConfirm = await showConfirm(
      "This is permanent. Are you absolutely sure you want to delete your account?",
      "Confirm Permanent Deletion"
    );

    if (!secondConfirm) return;

    try {
      const response = await api.delete("/auth/delete-account");

      showToast(response.data.message, "success");

      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account", error);

      showToast(
        error.response?.data?.message ||
          "Failed to delete account",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        Profile not found
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>
            View and manage your personal information.
          </p>
        </div>

        <button
          className="profile-back-btn"
          onClick={() => navigate("/home")}
        >
          ← Home
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">

        {/* Profile Top */}
        <div className="profile-top">

          <div className="profile-image-container">
            {user.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt={user.name}
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                👤
              </div>
            )}
          </div>

          <div className="profile-name-section">
            <h2>{user.name}</h2>
            <p>@{user.username}</p>
          </div>

        </div>

        {/* User Information */}
        <div className="profile-info">

          <div className="profile-info-item">
            <span>Username</span>
            <strong>@{user.username}</strong>
          </div>

          <div className="profile-info-item">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info-item">
            <span>Phone</span>
            <strong>
              {user.phone || "Not provided"}
            </strong>
          </div>

          <div className="profile-info-item">
            <span>Profession</span>
            <strong>
              {user.profession || "Not specified"}
            </strong>
          </div>

          <div className="profile-info-item">
            <span>Date of Birth</span>
            <strong>
              {user.dateOfBirth
                ? new Date(
                    user.dateOfBirth
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Not provided"}
            </strong>
          </div>

        </div>

        {/* Actions */}
        <div className="profile-actions">

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            ✏️ Edit Profile
          </button>

          <button
            className="change-password-btn"
            onClick={() =>
              navigate("/change-password")
            }
          >
            🔒 Change Password
          </button>

        </div>

      </div>

      {/* Danger Zone */}
      <div className="danger-zone">

        <div>
          <h3>Danger Zone</h3>

          <p>
            Permanently delete your account and all
            associated data.
          </p>
        </div>

        <button
          className="delete-account-btn"
          onClick={handleDeleteAccount}
        >
          🗑️ Delete My Account
        </button>

      </div>

    </div>
  );
}

export default ProfilePage;