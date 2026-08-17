import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.first_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;