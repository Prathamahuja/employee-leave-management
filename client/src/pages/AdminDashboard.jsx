import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetchApi("/api/admin/leaves");
      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      } else {
        // If unauthorized, might want to redirect
        if (response.status === 403) {
          navigate("/dashboard"); // Not admin
        }
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const adminComment = prompt("Enter optional comment:");

    try {
      const response = await fetchApi(`/api/admin/leaves/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          admin_comment: adminComment,
        }),
      });

      if (response.ok) {
        fetchLeaves(); // Refresh list
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="user-info">
          <span>Admin: {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="leaves-list">
        <h3>All Leave Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className={leave.status === "pending" ? "pending-row" : ""}
                >
                  <td>{leave.employee_name}</td>
                  <td>{leave.type}</td>
                  <td>
                    {leave.start_date} to {leave.end_date}
                  </td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-${leave.status}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.admin_comment || "-"}</td>
                  <td>
                    {leave.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave.id, "approved")
                          }
                          className="btn-approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave.id, "rejected")
                          }
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
