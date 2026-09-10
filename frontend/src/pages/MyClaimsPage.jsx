import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/MyClaimsPage.css";

function MyClaimsPage() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyClaims = async () => {
      try {
        const response = await api.get("/claims/my");
        setClaims(response.data.claims);
      } catch (error) {
        console.error(error);
        alert(
          error.response?.data?.message ||
          "Failed to load claims"
        );
      } finally {
        setLoading(false);
      }
    };

    getMyClaims();
  }, []);

  if (loading) {
    return (
      <div className="my-claims-loading">
        Loading claims...
      </div>
    );
  }

  return (
    <div className="my-claims-page">

      <div className="my-claims-header">
        <h1>My Claims</h1>
        <p>
          Track the status of all claims you have submitted.
        </p>
      </div>

      {claims.length === 0 ? (

        <div className="empty-claims">
          <h2>No claims submitted yet</h2>

          <p>
            You have not submitted any claims for lost or found items.
          </p>

          <button onClick={() => navigate("/browse-items")}>
            Explore Items
          </button>
        </div>

      ) : (

        <div className="my-claims-grid">

          {claims.map((claim) => (

            <div
              className="my-claim-card"
              key={claim._id}
              onClick={() => navigate(`/claims/${claim._id}`)}
            >

              {/* IMAGE */}
              <div className="my-claim-image">

                {claim.item?.images?.length > 0 ? (
                  <img
                    src={claim.item.images[0].url}
                    alt={claim.item.itemName}
                  />
                ) : (
                  <span>No Image</span>
                )}

              </div>

              {/* DETAILS */}
              <div className="my-claim-details">

                <div className="my-claim-title-row">

                  <div>
                    <h2>
                      {claim.item?.itemName || "Item unavailable"}
                    </h2>

                    {claim.item?.category && (
                      <p className="my-claim-category">
                        {claim.item.category}
                      </p>
                    )}
                  </div>

                  <span
                    className={`my-claim-status ${
                      claim.status?.toLowerCase()
                    }`}
                  >
                    {claim.status}
                  </span>

                </div>

                <div className="my-claim-description">

                  <span>Your Claim</span>

                  <p>
                    {claim.description?.length > 100
                      ? `${claim.description.substring(0, 100)}...`
                      : claim.description}
                  </p>

                </div>

                {claim.createdAt && (
                  <p className="my-claim-date">
                    Submitted on{" "}
                    {new Date(claim.createdAt).toLocaleDateString(
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

export default MyClaimsPage;