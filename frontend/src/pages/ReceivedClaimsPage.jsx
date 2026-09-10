import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ReceivedClaimsPage.css";

function ReceivedClaimsPage() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReceivedClaims = async () => {
      try {
        const response = await api.get("/claims/received");
        setClaims(response.data.claims || []);
      } catch (error) {
        console.error("Received claims error:", error);
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    getReceivedClaims();
  }, []);

  if (loading) {
    return (
      <div className="received-claims-loading">
        Loading received claims...
      </div>
    );
  }

  return (
    <div className="received-claims-page">

      {/* HEADER */}
      <div className="received-claims-header">
        <h1>Received Claims</h1>

        <p>
          Review claims submitted for your lost and found items.
        </p>
      </div>

      {/* CLAIMS */}
      {claims.length === 0 ? (

        <div className="empty-received-claims">

          <h2>No claims received yet</h2>

          <p>
            Claims submitted for your posted items will appear here.
          </p>

          <button onClick={() => navigate("/my-items")}>
            View My Items
          </button>

        </div>

      ) : (

        <div className="received-claims-grid">

          {claims.map((claim) => (

            <div
              className="received-claim-card clickable-card"
              key={claim._id}
              onClick={() =>
                navigate(`/claims/${claim._id}`)
              }
            >

              {/* IMAGE */}
              <div className="received-claim-image">

                {claim.item?.images?.length > 0 ? (

                  <img
                    src={claim.item.images[0].url}
                    alt={claim.item.itemName}
                  />

                ) : (

                  <span>No Image</span>

                )}

              </div>

              {/* CONTENT */}
              <div className="received-claim-content">

                <div className="received-claim-title-row">

                  <h2>
                    {claim.item?.itemName ||
                      "Item unavailable"}
                  </h2>

                  <span
                    className={`received-claim-status ${claim.status?.toLowerCase()}`}
                  >
                    {claim.status}
                  </span>

                </div>

                {/* CATEGORY */}
                {claim.item?.category && (

                  <p className="received-claim-category">
                    {claim.item.category}
                  </p>

                )}

                {/* CLAIMANT */}
                <div className="claimant-info">

                  <span>Claimed by</span>

                  <strong>
                    {claim.claimant?.name ||
                      claim.claimant?.username ||
                      "Unknown User"}
                  </strong>

                </div>

                {/* DESCRIPTION */}
                <div className="received-claim-description">

                  <span>Claim Description</span>

                  <p>
                    {claim.description}
                  </p>

                </div>

                {/* DATE */}
                {claim.createdAt && (

                  <p className="received-claim-date">

                    Submitted on{" "}

                    {new Date(
                      claim.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )}

                  </p>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ReceivedClaimsPage;