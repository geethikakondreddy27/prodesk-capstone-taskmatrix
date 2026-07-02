import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="card dashboard-card">
        <h1 className="logo">FlowStack</h1>

        <p className="subtitle">
          Agile Project Management Platform
        </p>

        <div className="info-box">
          <p><strong>Status:</strong> Authentication Successful ✅</p>
          <p><strong>Role:</strong> Member</p>
          <p><strong>Backend:</strong> Connected</p>
          <p><strong>JWT:</strong> Active</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;