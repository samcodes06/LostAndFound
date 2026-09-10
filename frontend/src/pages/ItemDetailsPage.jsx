import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import "../styles/ItemDetailsPage.css";

function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data.item);
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        Loading item details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="details-loading">
        Item not found
      </div>
    );
  }

  const postedById =
    typeof item.postedBy === "object"
      ? item.postedBy?._id
      : item.postedBy;

  const isOwner =
    user &&
    postedById &&
    String(postedById) === String(user._id);

  return (
    <div className="item-details-page">

      <main className="details-main">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="details-container">

          {/* LEFT SIDE - MEDIA */}
          <div className="details-media">

            <div className="main-image">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[selectedImage]?.url}
                  alt={item.itemName}
                />
              ) : (
                <span className="no-main-image">
                  No Image Available
                </span>
              )}
            </div>

            {item.images && item.images.length > 1 && (
              <div className="image-thumbnails">
                {item.images.map((image, index) => (
                  <img
                    key={image._id || index}
                    src={image.url}
                    alt={`${item.itemName} ${index + 1}`}
                    className={
                      selectedImage === index
                        ? "thumbnail active-thumbnail"
                        : "thumbnail"
                    }
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}

            {item.video?.url && (
              <div className="video-section">
                <h3>Video</h3>

                <video controls>
                  <source
                    src={item.video.url}
                    type="video/mp4"
                  />
                  Your browser does not support video.
                </video>
              </div>
            )}

          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="details-info">

            <div className="details-title-row">

              <div>
                <h1>{item.itemName}</h1>

                <p className="details-category">
                  {item.category}
                </p>
              </div>

              <span
                className={
                  item.type === "LOST"
                    ? "details-lost-tag"
                    : "details-found-tag"
                }
              >
                {item.type}
              </span>

            </div>

            {/* STATUS */}
            <div className="details-status">
              <span
                className={
                  item.status === "AVAILABLE"
                    ? "details-available"
                    : "details-returned"
                }
              >
                {item.status}
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="details-section">
              <h2>Description</h2>
              <p>{item.description}</p>
            </div>

            {/* DETAILS */}
            <div className="details-section">
              <h2>Item Information</h2>

              <div className="details-grid">

                {item.color && (
                  <div className="detail-box">
                    <span>Color</span>
                    <strong>{item.color}</strong>
                  </div>
                )}

                <div className="detail-box">
                  <span>Location</span>
                  <strong>{item.location}</strong>
                </div>

                <div className="detail-box">
                  <span>Area</span>
                  <strong>{item.area}</strong>
                </div>

                <div className="detail-box">
                  <span>Specific Place</span>
                  <strong>{item.specificPlace}</strong>
                </div>

              </div>
            </div>

            {/* POSTED INFORMATION */}
            <div className="posted-info">

              <div>
                <span>Posted By</span>

                <strong>
                  {isOwner
                    ? "You"
                    : item.postedBy?.name ||
                      item.postedBy?.username ||
                      "Unknown User"}
                </strong>
              </div>

              <div>
                <span>Posted On</span>

                <strong>
                  {item.createdAt
                    ? new Date(
                        item.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })
                    : "N/A"}
                </strong>
              </div>

            </div>

            {/* ACTION */}
            {!isOwner &&
              item.status === "AVAILABLE" && (
                <button
                  className="claim-btn"
                    onClick={() =>
                           navigate(`/claims/create/${item._id}`)
                         } >
                          {item.type === "LOST"
                         ? "I Found This Item"
                             : "Claim This Item"}
                </button>
              )}

            {isOwner && (
              <div className="owner-actions">

                <button
                  className="details-edit-btn"
                  disabled={item.status === "RETURNED"}
                  onClick={() =>
                    navigate(`/edit-item/${item._id}`)
                  }
                >
                  Edit Item
                </button>

                <button
                  className="details-back-btn"
                  onClick={() => navigate("/my-items")}
                >
                  My Items
                </button>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default ItemDetailsPage;