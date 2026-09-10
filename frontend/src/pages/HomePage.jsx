import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useNotification from "../context/useNotification";
import api from "../api/axios";
import "../styles/HomePage.css";

const DEFAULT_CITIES = [
  "Tirupati",
  "Chennai",
  "Bengaluru",
  "Delhi",
  "Hyderabad"
];

function HomePage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // City shown inside the input
  const [location, setLocation] = useState("");

  // Permanently saved city
  const [savedCity, setSavedCity] = useState("");

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);

  // Unique storage key for this user
  const userStorageKey = user
    ? `lost-found-city-${user._id || user.id || user.username}`
    : null;

  /*
   * Load the saved city whenever HomePage opens.
   *
   * localStorage gives us an immediate value while the
   * database profile is being loaded.
   */
  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    const loadSavedCity = async () => {
      try {
        // First load locally saved city
        const localCity = userStorageKey
          ? localStorage.getItem(userStorageKey) || ""
          : "";

        if (!cancelled && localCity) {
          setLocation(localCity);
          setSavedCity(localCity);
        }

        // Then get the permanent value from MongoDB
        const response = await api.get("/auth/profile");

        if (!cancelled) {
          const databaseCity =
            response.data.user?.city?.trim() || "";

          if (databaseCity) {
            setLocation(databaseCity);
            setSavedCity(databaseCity);

            if (userStorageKey) {
              localStorage.setItem(
                userStorageKey,
                databaseCity
              );
            }
          } else if (localCity) {
            /*
             * If database has no city but this user already
             * has a locally saved city, keep that city.
             */
            setLocation(localCity);
            setSavedCity(localCity);
          } else {
            setLocation("");
            setSavedCity("");
          }

          setProfileLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load saved location",
            error
          );

          setProfileLoaded(true);
        }
      }
    };

    loadSavedCity();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, userStorageKey]);

  /*
   * Fetch posts.
   *
   * IMPORTANT:
   * We use savedCity, NOT location.
   *
   * Therefore simply typing another city does not
   * change the posts until Save Location is clicked.
   */
  useEffect(() => {
    if (authLoading || !profileLoaded) return;

    let cancelled = false;

    const getItems = async () => {
      try {
        setLoading(true);

        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (savedCity.trim()) {
          params.location = savedCity.trim();
        }

        const response = await api.get("/items", {
          params
        });

        if (!cancelled) {
          setItems(response.data.items || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch items",
            error
          );

          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      getItems();
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [
    authLoading,
    profileLoaded,
    search,
    savedCity
  ]);

  /*
   * Save Location button
   *
   * This is the ONLY place where the city is changed
   * permanently.
   */
  const handleSaveLocation = async () => {
    const newCity = location.trim();

    if (!newCity) {
      showToast(
        "Please enter a city",
        "error"
      );
      return;
    }

    if (
      newCity.toLowerCase() ===
      savedCity.trim().toLowerCase()
    ) {
      showToast(
        `Location is already ${savedCity}`,
        "success"
      );
      return;
    }

    try {
      setSavingLocation(true);

      const response = await api.put(
        "/auth/profile",
        {
          city: newCity
        }
      );

      /*
       * Use the value returned by the backend.
       */
      const updatedCity =
        response.data.user?.city?.trim() ||
        newCity;

      // Update saved React state
      setSavedCity(updatedCity);
      setLocation(updatedCity);

      // Also keep a user-specific local copy
      if (userStorageKey) {
        localStorage.setItem(
          userStorageKey,
          updatedCity
        );
      }

      showToast(
        `Location updated to ${updatedCity}`,
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to update location",
        error
      );

      // Restore previously saved city
      setLocation(savedCity);

      showToast(
        error.response?.data?.message ||
          "Failed to update location",
        "error"
      );
    } finally {
      setSavingLocation(false);
    }
  };

  if (authLoading || !profileLoaded) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="home-content">

      {/* Welcome */}
      <div className="welcome-section">
        <h1>
          Welcome back,{" "}
          {user?.name ||
            user?.username ||
            "User"}!
        </h1>

        <p>
          Find lost items or help others find
          what they have lost.
        </p>
      </div>

      {/* Search */}
      <div className="search-section">

        <input
          type="text"
          placeholder="Search items..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="location-control">

          <input
            type="text"
            placeholder="Search city..."
            className="location-filter"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            list="home-city-locations"
          />

          <button
            type="button"
            className="save-location-btn"
            onClick={handleSaveLocation}
            disabled={savingLocation}
          >
            {savingLocation
              ? "Saving..."
              : "Save Location"}
          </button>

        </div>

        <datalist id="home-city-locations">
          {DEFAULT_CITIES.map((city) => (
            <option
              value={city}
              key={city}
            />
          ))}
        </datalist>

      </div>

      {/* Items Header */}
      <div className="items-header">

        <div>
          <h2>
            {savedCity
              ? `${savedCity} Items`
              : "Explore Items"}
          </h2>

          <p>
            {savedCity
              ? `Items reported in ${savedCity}.`
              : "Browse recently posted lost and found items."}
          </p>
        </div>

      </div>

      {/* Items */}
      {loading ? (

        <div className="items-loading">
          <p>Loading items...</p>
        </div>

      ) : items.length === 0 ? (

        <div className="no-items">

          <div className="no-items-icon">
            🔍
          </div>

          <h3>
            No items found
          </h3>

          <p>
            Try another item or city.
          </p>

        </div>

      ) : (

        <div className="items-grid">

          {items.map((item) => (

            <div
              className="item-card"
              key={item._id}
              onClick={() =>
                navigate(
                  `/items/${item._id}`
                )
              }
            >

              <div className="item-image">

                {item.images &&
                item.images.length > 0 ? (

                  <img
                    src={item.images[0].url}
                    alt={item.itemName}
                  />

                ) : (

                  <span>
                    No Image
                  </span>

                )}

              </div>

              <div className="item-card-body">

                <div className="item-title-row">

                  <h3>
                    {item.itemName}
                  </h3>

                  <span
                    className={
                      item.type?.toLowerCase() ===
                      "lost"
                        ? "lost-tag"
                        : "found-tag"
                    }
                  >
                    {item.type}
                  </span>

                </div>

                <p className="item-category">
                  {item.category}
                </p>

                <p className="item-location">
                  📍 {item.location}
                </p>

                {item.area && (
                  <p className="item-area">
                    {item.area}
                  </p>
                )}

                {item.specificPlace && (
                  <p className="item-place">
                    📌 {item.specificPlace}
                  </p>
                )}

                <div className="view-item">
                  View Item →
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default HomePage;