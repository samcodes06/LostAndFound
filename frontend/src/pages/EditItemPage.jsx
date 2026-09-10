import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/EditItemPage.css";
import useNotification from "../context/useNotification";

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showToast, showConfirm } = useNotification();

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET EXISTING ITEM
  useEffect(() => {
  const getItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      const item = response.data.item;

      setFormData({
        type: item.type || "",
        category: item.category || "",
        itemName: item.itemName || "",
        description: item.description || "",
        color: item.color || "",
        location: item.location || "",
        area: item.area || "",
        specificPlace: item.specificPlace || ""
      });

      setExistingImages(item.images || []);
      setExistingVideo(item.video || null);
    } catch (error) {
      console.error("Failed to load item", error);
    } finally {
      setLoading(false);
    }
  };

  getItem();
}, [id]);

  // TEXT FIELD CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // SELECT NEW IMAGES
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + files.length > 5) {
      showToast(
        "Maximum 5 images allowed",
        "error"
      );
      return;
    }

    setNewImages(files);
  };

  // SELECT NEW VIDEO
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewVideo(file);
    }
  };

  // DELETE EXISTING IMAGE
  const handleDeleteImage = async (imageId) => {
    const confirmDelete = await showConfirm(
      "Are you sure you want to delete this image?",
      "Delete Image"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/items/${id}/images/${imageId}`
      );

      setExistingImages((prev) =>
        prev.filter(
          (image) => image._id !== imageId
        )
      );

      showToast(
        "Image deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to delete image",
        "error"
      );
    }
  };

  // DELETE EXISTING VIDEO
  const handleDeleteVideo = async () => {
    const confirmDelete = await showConfirm(
      "Are you sure you want to delete this video?",
      "Delete Video"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/items/${id}/video`);

      setExistingVideo(null);

      showToast(
        "Video deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to delete video",
        "error"
      );
    }
  };

  // SUBMIT UPDATED ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      newImages.forEach((image) => {
        data.append("images", image);
      });

      if (newVideo) {
        data.append("video", newVideo);
      }

      await api.put(`/items/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      showToast(
        "Item updated successfully!",
        "success"
      );

      navigate(`/items/${id}`);
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.message ||
          "Failed to update item",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-item-loading">
        Loading item...
      </div>
    );
  }

  return (
    <div className="edit-item-page">

      <div className="edit-item-container">

        {/* HEADER */}
        <div className="edit-item-header">

          <button
            className="edit-item-back-btn"
            onClick={() =>
              navigate(`/items/${id}`)
            }
          >
            ← Back to Item
          </button>

          <h1>Edit Item</h1>

          <p>
            Update the details and media of your posted item.
          </p>

        </div>

        {/* CARD */}
        <div className="edit-item-card">

          <form
            className="edit-item-form"
            onSubmit={handleSubmit}
          >

            {/* TYPE */}
            <div className="edit-item-group">
              <label>Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Type
                </option>

                <option value="LOST">
                  Lost
                </option>

                <option value="FOUND">
                  Found
                </option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="edit-item-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />
            </div>

            {/* ITEM NAME */}
            <div className="edit-item-group">
              <label>Item Name</label>

              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            {/* COLOR */}
            <div className="edit-item-group">
              <label>Color</label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Enter color"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="edit-item-group edit-item-full">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item"
                required
              />
            </div>

            {/* LOCATION */}
            <div className="edit-item-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            {/* AREA */}
            <div className="edit-item-group">
              <label>Area</label>

              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
              />
            </div>

            {/* SPECIFIC PLACE */}
            <div className="edit-item-group edit-item-full">
              <label>Specific Place</label>

              <input
                type="text"
                name="specificPlace"
                value={formData.specificPlace}
                onChange={handleChange}
                placeholder="Enter specific place"
              />
            </div>

            {/* EXISTING IMAGES */}
            <div className="edit-item-section">

              <h3>Existing Images</h3>

              {existingImages.length === 0 ? (

                <p className="edit-item-empty">
                  No images available
                </p>

              ) : (

                <div className="edit-item-images">

                  {existingImages.map((image) => (

                    <div
                      className="edit-item-image-card"
                      key={image._id}
                    >

                      <img
                        src={image.url}
                        alt="Item"
                      />

                      <button
                        type="button"
                        className="delete-media-btn"
                        onClick={() =>
                          handleDeleteImage(
                            image._id
                          )
                        }
                      >
                        Delete Image
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {/* ADD NEW IMAGES */}
              <div className="edit-item-file-group">

                <label>
                  Add New Images
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                {newImages.length > 0 && (

                  <p className="selected-file">
                    {newImages.length} new image(s)
                    {" "}selected
                  </p>

                )}

              </div>

            </div>

            {/* VIDEO */}
            <div className="edit-item-section">

              <h3>Video</h3>

              {existingVideo ? (

                <div className="edit-item-video">

                  <video controls>
                    <source
                      src={existingVideo.url}
                    />

                    Your browser does not support video.
                  </video>

                  <button
                    type="button"
                    className="delete-media-btn"
                    onClick={handleDeleteVideo}
                  >
                    Delete Video
                  </button>

                </div>

              ) : (

                <p className="edit-item-empty">
                  No video available
                </p>

              )}

              {/* ADD NEW VIDEO */}
              <div className="edit-item-file-group">

                <label>
                  Add New Video
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />

                {newVideo && (

                  <p className="selected-file">
                    Selected: {newVideo.name}
                  </p>

                )}

              </div>

            </div>

            {/* ACTIONS */}
            <div className="edit-item-actions">

              <button
                type="button"
                className="edit-item-cancel-btn"
                onClick={() =>
                  navigate(`/items/${id}`)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-item-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditItemPage;