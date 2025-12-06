import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask
} from "../api/tasks";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium"); 
  const [dueDate, setDueDate] = useState("");
  const [editingPriority, setEditingPriority] = useState("medium");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [taskError, setTaskError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  const loadTasks = async (status) => {
    setLoading(true);
    try {
      const statusParam = status === "all" ? undefined : status;
      const res = await fetchTasks(statusParam);
      setTasks(res.data);
    } catch {
      // handle silently or show error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(filter);
  }, [filter]);

  const handleCreate = async (e) => {
  e.preventDefault();
  setTaskError("");

  if (!title.trim()) {
    setTaskError("Title cannot be empty");
    return;
  }

  try {
    const res = await createTask({
      title: title.trim(),
      priority,
      dueDate: dueDate || null
    });
    setTasks((prev) => [res.data, ...prev]);
    setTitle("");
    setPriority("medium");
    setDueDate("");
  } catch {
    setTaskError("Could not save task. Please try again.");
  }
};

  const startEdit = (task) => {
  setEditingId(task._id);
  setEditingTitle(task.title);
  setEditingPriority(task.priority || "medium");
  setEditingDueDate(
    task.dueDate ? task.dueDate.slice(0, 10) : "" // ISO date -> yyyy-mm-dd
  );
};

 const saveEdit = async (id) => {
  const res = await updateTask(id, {
    title: editingTitle,
    priority: editingPriority,
    dueDate: editingDueDate || null
  });
  setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  setEditingId(null);
  setEditingTitle("");
  setEditingPriority("medium");
  setEditingDueDate("");
};

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleToggle = async (id) => {
    const res = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Task Tracker</h2>
        <div>
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="task-form">
        <form onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
          />
          <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
  />
  <button type="submit">Add Task</button>
</form>
{taskError && <p className="error">{taskError}</p>}
      </section>

      <section className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </section>
      <section className="stats">
  <span>Total: {totalTasks}</span>
  <span>Completed: {completedTasks}</span>
  <span>Pending: {pendingTasks}</span>
    </section>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
         <tbody>
  {tasks.map((task) => (
    <tr key={task._id}>
      {/* Title */}
      <td>
        {editingId === task._id ? (
          <input
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
          />
        ) : (
          task.title
        )}
      </td>

      {/* Status */}
      <td>{task.status}</td>

      {/* Priority */}
      <td>
        {editingId === task._id ? (
          <select
            value={editingPriority}
            onChange={(e) => setEditingPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        ) : (
          task.priority || "medium"
        )}
      </td>

      {/* Due */}
      <td>
        {editingId === task._id ? (
          <input
            type="date"
            value={editingDueDate}
            onChange={(e) => setEditingDueDate(e.target.value)}
          />
        ) : task.dueDate ? (
          new Date(task.dueDate).toLocaleDateString()
        ) : (
          "-"
        )}
      </td>

      {/* Created */}
      <td>{new Date(task.createdAt).toLocaleString()}</td>

      {/* Actions */}
      <td>
        {editingId === task._id ? (
          <button onClick={() => saveEdit(task._id)}>💾</button>
        ) : (
          <button onClick={() => startEdit(task)}>✏️</button>
        )}
        <button onClick={() => handleToggle(task._id)}>🔁</button>
        <button onClick={() => handleDelete(task._id)}>🗑️</button>
      </td>
    </tr>
  ))}
  {tasks.length === 0 && (
    <tr>
      <td colSpan="6">No tasks yet</td>
    </tr>
  )}
</tbody>

        </table>
      )}
    </div>
  );
};

export default DashboardPage;