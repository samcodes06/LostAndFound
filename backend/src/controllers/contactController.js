const ContactMessage = require("../models/contactMessageModel");

// Submit contact message
const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      message
    });

    await contactMessage.save();

    return res.status(201).json({
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to send message"
    });
  }
};


// Get all contact messages - Admin
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      messages
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Mark contact message as read - Admin
const markContactMessageAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    message.status = "READ";

    await message.save();

    return res.status(200).json({
      message: "Message marked as read"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createContactMessage,
  getAllContactMessages,
  markContactMessageAsRead
};