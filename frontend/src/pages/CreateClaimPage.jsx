import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/CreateClaimPage.css";

function CreateClaimPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    contactInfo: ""
  });

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await api.get(`/items/${itemId}`);
        setItem(response.data.item);
      } catch (error) {
        console.error("Failed to load item:", error);
      }
    };

    getItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/claims/${itemId}`, formData);

      showToast(
        item.type === "LOST"
          ? "Finding submitted successfully!"
          : "Claim submitted successfully!",
        "success"
      );

      navigate(`/items/${itemId}`);
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to submit request",
        "error"
      );
    }
  };

  if (!item) {
    return (
      <div className="claim-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  const isLostItem = item.type === "LOST";

  return (
    <div className="create-claim-page">

      <button
        className="claim-back-btn"
        onClick={() => navigate(`/items/${itemId}`)}
      >
        ← Back to Item
      </button>

      <div className="claim-card">

        <div className="claim-header">
          <span className="claim-icon">📋</span>

          <div>
            <h1>
              {isLostItem
                ? "I Found This Item"
                : "Claim Item"}
            </h1>

            <p>
              {isLostItem
                ? "Provide details to help verify that you found this item."
                : "Provide details to help verify your claim."}
            </p>
          </div>
        </div>

        <div className="claim-item-box">

          <span>
            {isLostItem
              ? "Item you found"
              : "Item you are claiming"}
          </span>

          <h2>{item.itemName}</h2>

          {item.category && (
            <p>
              <strong>Category:</strong> {item.category}
            </p>
          )}

        </div>

        <form onSubmit={handleSubmit} className="claim-form">

          <div className="form-group">

            <label htmlFor="description">
              {isLostItem
                ? "Where and how did you find this item?"
                : "Why do you think this item belongs to you?"}
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                isLostItem
                  ? "Describe where and how you found the item, including any identifying details."
                  : "Describe any identifying details, marks, contents, or other information that can prove this item belongs to you."
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="contactInfo">
              Your Contact Information
            </label>

            <input
              id="contactInfo"
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Phone number or email"
              required
            />

            <small>
              {isLostItem
                ? "This information will be shared with the item owner so they can contact you about the found item."
                : "This information will be shared with the item owner if your claim is accepted."}
            </small>

          </div>

          <button
            type="submit"
            className="submit-claim-btn"
          >
            {isLostItem
              ? "Submit Finding"
              : "Submit Claim"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateClaimPage;