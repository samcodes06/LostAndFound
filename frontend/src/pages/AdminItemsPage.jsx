import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/AdminItemsPage.css";

function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await api.get("/admin/items");
        setItems(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Failed to load items",
        });
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await api.delete(`/admin/items/${deleteItem._id}`);

      setItems((prevItems) =>
        prevItems.filter(
          (item) => item._id !== deleteItem._id
        )
      );

      setDeleteItem(null);

      setMessage({
        type: "success",
        text: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete item:", error);

      setDeleteItem(null);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete item",
      });
    }
  };

  if (loading) {
    return (
      <div className="admin-items-loading">
        Loading items...
      </div>
    );
  }

  const lostCount = items.filter(
    (item) => item.type === "LOST"
  ).length;

  const foundCount = items.filter(
    (item) => item.type === "FOUND"
  ).length;

  const availableCount = items.filter(
    (item) => item.status === "AVAILABLE"
  ).length;

  return (
    <div className="admin-items-page">

      {/* In-App Message */}
      {message && (
        <div className={`admin-message ${message.type}`}>
          <span>{message.text}</span>

          <button
            className="admin-message-close"
            onClick={() => setMessage(null)}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="admin-items-header">
        <div>
          <h1>Manage Items</h1>
          <p>
            View and manage all items posted by users.
          </p>
        </div>

        <button
          className="admin-items-back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* Summary */}
      <div className="items-summary">

        <div className="items-summary-card">
          <span>Total Items</span>
          <strong>{items.length}</strong>
        </div>

        <div className="items-summary-card lost">
          <span>Lost Items</span>
          <strong>{lostCount}</strong>
        </div>

        <div className="items-summary-card found">
          <span>Found Items</span>
          <strong>{foundCount}</strong>
        </div>

        <div className="items-summary-card available">
          <span>Available</span>
          <strong>{availableCount}</strong>
        </div>

      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="admin-items-empty">
          <div>📦</div>

          <h2>No items found</h2>

          <p>
            There are currently no items posted by users.
          </p>
        </div>
      ) : (
        <div className="admin-items-table-container">

          <table className="admin-items-table">

            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Posted By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {items.map((item) => (
                <tr key={item._id}>

                  {/* Image */}
                  <td>
                    {item.images?.length > 0 ? (
                      <img
                        className="admin-item-image"
                        src={item.images[0].url}
                        alt={item.itemName}
                      />
                    ) : (
                      <div className="admin-no-image">
                        📦
                      </div>
                    )}
                  </td>

                  {/* Item */}
                  <td>
                    <strong className="admin-item-name">
                      {item.itemName}
                    </strong>
                  </td>

                  {/* Type */}
                  <td>
                    <span
                      className={`item-type ${item.type?.toLowerCase()}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="item-category">
                      {item.category || "—"}
                    </span>
                  </td>

                  {/* Location */}
                  <td>
                    <span className="item-location">
                      {item.location || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`item-status ${item.status?.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Posted By */}
                  <td>
                    {item.postedBy ? (
                      <div className="item-owner">
                        <strong>
                          {item.postedBy.name}
                        </strong>

                        <span>
                          @{item.postedBy.username}
                        </span>
                      </div>
                    ) : (
                      <span className="unknown">
                        Unknown
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="item-actions">

                      <button
                        className="view-item-btn"
                        onClick={() =>
                          navigate(`/items/${item._id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="delete-item-btn"
                        onClick={() => setDeleteItem(item)}
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="delete-modal-overlay">

          <div className="delete-modal">

            <div className="delete-modal-icon">
              ⚠️
            </div>

            <h2>Delete Item?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                "{deleteItem.itemName}"
              </strong>
              ?
            </p>

            <div className="delete-modal-actions">

              <button
                className="delete-modal-cancel"
                onClick={() => setDeleteItem(null)}
              >
                Cancel
              </button>

              <button
                className="delete-modal-confirm"
                onClick={handleDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminItemsPage;