import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import useNotification from "../context/useNotification";
import "../styles/ClaimDetailsPage.css";

function ClaimDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast, showConfirm } = useNotification();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    const getClaimDetails = async () => {
      try {
        const response = await api.get(`/claims/${id}`);
        setClaim(response.data.claim);
      } catch (error) {
        console.error(error);

        showToast(
          error.response?.data?.message ||
            "Failed to load claim details",
          "error"
        );

        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    getClaimDetails();
  }, [id, navigate, showToast]);

  const handleAccept = async () => {
    const confirmed = await showConfirm(
      "Are you sure you want to accept this claim?",
      claim?.item?.type === "LOST"
        ? "Accept Finding?"
        : "Accept Claim?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await api.put(`/claims/${id}/accept`);

      const response = await api.get(`/claims/${id}`);
      setClaim(response.data.claim);

      showToast(
        claim?.item?.type === "LOST"
          ? "Finding accepted successfully"
          : "Claim accepted successfully"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to accept claim",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const confirmed = await showConfirm(
      "Are you sure you want to reject this claim?",
      claim?.item?.type === "LOST"
        ? "Reject Finding?"
        : "Reject Claim?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await api.put(`/claims/${id}/reject`);

      const response = await api.get(`/claims/${id}`);
      setClaim(response.data.claim);

      showToast(
        claim?.item?.type === "LOST"
          ? "Finding rejected successfully"
          : "Claim rejected successfully"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to reject claim",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkReturned = async () => {
    const confirmed = await showConfirm(
      "Are you sure the item has been returned? This action cannot be undone.",
      "Mark Item as Returned?"
    );

    if (!confirmed) return;

    try {
      setReturnLoading(true);

      await api.put(`/items/${claim.item._id}/return`);

      showToast("Item marked as returned successfully!");

      const response = await api.get(`/claims/${id}`);
      setClaim(response.data.claim);
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to mark item as returned",
        "error"
      );
    } finally {
      setReturnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="claim-details-loading">
        Loading claim details...
      </div>
    );
  }

  if (!claim) return null;

  const isOwner =
    String(claim.item?.postedBy?._id) ===
    String(user?._id);

  const isLostItem = claim.item?.type === "LOST";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="claim-details-page">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="claim-details-card">

        {/* LEFT - IMAGE */}
        <div className="claim-details-left">

          <div className="claim-details-image">
            {claim.item?.images?.length > 0 ? (
              <img
                src={claim.item.images[0].url}
                alt={claim.item.itemName}
              />
            ) : (
              <span>No Image Available</span>
            )}
          </div>

          {claim.item && (
            <button
              className="view-item-details-btn"
              onClick={() =>
                navigate(`/items/${claim.item._id}`)
              }
            >
              View Item Details
            </button>
          )}

        </div>

        {/* RIGHT - DETAILS */}
        <div className="claim-details-right">

          <div className="claim-top">

            <div>
              <span className="claim-for-label">
                {isLostItem
                  ? "FOUND ITEM"
                  : "CLAIM FOR"}
              </span>

              <h1>
                {claim.item?.itemName ||
                  "Item unavailable"}
              </h1>

              <p className="claim-item-category">
                {claim.item?.category}
              </p>
            </div>

            <span
              className={`details-status ${claim.status?.toLowerCase()}`}
            >
              {claim.status}
            </span>

          </div>

          {/* ITEM INFORMATION */}
          <div className="details-section">

            <h3>Item Information</h3>

            <div className="item-info-grid">

              <div className="info-box">
                <span>Item Type</span>
                <strong>
                  {claim.item?.type || "N/A"}
                </strong>
              </div>

              <div className="info-box">
                <span>Location</span>
                <strong>
                  {claim.item?.location || "N/A"}
                </strong>
              </div>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="details-section">

            <h3>
              {isLostItem
                ? isOwner
                  ? "Finder's Description"
                  : "Your Finding Details"
                : isOwner
                ? "Claimant's Description"
                : "Your Claim Description"}
            </h3>

            <p className="details-description">
              {claim.description}
            </p>

          </div>

          {/* CLAIM INFORMATION */}
          <div className="details-section">

            <h3>Claim Information</h3>

            <div className="claim-info-grid">

              <div className="info-box">
                <span>Status</span>
                <strong>{claim.status}</strong>
              </div>

              <div className="info-box">
                <span>Submitted On</span>
                <strong>
                  {formatDate(claim.createdAt)}
                </strong>
              </div>

            </div>

          </div>

          {/* OWNER VIEW */}
          {isOwner && (
            <div className="details-section">

              <h3>
                {isLostItem
                  ? "Finder's Contact Information"
                  : "Claimant's Contact Information"}
              </h3>

              <div className="contact-box">

                {claim.claimant?.name && (
                  <div>
                    <span>Name</span>
                    <strong>
                      {claim.claimant.name}
                    </strong>
                  </div>
                )}

                {claim.claimant?.username && (
                  <div>
                    <span>Username</span>
                    <strong>
                      {claim.claimant.username}
                    </strong>
                  </div>
                )}

                {claim.claimant?.email && (
                  <div>
                    <span>Email</span>
                    <strong>
                      {claim.claimant.email}
                    </strong>
                  </div>
                )}

                <div>
                  <span>Contact</span>
                  <strong>
                    {claim.contactInfo || "Not provided"}
                  </strong>
                </div>

              </div>

            </div>
          )}

          {/* CLAIMANT / FINDER VIEW */}
          {!isOwner &&
            claim.status === "ACCEPTED" &&
            claim.item?.postedBy && (

              <div className="owner-contact-box">

                <h3>Owner Contact Details</h3>

                <p>
                  {isLostItem
                    ? "Your finding has been accepted. You can contact the item owner."
                    : "Your claim has been accepted. You can contact the item owner."}
                </p>

                <div className="contact-box">

                  <div>
                    <span>Name</span>
                    <strong>
                      {claim.item.postedBy.name || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Username</span>
                    <strong>
                      {claim.item.postedBy.username || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {claim.item.postedBy.email || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {claim.item.postedBy.phone || "N/A"}
                    </strong>
                  </div>

                </div>

              </div>
            )}

          {/* OWNER ACTIONS - ACCEPT / REJECT */}
          {isOwner &&
            claim.status === "PENDING" && (

              <div className="claim-decision-actions">

                <button
                  className="accept-claim-btn"
                  onClick={handleAccept}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Processing..."
                    : isLostItem
                    ? "Accept Finding"
                    : "Accept Claim"}
                </button>

                <button
                  className="reject-claim-btn"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {isLostItem
                    ? "Reject Finding"
                    : "Reject Claim"}
                </button>

              </div>
            )}

          {/* MARK AS RETURNED */}
          {isOwner &&
            claim.status === "ACCEPTED" &&
            claim.item?.status !== "RETURNED" && (

              <div className="return-item-section">

                <h3>Item Return</h3>

                <p>
                  Once the item has been handed back to the
                  rightful person, mark it as returned.
                </p>

                <button
                  className="mark-returned-btn"
                  onClick={handleMarkReturned}
                  disabled={returnLoading}
                >
                  {returnLoading
                    ? "Processing..."
                    : "✓ Mark as Returned"}
                </button>

              </div>
            )}

          {/* ALREADY RETURNED */}
          {isOwner &&
            claim.item?.status === "RETURNED" && (

              <div className="returned-message">
                ✓ Item has been marked as returned.
              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default ClaimDetailsPage;