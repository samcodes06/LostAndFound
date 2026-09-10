import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/MyItemsPage.css";
import useNotification from "../context/useNotification";

function MyItemsPage() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useNotification();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadMyItems = async () => {
    try {
      const response = await api.get("/items/my");
      setItems(response.data.items);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  loadMyItems();
}, []);

  const handleDelete = async (id) => {
    const confirmDelete = await showConfirm(
      "Are you sure you want to delete this item?",
      "Delete Item"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/items/${id}`);

      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );

      showToast("Item deleted successfully!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to delete item",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="my-items-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="my-items-page">

      <main className="my-items-main">

        <div className="my-items-header">
          <div>
            <h1>My Items</h1>

            <p>
              Manage all the lost and found items you have posted.
            </p>
          </div>

          <button
            className="post-new-btn"
            onClick={() => navigate("/add-item")}
          >
            Post New Item
          </button>
        </div>

        {items.length === 0 ? (

          <div className="empty-items">

            <h2>No items posted yet</h2>

            <p>
              You haven't posted any lost or found items.
            </p>

            <button
              onClick={() => navigate("/add-item")}
            >
              Post Your First Item
            </button>

          </div>

        ) : (

          <div className="my-items-grid">

            {items.map((item) => (

              <div
                className="my-item-card"
                key={item._id}
                onClick={() =>
                  navigate(`/items/${item._id}`)
                }
              >

                {/* IMAGE */}
                <div className="my-item-image">

                  {item.images &&
                  item.images.length > 0 ? (

                    <img
                      src={item.images[0].url}
                      alt={item.itemName}
                    />

                  ) : (

                    <span>No Image</span>

                  )}

                </div>

                {/* DETAILS */}
                <div className="my-item-details">

                  <div className="item-title-row">

                    <h3>{item.itemName}</h3>

                    <span
                      className={
                        item.type === "LOST"
                          ? "my-lost-tag"
                          : "my-found-tag"
                      }
                    >
                      {item.type}
                    </span>

                  </div>

                  <p className="item-category">
                    {item.category}
                  </p>

                  <p className="item-description">
                    {item.description}
                  </p>

                  <div className="item-location">
                    <strong>Location:</strong>{" "}
                    {item.location}, {item.area}
                  </div>

                  <div className="item-status-row">

                    <span
                      className={
                        item.status === "AVAILABLE"
                          ? "available-status"
                          : "returned-status"
                      }
                    >
                      {item.status}
                    </span>

                    <div className="item-actions">

                      {/* EDIT */}
                      <button
                        className="edit-item-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/edit-item/${item._id}`
                          );
                        }}
                        disabled={
                          item.status === "RETURNED"
                        }
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="delete-item-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDelete(item._id);
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyItemsPage;