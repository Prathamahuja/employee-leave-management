import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetchApi("/api/leaves/my-leaves");
      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?"))
      return;

    try {
      const response = await fetchApi(`/api/leaves/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchLeaves(); // Refresh list
      } else {
        alert("Failed to delete leave");
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="actions">
        <Link to="/apply-leave" className="btn-primary">
          Apply for Leave
        </Link>
      </div>

      <div className="leaves-list">
        <h3>My Leave History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.type}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-${leave.status}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.admin_comment || "-"}</td>
                  <td>
                    {leave.status === "pending" && (
                      <button
                        onClick={() => handleDelete(leave.id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
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

export default Dashboard;
