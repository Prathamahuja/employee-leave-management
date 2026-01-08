const express = require("express");
const db = require("../db");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to validate dates
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Check if it's a valid date
};

// Helper function to compare dates
const isStartDateBeforeEndDate = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate);
};

// Create a new leave request
router.post("/", isAuthenticated, (req, res) => {
  const { type, start_date, end_date, reason } = req.body;
  const userId = req.session.userId;

  if (!type || !start_date || !end_date) {
    return res
      .status(400)
      .json({ message: "Please provide type, start_date, and end_date" });
  }

  if (!isValidDate(start_date) || !isValidDate(end_date)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (!isStartDateBeforeEndDate(start_date, end_date)) {
    return res
      .status(400)
      .json({ message: "End date cannot be before start date" });
  }

  const query = `INSERT INTO leaves (user_id, type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [userId, type, start_date, end_date, reason], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating leave request", error: err.message });
    }
    res
      .status(201)
      .json({
        message: "Leave request submitted successfully",
        leaveId: this.lastID,
      });
  });
});

// Get all leave requests for the logged-in user
router.get("/my-leaves", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const query = `SELECT * FROM leaves WHERE user_id = ? ORDER BY start_date DESC`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching leaves", error: err.message });
    }
    res.json(rows);
  });
});

// Get a specific leave request (only if it belongs to the user)
router.get("/:id", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const leaveId = req.params.id;
  const query = `SELECT * FROM leaves WHERE id = ? AND user_id = ?`;

  db.get(query, [leaveId, userId], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching leave", error: err.message });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Leave not found or unauthorized" });
    }
    res.json(row);
  });
});

// Update a leave request (only if status is pending)
router.put("/:id", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const leaveId = req.params.id;
  const { type, start_date, end_date, reason } = req.body;

  // First check if the leave exists and belongs to the user and is pending
  const checkQuery = `SELECT status FROM leaves WHERE id = ? AND user_id = ?`;

  db.get(checkQuery, [leaveId, userId], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error checking leave status", error: err.message });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Leave not found or unauthorized" });
    }
    if (row.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot update a leave request that is not pending" });
    }

    // Validate input if provided
    if (start_date && !isValidDate(start_date))
      return res.status(400).json({ message: "Invalid start date" });
    if (end_date && !isValidDate(end_date))
      return res.status(400).json({ message: "Invalid end date" });

    // If both provided, check range. If only one provided, we'd need to fetch the other to check range properly,
    // but for simplicity let's assume if they update dates they update both or we just trust the new single date validity against itself.
    // Better practice: Fetch existing dates to compare against new single date.

    // Let's keep it simple: Require both dates if updating dates, or just update what's passed.
    // But we must validate range if both exist.
    if (
      start_date &&
      end_date &&
      !isStartDateBeforeEndDate(start_date, end_date)
    ) {
      return res
        .status(400)
        .json({ message: "End date cannot be before start date" });
    }

    // Construct dynamic update query
    let fields = [];
    let values = [];
    if (type) {
      fields.push("type = ?");
      values.push(type);
    }
    if (start_date) {
      fields.push("start_date = ?");
      values.push(start_date);
    }
    if (end_date) {
      fields.push("end_date = ?");
      values.push(end_date);
    }
    if (reason) {
      fields.push("reason = ?");
      values.push(reason);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(leaveId);
    values.push(userId);

    const updateQuery = `UPDATE leaves SET ${fields.join(
      ", "
    )} WHERE id = ? AND user_id = ?`;

    db.run(updateQuery, values, function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating leave", error: err.message });
      }
      res.json({ message: "Leave updated successfully" });
    });
  });
});

// Delete a leave request (only if status is pending)
router.delete("/:id", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const leaveId = req.params.id;

  const checkQuery = `SELECT status FROM leaves WHERE id = ? AND user_id = ?`;

  db.get(checkQuery, [leaveId, userId], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error checking leave status", error: err.message });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Leave not found or unauthorized" });
    }
    if (row.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot delete a leave request that is not pending" });
    }

    const deleteQuery = `DELETE FROM leaves WHERE id = ? AND user_id = ?`;
    db.run(deleteQuery, [leaveId, userId], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error deleting leave", error: err.message });
      }
      res.json({ message: "Leave deleted successfully" });
    });
  });
});

module.exports = router;
