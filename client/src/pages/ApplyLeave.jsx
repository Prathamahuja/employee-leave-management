import { useState } from "react";
import { fetchApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    type: "Sick Leave",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetchApi("/api/leaves", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to submit leave request");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Apply for Leave</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Vacation">Vacation</option>
          </select>
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit Request</button>
      </form>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default ApplyLeave;
