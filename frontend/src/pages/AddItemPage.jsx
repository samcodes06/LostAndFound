import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/AddItemPage.css";
import useNotification from "../context/useNotification";

const DEFAULT_CITIES = [
  "Tirupati",
  "Chennai",
  "Bengaluru",
  "Delhi",
  "Hyderabad"
];

function AddItemPage() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    type: "",
    category: "",
    itemName: "",
    description: "",
    color: "",
    location: "",
    area: "",
    specificPlace: ""
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // HANDLE TEXT INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // HANDLE MULTIPLE IMAGES
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    setImages((prevImages) => {
      const combinedImages = [...prevImages, ...selectedImages];

      if (combinedImages.length > 5) {
        showToast("You can upload a maximum of 5 images.", "error");

        return combinedImages.slice(0, 5);
      }

      return combinedImages;
    });

    // Allows the user to choose the same file again later
    e.target.value = "";
  };

  // REMOVE A SELECTED IMAGE
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // HANDLE VIDEO
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0] || null);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("type", formData.type);
      data.append("category", formData.category);
      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("color", formData.color);
      data.append("location", formData.location);
      data.append("area", formData.area);
      data.append("specificPlace", formData.specificPlace);

      // ADD ALL SELECTED IMAGES
      images.forEach((image) => {
        data.append("images", image);
      });

      // ADD VIDEO
      if (video) {
        data.append("video", video);
      }

      await api.post("/items", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      showToast("Item posted successfully!", "success");

      navigate("/home");
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message || "Failed to post item",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-page">

      {/* HEADER */}
      <div className="add-item-header">
        <h1>Post an Item</h1>

        <p>
          Help others find a lost item or report something you found.
        </p>
      </div>

      {/* FORM */}
      <form
        className="add-item-form"
        onSubmit={handleSubmit}
      >

        {/* ITEM TYPE */}
        <div className="form-group">
          <label>Item Type</label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select item type</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </div>

        {/* CATEGORY */}
        <div className="form-group">
          <label>Category</label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Electronics, Documents, Accessories"
            required
          />
        </div>

        {/* ITEM NAME */}
        <div className="form-group">
          <label>Item Name</label>

          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="e.g. Black Wallet"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group full-width">
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item and any identifying details..."
            required
          />
        </div>

        {/* COLOR */}
        <div className="form-group">
          <label>Color</label>

          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Black"
          />
        </div>

        {/* LOCATION / CITY */}
        <div className="form-group">
          <label>Location / City</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter city"
            list="city-locations"
            required
          />

          <datalist id="city-locations">
            {DEFAULT_CITIES.map((city) => (
              <option
                value={city}
                key={city}
              />
            ))}
          </datalist>

          <small>
            Select a suggested city or enter a new city.
          </small>
        </div>

        {/* AREA */}
        <div className="form-group">
          <label>Area</label>

          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g. Kukatpally"
            required
          />
        </div>

        {/* SPECIFIC PLACE */}
        <div className="form-group">
          <label>Specific Place</label>

          <input
            type="text"
            name="specificPlace"
            value={formData.specificPlace}
            onChange={handleChange}
            placeholder="e.g. Forum Mall, Library, Bus Stop"
            required
          />
        </div>

        {/* IMAGES */}
        <div className="form-group full-width">
          <label>Images</label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <small>
            You can upload up to 5 images.
          </small>

          {/* SELECTED IMAGES */}
          {images.length > 0 && (
            <div className="selected-images">

              <p className="selected-images-count">
                {images.length} image(s) selected
              </p>

              {images.map((image, index) => (
                <div
                  className="selected-image-item"
                  key={`${image.name}-${index}`}
                >
                  <span>
                    {index + 1}. {image.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* VIDEO */}
        <div className="form-group full-width">
          <label>Video</label>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="form-actions full-width">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-item-btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Item"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddItemPage;