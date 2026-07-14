import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["To Do", "In Progress", "Completed"];

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  dueDate: "",
};

// Convert an ISO date string to yyyy-mm-dd for <input type="date" />
const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

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

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);

  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [movingIds, setMovingIds] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      setFetchError("");

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      setFetchError(
        error.response?.data?.message || "Failed to load tasks."
      );
      toast.error(
        error.response?.data?.message || "Failed to load tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1000);
  };

  const openCreateModal = (defaultStatus = "To Do") => {
    setEditingTask(null);
    setFormData({ ...EMPTY_FORM, status: defaultStatus });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      dueDate: toDateInputValue(task.dueDate),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      return toast.error("Task title is required.");
    }

    const payload = {
      title,
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || null,
    };

    try {
      setSaving(true);

      if (editingTask) {
        const updated = await updateTask(editingTask._id, payload);

        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );

        toast.success("Task updated successfully.");
      } else {
        const created = await createTask(payload);

        setTasks((prev) => [created, ...prev]);

        toast.success("Task created successfully.");
      }

      setIsModalOpen(false);
      setEditingTask(null);
      setFormData(EMPTY_FORM);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingTask ? "Failed to update task." : "Failed to create task.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    const id = task._id;

    // Optimistic UI: remove immediately from state
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setDeletingIds((prev) => [...prev, id]);

    try {
      await deleteTask(id);
      toast.success("Task deleted successfully.");
    } catch (error) {
      // Revert on failure
      setTasks(previousTasks);
      toast.error(
        error.response?.data?.message || "Failed to delete task."
      );
    } finally {
      setDeletingIds((prev) => prev.filter((tid) => tid !== id));
    }
  };

  // ---- Kanban drag & drop ----

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStatus !== status) setDragOverStatus(status);
  };

  const handleColumnDragLeave = (status) => {
    setDragOverStatus((prev) => (prev === status ? null : prev));
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverStatus(null);

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    const previousTasks = tasks;

    // Optimistic move
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    setMovingIds((prev) => [...prev, taskId]);

    try {
      const payload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        dueDate: task.dueDate,
      };

      const updated = await updateTask(taskId, payload);

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

      toast.success(`Task moved to "${newStatus}".`);
    } catch (error) {
      setTasks(previousTasks);
      toast.error(
        error.response?.data?.message || "Failed to move task."
      );
    } finally {
      setMovingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const formatDate = (value) => {
    if (!value) return "No due date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No due date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const priorityClass = (priority) =>
    `badge badge-priority-${(priority || "medium").toLowerCase()}`;

  const columnKey = (status) =>
    status.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1 className="logo">FlowStack</h1>
          <p className="subtitle subtitle-left">
            Agile Project Management Platform
          </p>
        </div>

        <div className="header-right">
          <div className="user-chip">
            <span className="user-name">{user?.name ?? "N/A"}</span>
            <span className="user-role">{user?.role ?? "Member"}</span>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="tasks-toolbar">
          <div>
            <h2 className="section-title">Task Board</h2>
            <p className="section-subtitle">
              {loadingTasks
                ? "Loading your tasks..."
                : `${tasks.length} task${tasks.length === 1 ? "" : "s"} total`}
            </p>
          </div>

          <button className="btn-primary" onClick={() => openCreateModal()}>
            + New Task
          </button>
        </div>

        {loadingTasks && (
          <div className="state-box">
            <p>Loading tasks...</p>
          </div>
        )}

        {!loadingTasks && fetchError && (
          <div className="state-box state-error">
            <p>{fetchError}</p>
            <button className="btn-secondary" onClick={fetchTasks}>
              Try Again
            </button>
          </div>
        )}

        {!loadingTasks && !fetchError && tasks.length === 0 && (
          <div className="state-box">
            <p>No tasks yet. Create your first task to get started.</p>
            <button className="btn-primary" onClick={() => openCreateModal()}>
              + New Task
            </button>
          </div>
        )}

        {!loadingTasks && !fetchError && tasks.length > 0 && (
          <div className="board">
            {STATUSES.map((status) => {
              const columnTasks = tasks.filter((t) => t.status === status);
              const isDragOver = dragOverStatus === status;

              return (
                <div
                  key={status}
                  className={`board-column column-${columnKey(status)} ${
                    isDragOver ? "column-drag-over" : ""
                  }`}
                  onDragOver={(e) => handleColumnDragOver(e, status)}
                  onDragLeave={() => handleColumnDragLeave(status)}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="column-header">
                    <span className="column-title">{status}</span>
                    <span className="column-count">{columnTasks.length}</span>
                  </div>

                  <button
                    className="btn-column-add"
                    onClick={() => openCreateModal(status)}
                  >
                    + Add task
                  </button>

                  <div className="column-body">
                    {columnTasks.length === 0 && (
                      <div className="column-empty">
                        Drop a task here
                      </div>
                    )}

                    {columnTasks.map((task) => (
                      <div
                        className={`task-card ${
                          movingIds.includes(task._id) ? "task-card-moving" : ""
                        }`}
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task._id)}
                      >
                        <div className="task-card-top">
                          <h3 className="task-title">{task.title}</h3>
                          <span className={priorityClass(task.priority)}>
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="task-description">
                            {task.description}
                          </p>
                        )}

                        <div className="task-meta">
                          <span className="task-due">
                            📅 {formatDate(task.dueDate)}
                          </span>
                        </div>

                        <div className="task-actions">
                          <button
                            className="btn-outline"
                            onClick={() => openEditModal(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger"
                            disabled={deletingIds.includes(task._id)}
                            onClick={() => handleDelete(task)}
                          >
                            {deletingIds.includes(task._id)
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />

              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Task description (optional)"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
              />

              <div className="form-row">
                <div className="form-col">
                  <label className="form-label" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-col">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="form-label" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;