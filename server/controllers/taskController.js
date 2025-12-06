const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status && ["pending", "completed"].includes(status)) filter.status = status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const task = await Task.create({
      title,
      user: req.user._id,
      priority: priority || "medium",
      dueDate: dueDate || null
    });

    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, status, priority, dueDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();
    res.json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleStatus };
