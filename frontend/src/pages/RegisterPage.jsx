import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    profession: "",
    dateOfBirth: "",
    password: ""
  });

  const [usernameStatus, setUsernameStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generate username from full name
  const generateUsername = async (name) => {
    if (!name.trim()) {
      setFormData((prev) => ({
        ...prev,
        username: ""
      }));
      setUsernameStatus("");
      return;
    }

    try {
      setUsernameStatus("checking");

      const response = await fetch(
        `http://localhost:5000/api/auth/generate-username?name=${encodeURIComponent(
          name.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setUsernameStatus("");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        username: data.username
      }));

      setUsernameStatus("available");
    } catch (error) {
      console.error("Username generation failed:", error);
      setUsernameStatus("");
    }
  };

  // Check manually entered username
  const checkUsername = async (username) => {
    if (!username.trim()) {
      setUsernameStatus("");
      return;
    }

    try {
      setUsernameStatus("checking");

      const response = await fetch(
        `http://localhost:5000/api/auth/check-username?username=${encodeURIComponent(
          username.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setUsernameStatus("");
        return;
      }

      setUsernameStatus(
        data.available ? "available" : "taken"
      );
    } catch (error) {
      console.error("Username check failed:", error);
      setUsernameStatus("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Only check username when user manually changes it
    if (name === "username") {
      checkUsername(value);
    }
  };

  // Generate username after entering name
  const handleNameBlur = () => {
    if (formData.name.trim()) {
      generateUsername(formData.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.username) {
      setMessage("Please enter or generate a username.");
      return;
    }

    if (usernameStatus === "taken") {
      setMessage("Please choose an available username.");
      return;
    }

    if (usernameStatus === "checking") {
      setMessage("Please wait while checking the username.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>

      <div className="register-container">

        <div className="register-brand">
          <Link to="/">← Lost &amp; Found</Link>
        </div>

        <div className="register-card">

          <div className="register-header">
            <h1>Create Account</h1>
            <p>
              Join Lost &amp; Found and reconnect with your belongings.
            </p>
          </div>

          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="register-grid">

              {/* NAME */}
              <div className="register-form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleNameBlur}
                  required
                />
              </div>

              {/* USERNAME */}
              <div className="register-form-group">
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                {usernameStatus === "checking" && (
                  <small className="username-checking">
                    Checking username...
                  </small>
                )}

                {usernameStatus === "available" && (
                  <small className="username-available">
                    ✓ Username available
                  </small>
                )}

                {usernameStatus === "taken" && (
                  <small className="username-taken">
                    ✕ Username already taken
                  </small>
                )}
              </div>

              {/* EMAIL */}
              <div className="register-form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}
              <div className="register-form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PROFESSION */}
              <div className="register-form-group">
                <label>Profession</label>

                <input
                  type="text"
                  name="profession"
                  placeholder="Enter your profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DATE OF BIRTH */}
              <div className="register-form-group">
                <label>Date of Birth</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="register-form-group full-width">
                <label>Password</label>

                <div className="password-input-wrapper">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>
              </div>

            </div>

            <button
              type="submit"
              className="register-button"
              disabled={
                loading ||
                usernameStatus === "checking" ||
                usernameStatus === "taken"
              }
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <p className="register-login">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;