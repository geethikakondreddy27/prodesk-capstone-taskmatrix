import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1000);
  };

  return (
    <div className="page">
      <div className="card dashboard-card">
        <h1 className="logo">FlowStack</h1>

        <p className="subtitle">
          Agile Project Management Platform
        </p>

        <div className="info-box">
          <p>
            <strong>Status:</strong> Authentication Successful ✅
          </p>

          <p>
            <strong>Name:</strong> {user?.name ?? "N/A"}
          </p>

          <p>
            <strong>Email:</strong> {user?.email ?? "N/A"}
          </p>

          <p>
            <strong>Role:</strong> {user?.role ?? "Member"}
          </p>

          <p>
            <strong>Backend:</strong> Connected
          </p>

          <p>
            <strong>JWT:</strong> Active
          </p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;