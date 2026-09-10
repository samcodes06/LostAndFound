import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/AdminDashboardPage.css";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    getDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-error">
        <h2>Failed to load dashboard</h2>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, items and claims from one place.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="admin-stat-grid">

        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Total Users</span>
            <strong>{stats.users.total}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div>
            <span>Total Items</span>
            <strong>{stats.items.total}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <span>Total Claims</span>
            <strong>{stats.claims.total}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Pending Claims</span>
            <strong>{stats.claims.pending}</strong>
          </div>
        </div>

      </div>

      {/* Items Section */}
      <div className="admin-section">

        <h2>Items Overview</h2>

        <div className="admin-detail-grid">

          <div className="detail-card">
            <span>Lost Items</span>
            <strong>{stats.items.lost}</strong>
          </div>

          <div className="detail-card">
            <span>Found Items</span>
            <strong>{stats.items.found}</strong>
          </div>

          <div className="detail-card">
            <span>Available</span>
            <strong>{stats.items.available}</strong>
          </div>

          <div className="detail-card">
            <span>Returned</span>
            <strong>{stats.items.returned}</strong>
          </div>

        </div>

      </div>

      {/* Claims Section */}
      <div className="admin-section">

        <h2>Claims Overview</h2>

        <div className="admin-detail-grid">

          <div className="detail-card">
            <span>Total Claims</span>
            <strong>{stats.claims.total}</strong>
          </div>

          <div className="detail-card pending">
            <span>Pending</span>
            <strong>{stats.claims.pending}</strong>
          </div>

          <div className="detail-card accepted">
            <span>Accepted</span>
            <strong>{stats.claims.accepted}</strong>
          </div>

          <div className="detail-card rejected">
            <span>Rejected</span>
            <strong>{stats.claims.rejected}</strong>
          </div>

        </div>

      </div>

      {/* Management */}
            {/* Management */}
      <div className="admin-section">
        <h2>Management</h2>

        <div className="admin-management-grid">

          <button
            onClick={() => navigate("/admin/users")}
            className="management-card"
          >
            <span className="management-icon">👥</span>

            <div>
              <strong>Manage Users</strong>
              <p>View and manage registered users</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/items")}
            className="management-card"
          >
            <span className="management-icon">📦</span>

            <div>
              <strong>Manage Items</strong>
              <p>View and manage posted items</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/claims")}
            className="management-card"
          >
            <span className="management-icon">📋</span>

            <div>
              <strong>View Claims</strong>
              <p>Review all submitted claims</p>
            </div>

            <span className="arrow">→</span>
          </button>

          <button
            onClick={() =>
              navigate("/admin/contact-messages")
            }
            className="management-card"
          >
            <span className="management-icon">✉️</span>

            <div>
              <strong>Contact Messages</strong>
              <p>View messages sent by users</p>
            </div>

            <span className="arrow">→</span>
          </button>

        </div>
      </div>

    </div>
  );
}

export default AdminDashboardPage;