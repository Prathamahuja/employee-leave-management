import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    // We can't immediately check user role here because user state updates asynchronously
    // But login usually returns success.
    // We should rely on the ProtectedRoute or check the returned user if we modified login to return it.
    // For now let's just navigate and let the ProtectedRoute handle it or check result.

    if (result.success) {
      // We could technically check the user role here if the login function returned the user object
      // But for simplicity, we'll just redirect to admin dashboard.
      // If they aren't actually an admin, the dashboard's route protection (if implemented right) or API calls will fail.
      navigate("/admin/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container admin-login">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login as Admin</button>
      </form>
      <p>
        <Link to="/login">Back to Employee Login</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
