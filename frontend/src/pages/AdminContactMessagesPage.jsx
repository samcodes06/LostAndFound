import { useEffect, useState } from "react";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/AdminContactMessagesPage.css";

function AdminContactMessagesPage() {
  const { showToast } = useNotification();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const response = await api.get("/contact");

        if (!cancelled) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch contact messages:",
            error
          );

          showToast(
            error.response?.data?.message ||
              "Failed to load messages",
            "error"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? { ...message, status: "READ" }
            : message
        )
      );

      showToast("Message marked as read", "success");
    } catch (error) {
      console.error("Failed to mark message as read:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to update message",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-contact-loading">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-header">
        <div>
          <h1>Contact Messages</h1>
          <p>View messages submitted by users.</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="admin-contact-empty">
          <div className="admin-contact-empty-icon">📭</div>
          <h2>No Messages</h2>
          <p>
            No contact messages have been received yet.
          </p>
        </div>
      ) : (
        <div className="admin-contact-list">
          {messages.map((message) => (
            <div
              className={`admin-message-card ${
                message.status === "UNREAD"
                  ? "unread"
                  : ""
              }`}
              key={message._id}
            >
              <div className="admin-message-top">
                <div>
                  <h2>{message.name}</h2>
                  <p>{message.email}</p>
                </div>

                <span
                  className={`message-status ${
                    message.status.toLowerCase()
                  }`}
                >
                  {message.status}
                </span>
              </div>

              <div className="admin-message-body">
                <p>{message.message}</p>
              </div>

              <div className="admin-message-bottom">
                <span>
                  {new Date(
                    message.createdAt
                  ).toLocaleString()}
                </span>

                {message.status === "UNREAD" && (
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(message._id)
                    }
                  >
                    ✓ Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactMessagesPage;