import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data || []);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
      setError("Failed to load tasks: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/tasks", {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      setError(null);
      setLoading(true);
      await fetchTasks();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
      setError("Failed to create task: " + err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/tasks/${taskId}`, {
        status: newStatus,
      });
      setLoading(true);
      await fetchTasks();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
      setError("Failed to update task: " + err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setLoading(true);
      await fetchTasks();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
      setError("Failed to delete task: " + err);
    }
  };

  const getTaskStyle = (status) => {
    let backgroundColor = "#ffffff";

    if (status === "TODO") {
      backgroundColor = "#fff8c4"; // light yellow
    } else if (status === "IN_PROGRESS") {
      backgroundColor = "#e3f2fd"; // light blue
    } else if (status === "DONE") {
      backgroundColor = "#e8f5e9"; // light green
    }

    return {
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "1rem",
      marginBottom: "0.75rem",
      backgroundColor,
    };
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Task Manager</h1>
      <form
        onSubmit={handleCreateTask}
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="Enter task title"
          />
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", minHeight: "60px" }}
            placeholder="Enter task description"
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Task
        </button>
      </form>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={getTaskStyle(task.status)}
            >
              <h2 style={{ margin: "0 0 0.25rem" }}>{task.title}</h2>
              <p style={{ margin: "0 0 0.5rem", color: "#555" }}>
                {task.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  disabled={task.status === "DONE"}
                >
                  <option value={task.status}>{task.status}</option>
                  {task.status === "TODO" && (
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                  )}
                  {task.status === "IN_PROGRESS" && (
                    <option value="DONE">DONE</option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    backgroundColor: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

