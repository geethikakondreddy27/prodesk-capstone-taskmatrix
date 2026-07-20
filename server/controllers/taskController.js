import Task from "../models/Task.js";
import asyncHandler from "../middleware/asyncHandler.js";

// =============================
// CREATE TASK
// =============================
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    authorId: req.user.id,
  });

  res.status(201).json(task);
});

// =============================
// GET ALL TASKS
// =============================
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    authorId: req.user.id,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json(tasks);
});

// =============================
// UPDATE TASK
// =============================
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found.");
  }

  if (task.authorId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden.");
  }

  const {
    title,
    description,
    priority,
    status,
    dueDate,
  } = req.body;

  const updates = {};

  if (title !== undefined)
    updates.title = title;

  if (description !== undefined)
    updates.description = description;

  if (priority !== undefined)
    updates.priority = priority;

  if (status !== undefined)
    updates.status = status;

  if (dueDate !== undefined)
    updates.dueDate = dueDate;
    const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTask);
});

// =============================
// DELETE TASK
// =============================
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found.");
  }

  if (task.authorId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden.");
  }

  await task.deleteOne();

  res.status(200).json({
    message: "Task deleted successfully.",
  });
});