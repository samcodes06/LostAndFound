import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/AdminUserPostsPage.css";

function AdminUserPostsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await api.get(
          `/admin/users/${id}/posts`
        );

        setUser(response.data.user);
        setItems(response.data.items || []);
      } catch (error) {
        console.error(
          "Error fetching user posts:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Failed to load user posts",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [id, showToast]);

  // Open item details
  const handleCardClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // Claim / I Found This
  const handleClaim = (itemId, event) => {
    event.stopPropagation();

    navigate(`/claims/create/${itemId}`);
  };

  // Open delete confirmation
  const handleDeleteClick = (itemId, event) => {
    event.stopPropagation();

    setDeleteItemId(itemId);
  };

  // Delete post
  const handleDelete = async (itemId) => {
    try {
      setDeleting(true);

      await api.delete(`/admin/items/${itemId}`);

      setItems((previousItems) =>
        previousItems.filter(
          (item) => item._id !== itemId
        )
      );

      setDeleteItemId(null);

      showToast(
        "Post deleted successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Error deleting post:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to delete post",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Cancel delete
  const handleCancelDelete = (event) => {
    event.stopPropagation();

    if (!deleting) {
      setDeleteItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="view-posts-page">
        <p className="view-posts-loading">
          Loading posts...
        </p>
      </div>
    );
  }

  return (
    <div className="view-posts-page">

      {/* Header */}
      <div className="view-posts-header">

        <div>
          <h1>Posts by User</h1>

          {user && (
            <p>
              <strong>{user.name}</strong>{" "}
              <span>@{user.username}</span>
            </p>
          )}
        </div>

        <button
          className="back-users-btn"
          onClick={() =>
            navigate("/admin/users")
          }
        >
          ← Back to Users
        </button>

      </div>


      {/* Posts Count */}
      <div className="posts-count">
        Total Posts:{" "}
        <strong>{items.length}</strong>
      </div>


      {/* No Posts */}
      {items.length === 0 ? (

        <div className="no-posts">
          <h3>No Posts Found</h3>

          <p>
            This user has not posted any lost
            or found items.
          </p>
        </div>

      ) : (

        /* Cards */
        <div className="user-posts-grid">

          {items.map((item) => (

            <div
              className="user-post-card"
              key={item._id}
              onClick={() =>
                handleCardClick(item._id)
              }
            >

              {/* Image */}
              <div className="user-post-image-container">

                {item.images &&
                item.images.length > 0 &&
                item.images[0]?.url ? (

                  <img
                    src={item.images[0].url}
                    alt={item.itemName}
                    className="user-post-image"
                  />

                ) : (

                  <span className="user-post-no-image">
                    No Image
                  </span>

                )}

              </div>


              {/* Card Content */}
              <div className="user-post-content">

                {/* Title + Type */}
                <div className="user-post-title-row">

                  <h2>
                    {item.itemName}
                  </h2>

                  <span
                    className={`post-type ${
                      item.type?.toLowerCase()
                    }`}
                  >
                    {item.type}
                  </span>

                </div>


                {/* Category */}
                <p className="user-post-category">
                  {item.category}
                </p>


                {/* Location */}
                <div className="user-post-location">

                  <p>
                    📍 {item.location}
                  </p>

                  {item.area && (
                    <p>
                      {item.area}
                    </p>
                  )}

                  {item.specificPlace && (
                    <p>
                      📌 {item.specificPlace}
                    </p>
                  )}

                </div>


                {/* Status + Date */}
                <div className="user-post-status-row">

                  <span
                    className={`post-status ${
                      item.status?.toLowerCase()
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="user-post-date">
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </span>

                </div>


                {/* Actions */}
                <div className="user-post-actions">

                  {/* 
                    Only AVAILABLE items get
                    Claim / I Found This.
                  */}
                  {item.status !== "RETURNED" && (

                    <button
                      className="claim-post-btn"
                      onClick={(event) =>
                        handleClaim(
                          item._id,
                          event
                        )
                      }
                    >
                      {item.type === "FOUND"
                        ? "Claim Item →"
                        : "I Found This →"}
                    </button>

                  )}


                  {/* Delete */}
                  <button
                    className="delete-post-btn"
                    onClick={(event) =>
                      handleDeleteClick(
                        item._id,
                        event
                      )
                    }
                    disabled={deleting}
                  >
                    Delete
                  </button>

                </div>


                {/* Delete Confirmation */}
                {deleteItemId === item._id && (

                  <div
                    className="delete-confirmation"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <p>
                      Delete this post permanently?
                    </p>

                    <div className="delete-confirm-actions">

                      <button
                        className="confirm-delete-btn"
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        disabled={deleting}
                      >
                        {deleting
                          ? "Deleting..."
                          : "Yes, Delete"}
                      </button>

                      <button
                        className="cancel-delete-btn"
                        onClick={
                          handleCancelDelete
                        }
                        disabled={deleting}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminUserPostsPage;