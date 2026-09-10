import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import "../styles/LoginPage.css";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        identifier,
        password
      });

      const data = response.data;

      localStorage.setItem("token", data.token);

      if (data.username) {
        localStorage.setItem("username", data.username);
      }

      // Load logged-in user
      const profileResponse = await api.get("/auth/profile");

      setUser(profileResponse.data.user);

      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-container">

        <div className="login-brand">
          <Link to="/">← Lost & Found</Link>
        </div>

        <div className="login-card">

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to Lost & Found</p>
          </div>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label>Email or Username</label>

              <input
                type="text"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value)
                }
                required
              />
            </div>

            <div className="login-form-group">
              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◉̸"}
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="login-register">
            Don't have an account?{" "}
            <Link to="/register">
              Sign Up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;