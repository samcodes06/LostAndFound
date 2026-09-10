import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/NotificationsPage.css";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/notifications/${notification._id}/read`);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      switch (notification.type) {
        case "CLAIM_SUBMITTED":
          navigate("/received-claims");
          break;

        case "CLAIM_ACCEPTED":
        case "CLAIM_REJECTED":
          navigate("/my-claims");
          break;

        case "ITEM_RETURNED":
          if (notification.relatedItem?._id) {
            navigate(`/items/${notification.relatedItem._id}`);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        Loading notifications...
      </div>
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="notifications-page">

      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your claims and items.</p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-btn"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <div className="empty-icon">🔔</div>
          <h2>No notifications yet</h2>
          <p>
            You will see updates about your claims and items here.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                !notification.isRead ? "unread" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                🔔
              </div>

              <div className="notification-content">
                <p className="notification-message">
                  {notification.message}
                </p>

                <span className="notification-date">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {!notification.isRead && (
                <span className="unread-dot"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;