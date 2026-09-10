import { useState } from "react";
import api from "../api/axios";
import useNotification from "../context/useNotification";
import "../styles/ContactPage.css";

function ContactPage() {
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      setSending(true);

      await api.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      showToast(
        "Your message has been sent to the admin successfully!",
        "success"
      );

      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error("Failed to send contact message:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to send message",
        "error"
      );

    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-glow contact-glow-one"></div>
      <div className="contact-glow contact-glow-two"></div>

      <div className="contact-container">

        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>
            Have a question or need help? Send us a message
            directly to the administrator.
          </p>
        </div>

        <div className="contact-content">

          <div className="contact-info">
            <h2>Contact Admin</h2>

            <p>
              We're here to help make your Lost & Found
              experience simple, secure, and smooth.
            </p>

            <div className="contact-detail">
              <span>Support</span>
              <strong>Message the Administrator</strong>
            </div>

            <div className="contact-detail">
              <span>Response</span>
              <strong>We'll get back to you soon</strong>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="contact-name">
                Your Name
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">
                Email Address
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ContactPage;