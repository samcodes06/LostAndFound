import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/AdminUsersPage.css";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useNotification();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);

        showToast(
          error.response?.data?.message ||
            "Failed to load users",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [showToast]);

  const handleStatusChange = async (
    userId,
    currentStatus
  ) => {
    try {
      await api.put(
        `/admin/users/${userId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                isActive: !currentStatus,
              }
            : user
        )
      );

      showToast(
        currentStatus
          ? "User deactivated successfully"
          : "User activated successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to update user status",
        "error"
      );
    }
  };

  const handleSearch = () => {
    setSearch(searchText.trim().toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearch("");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="admin-users-loading">
        Loading users...
      </div>
    );
  }

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length;

  const filteredUsers = users.filter((user) => {
    if (!search) {
      return true;
    }

    const name =
      user.name?.toLowerCase() || "";

    const username =
      user.username?.toLowerCase() || "";

    return (
      name.includes(search) ||
      username.includes(search)
    );
  });

  return (
    <div className="admin-users-page">

      {/* Header */}
      <div className="admin-users-header">
        <div>
          <h1>Manage Users</h1>
          <p>
            View and manage registered users.
          </p>
        </div>

        <button
          className="admin-users-back-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>
      </div>

      {/* Summary */}
      <div className="users-summary">

        <div className="users-summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="users-summary-card active">
          <span>Active Users</span>
          <strong>{activeUsers}</strong>
        </div>

        <div className="users-summary-card inactive">
          <span>Inactive Users</span>
          <strong>{inactiveUsers}</strong>
        </div>

      </div>

      {/* Search */}
      <div className="users-search-section">

        <input
          type="text"
          className="users-search-input"
          placeholder="Search by name or username..."
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          onKeyDown={handleSearchKeyDown}
        />

        <button
          type="button"
          className="users-search-btn"
          onClick={handleSearch}
        >
          🔍 Search
        </button>

        <button
          type="button"
          className="clear-users-search"
          onClick={handleClearSearch}
        >
          Clear
        </button>

      </div>

      {/* Users */}
      {users.length === 0 ? (
        <div className="admin-users-empty">
          <div>👥</div>

          <h2>No users found</h2>

          <p>
            There are currently no registered users.
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-users-empty">
          <div>🔍</div>

          <h2>No matching users</h2>

          <p>
            No user matches "{searchText}".
          </p>
        </div>
      ) : (
        <div className="admin-users-table-container">

          <table className="admin-users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Posts</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (
                <tr key={user._id}>

                  {/* User */}
                  <td>
                    <div className="admin-user-info">

                      <div className="admin-user-avatar">
                        {user.name
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          @{user.username}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* Email */}
                  <td>
                    <span className="user-email">
                      {user.email}
                    </span>
                  </td>

                  {/* Posts */}
                  <td>
                    <span className="post-count">
                      {user.totalPosts || 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`user-status ${
                        user.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="user-actions">

                      <button
                        className="view-posts-btn"
                        onClick={() =>
                          navigate(
                            `/admin/users/${user._id}/posts`
                          )
                        }
                      >
                        View Posts
                      </button>

                      <button
                        className={`status-btn ${
                          user.isActive
                            ? "deactivate"
                            : "activate"
                        }`}
                        onClick={() =>
                          handleStatusChange(
                            user._id,
                            user.isActive
                          )
                        }
                      >
                        {user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AdminUsersPage;