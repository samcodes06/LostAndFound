import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/ChangePasswordPage.css";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    try {
      const response = await api.put(
        "/auth/change-password",
        formData
      );

      showToast(
        response.data.message,
        "success"
      );

      navigate("/profile");

    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to change password",
        "error"
      );
    }
  };

  return (
    <div className="change-password-page">

      <div className="change-password-container">

        {/* Back */}
        <Link
          to="/profile"
          className="change-password-back"
        >
          ← Back to Profile
        </Link>

        {/* Header */}
        <div className="change-password-header">
          <h1>Change Password</h1>

          <p>
            Update your password to keep your account secure.
          </p>
        </div>

        {/* Card */}
        <div className="change-password-card">

          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >

            {/* Current Password */}
            <div className="change-password-group">
              <label>Current Password</label>

              <div className="password-field">
                <input
                  type={
                    showPasswords
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="change-password-group">
              <label>New Password</label>

              <div className="password-field">
                <input
                  type={
                    showPasswords
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="change-password-group">
              <label>Confirm New Password</label>

              <div className="password-field">
                <input
                  type={
                    showPasswords
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {/* Show Password */}
            <button
              type="button"
              className="password-show-btn"
              onClick={() =>
                setShowPasswords(!showPasswords)
              }
            >
              {showPasswords
                ? "🙈 Hide Passwords"
                : "👁 Show Passwords"}
            </button>

            {/* Actions */}
            <div className="change-password-actions">

              <button
                type="button"
                className="password-cancel-btn"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="password-submit-btn"
              >
                Change Password
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ChangePasswordPage;