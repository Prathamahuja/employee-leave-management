const express = require("express");
const db = require("../db");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply admin check to all routes in this file
router.use(isAuthenticated, isAdmin);

// Get all leave requests
router.get("/leaves", (req, res) => {
  const query = `
    SELECT leaves.*, users.name as employee_name 
    FROM leaves 
    JOIN users ON leaves.user_id = users.id 
    ORDER BY leaves.status = 'pending' DESC, leaves.start_date DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching leaves", error: err.message });
    }
    res.json(rows);
  });
});

// Approve or Reject leave request
router.put("/leaves/:id", (req, res) => {
  const leaveId = req.params.id;
  const { status, admin_comment } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
  }

  // Check if leave exists first
  db.get("SELECT id FROM leaves WHERE id = ?", [leaveId], (err, row) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    if (!row)
      return res.status(404).json({ message: "Leave request not found" });

    const query = `UPDATE leaves SET status = ?, admin_comment = ? WHERE id = ?`;

    db.run(query, [status, admin_comment, leaveId], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating leave status", error: err.message });
      }
      res.json({ message: `Leave request ${status} successfully` });
    });
  });
});

module.exports = router;
