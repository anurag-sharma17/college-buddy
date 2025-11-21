const mongoose = require("mongoose");

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const { category, department } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (department) filter.department = department;

    const contacts = await Contact.find(filter).sort({ priority: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contact",
      error: error.message,
    });
  }
};

// Get contacts by category
exports.getContactsByCategory = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const { category } = req.params;
    const contacts = await Contact.find({
      category,
      isActive: true,
    }).sort({ priority: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts by category",
      error: error.message,
    });
  }
};

// Create a new contact (Admin only)
exports.createContact = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating contact",
      error: error.message,
    });
  }
};

// Update a contact (Admin only)
exports.updateContact = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating contact",
      error: error.message,
    });
  }
};

// Delete a contact (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting contact",
      error: error.message,
    });
  }
};

// Search contacts
exports.searchContacts = async (req, res) => {
  try {
    const Contact = mongoose.model("Contact");
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const contacts = await Contact.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { designation: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).sort({ priority: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching contacts",
      error: error.message,
    });
  }
};
