import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/BrowseItemsPage.css";

function BrowseItemsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    location: "",
    area: "",
    specificPlace: "",
    color: "",
    status: ""
  });

  // ================= FETCH ITEMS =================

  const fetchItems = async (currentFilters = {}) => {
    try {
      setLoading(true);

      const params = {};

      Object.keys(currentFilters).forEach((key) => {
        const value = currentFilters[key];

        if (
          typeof value === "string" &&
          value.trim() !== ""
        ) {
          params[key] = value.trim();
        }
      });

      const response = await api.get("/items", {
        params
      });

      setItems(response.data.items || []);

    } catch (error) {
      console.error("Fetch items error:", error);
      setItems([]);

      alert(
        error.response?.data?.message ||
        "Failed to load items"
      );

    } finally {
      setLoading(false);
    }
  };


  // ================= INITIAL LOAD =================

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await api.get("/items");

        setItems(response.data.items || []);

      } catch (error) {
        console.error("Initial fetch error:", error);
        setItems([]);

      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // ================= SEARCH =================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(filters);
  };


  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      type: "",
      location: "",
      area: "",
      specificPlace: "",
      color: "",
      status: ""
    };

    setFilters(emptyFilters);
    fetchItems(emptyFilters);
  };


  return (
    <div className="browse-page">

      {/* ================= HEADER ================= */}

      <div className="browse-header">
        <h1>Browse Items</h1>
        <p>Search and discover lost and found items.</p>
      </div>


      {/* ================= FILTERS ================= */}

      <form
        className="browse-filters"
        onSubmit={handleSearch}
      >

        <div className="browse-search-row">

          <input
            type="text"
            name="search"
            placeholder="Search by item name or description..."
            value={filters.search}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="browse-search-btn"
          >
            Search
          </button>

        </div>


        <div className="filter-options">

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleChange}
          />


          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>


          <input
            type="text"
            name="color"
            placeholder="Color"
            value={filters.color}
            onChange={handleChange}
          />


          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RETURNED">Returned</option>
          </select>


          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
          />


          <input
            type="text"
            name="area"
            placeholder="Area"
            value={filters.area}
            onChange={handleChange}
          />


          <input
            type="text"
            name="specificPlace"
            placeholder="Specific Place"
            value={filters.specificPlace}
            onChange={handleChange}
          />


          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      </form>


      {/* ================= RESULTS HEADER ================= */}

      <div className="browse-results-header">

        <h2>Results</h2>

        <span>
          {items.length} item
          {items.length !== 1 ? "s" : ""} found
        </span>

      </div>


      {/* ================= RESULTS ================= */}

      {loading ? (

        <div className="browse-loading">
          Loading items...
        </div>

      ) : items.length === 0 ? (

        <div className="no-results">

          <h3>No items found</h3>

          <p>
            Try changing or clearing some filters.
          </p>

          <button onClick={clearFilters}>
            Clear Filters
          </button>

        </div>

      ) : (

        <div className="browse-items-grid">

          {items.map((item) => (

            <div
              className="browse-item-card"
              key={item._id}
              onClick={() =>
                navigate(`/items/${item._id}`)
              }
            >

              {/* IMAGE */}

              <div className="browse-item-image">

                {item.images?.length > 0 ? (

                  <img
                    src={item.images[0].url}
                    alt={item.itemName}
                  />

                ) : (

                  <span>No Image Available</span>

                )}

              </div>


              {/* CONTENT */}

              <div className="browse-item-content">

                <div className="browse-item-title">

                  <h3>
                    {item.itemName}
                  </h3>

                  <span
                    className={
                      item.type === "LOST"
                        ? "browse-lost-tag"
                        : "browse-found-tag"
                    }
                  >
                    {item.type}
                  </span>

                </div>


                <p className="browse-category">
                  {item.category}
                </p>


                <p className="browse-description">
                  {item.description}
                </p>


                <div className="browse-item-location">

                  <span>
                    {item.location}
                  </span>

                  {item.area && (
                    <span>
                      {" • "}{item.area}
                    </span>
                  )}

                </div>


                <div className="browse-item-footer">

                  <span
                    className={
                      item.status === "AVAILABLE"
                        ? "browse-available"
                        : "browse-returned"
                    }
                  >
                    {item.status}
                  </span>

                  <span className="browse-view-text">
                    View Details →
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default BrowseItemsPage;