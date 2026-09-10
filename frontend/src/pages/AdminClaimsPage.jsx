import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/AdminClaimsPage.css";

function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getClaims = async () => {
      try {
        const response = await api.get("/admin/claims");
        setClaims(response.data.claims || []);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
        alert(error.response?.data?.message || "Failed to load claims");
      } finally {
        setLoading(false);
      }
    };

    getClaims();
  }, []);

  if (loading) {
    return (
      <div className="admin-claims-loading">
        Loading claims...
      </div>
    );
  }

  return (
    <div className="admin-claims-page">

      {/* Header */}
      <div className="admin-claims-header">
        <div>
          <h1>All Claims</h1>
          <p>Review all claims submitted by users.</p>
        </div>

        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* Summary */}
      <div className="claims-summary">
        <div className="claims-summary-card">
          <span>Total Claims</span>
          <strong>{claims.length}</strong>
        </div>

        <div className="claims-summary-card pending">
          <span>Pending</span>
          <strong>
            {claims.filter((claim) => claim.status === "PENDING").length}
          </strong>
        </div>

        <div className="claims-summary-card accepted">
          <span>Accepted</span>
          <strong>
            {claims.filter((claim) => claim.status === "ACCEPTED").length}
          </strong>
        </div>

        <div className="claims-summary-card rejected">
          <span>Rejected</span>
          <strong>
            {claims.filter((claim) => claim.status === "REJECTED").length}
          </strong>
        </div>
      </div>

      {/* Claims */}
      {claims.length === 0 ? (
        <div className="admin-claims-empty">
          <div>📋</div>
          <h2>No claims found</h2>
          <p>There are currently no claims submitted by users.</p>
        </div>
      ) : (
        <div className="admin-claims-table-container">
          <table className="admin-claims-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Claimant</th>
                <th>Item Owner</th>
                <th>Status</th>
                <th>Claim Date</th>
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id}>

                  {/* Item */}
                  <td>
                    <div className="claim-item">
                      <div className="claim-item-icon">
                        📦
                      </div>

                      <div>
                        <strong>
                          {claim.item
                            ? claim.item.itemName
                            : "Item deleted"}
                        </strong>

                        {claim.item?.category && (
                          <span>
                            {claim.item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Claimant */}
                  <td>
                    {claim.claimant ? (
                      <div className="person-info">
                        <strong>{claim.claimant.name}</strong>
                        <span>
                          @{claim.claimant.username}
                        </span>
                      </div>
                    ) : (
                      <span className="unknown">
                        Unknown
                      </span>
                    )}
                  </td>

                  {/* Owner */}
                  <td>
                    {claim.item?.postedBy ? (
                      <div className="person-info">
                        <strong>
                          {claim.item.postedBy.name}
                        </strong>
                        <span>
                          @{claim.item.postedBy.username}
                        </span>
                      </div>
                    ) : (
                      <span className="unknown">
                        Unknown
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`claim-status ${claim.status?.toLowerCase()}`}
                    >
                      {claim.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="claim-date">
                      {new Date(
                        claim.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default AdminClaimsPage;