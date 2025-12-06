const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleStatus
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleStatus);

module.exports = router;
