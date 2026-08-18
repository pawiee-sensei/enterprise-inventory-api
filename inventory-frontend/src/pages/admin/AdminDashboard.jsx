import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin {user?.first_name}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;