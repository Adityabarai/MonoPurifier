const db = require("../config/db");
const localDb = require("../config/localDb");

// Submit a new demonstration / inquiry lead
exports.createLead = async (req, res) => {
  try {
    const { name, phone, address, model } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone number are required to book a demonstration",
      });
    }

    let result = await db.from("leads").insert({
      name: name.trim(),
      phone: phone.trim(),
      address: address ? address.trim() : "",
      model: model ? model.trim() : "Standard RO Purifier",
      status: "New",
    });

    if (result.error && db !== localDb) {
      console.warn("Primary DB error on insert lead, using localDb fallback:", result.error.message);
      result = await localDb.from("leads").insert({
        name: name.trim(),
        phone: phone.trim(),
        address: address ? address.trim() : "",
        model: model ? model.trim() : "Standard RO Purifier",
        status: "New",
      });
    }

    if (result.error) throw result.error;

    res.status(201).json({
      message: "Demonstration booked successfully! Our technician will contact you shortly.",
      lead: result.data ? result.data[0] : null,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Error booking demonstration", error: error.message });
  }
};

// Get all customer leads (Admin only)
exports.getAllLeads = async (req, res) => {
  try {
    let { data, error } = await db.from("leads").select("*");
    if (error && db !== localDb) {
      console.warn("Primary DB error on fetch leads, using localDb fallback:", error.message);
      const localRes = await localDb.from("leads").select("*");
      data = localRes.data;
      error = localRes.error;
    }
    if (error) throw error;

    // Return sorted by newest first
    const sorted = [...(data || [])].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
    res.json(sorted);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Error fetching leads", error: error.message });
  }
};

// Update lead status (Admin only)
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatePayload = { status };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    let result = await db
      .from("leads")
      .update(updatePayload)
      .eq("id", id);

    if (result.error && db !== localDb) {
      result = await localDb
        .from("leads")
        .update(updatePayload)
        .eq("id", id);
    }

    if (result.error) throw result.error;

    res.json({
      message: `Lead status updated to ${status}`,
      lead: result.data ? result.data[0] : null,
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ message: "Error updating lead status", error: error.message });
  }
};

// Delete lead (Admin only)
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await db.from("leads").delete().eq("id", id);
    if (result.error && db !== localDb) {
      result = await localDb.from("leads").delete().eq("id", id);
    }
    if (result.error) throw result.error;

    res.json({ message: "Lead removed successfully", id });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Error deleting lead", error: error.message });
  }
};


