import { useState } from "react";
import NotificationContext from "./NotificationContext";
import "../styles/Notification.css";

function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const showConfirm = (message, title = "Are you sure?") => {
    return new Promise((resolve) => {
      setConfirmData({
        title,
        message,
        resolve
      });
    });
  };

  const handleConfirm = (result) => {
    if (confirmData) {
      confirmData.resolve(result);
      setConfirmData(null);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ showToast, showConfirm }}
    >
      {children}

      {toast && (
        <div className={`app-toast ${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </span>

          <span>{toast.message}</span>

          <button onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}

      {confirmData && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">?</div>

            <h2>{confirmData.title}</h2>

            <p>{confirmData.message}</p>

            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => handleConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-ok"
                onClick={() => handleConfirm(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;