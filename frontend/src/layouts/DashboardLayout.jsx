import { useContext } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">

      {/* FIXED SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          Lost & Found
        </div>

        <nav className="dashboard-nav">

          <button
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            Home
          </button>

          <button
            className={location.pathname === "/add-item" ? "active" : ""}
            onClick={() => navigate("/add-item")}
          >
            Post an Item
          </button>

          <button
            className={location.pathname === "/my-items" ? "active" : ""}
            onClick={() => navigate("/my-items")}
          >
            My Items
          </button>

          <button
            className={location.pathname === "/my-claims" ? "active" : ""}
            onClick={() => navigate("/my-claims")}
          >
            My Claims
          </button>

          <button
            className={location.pathname === "/received-claims" ? "active" : ""}
            onClick={() => navigate("/received-claims")}
          >
            Received Claims
          </button>

          <button
            className={location.pathname === "/browse-items" ? "active" : ""}
            onClick={() => navigate("/browse-items")}
          >
            Browse Items
          </button>

          <button
            className={location.pathname === "/notifications" ? "active" : ""}
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
            >
              Admin Dashboard
            </button>
          )}

          <button
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

        </nav>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* ONLY THIS PART CHANGES */}
      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;