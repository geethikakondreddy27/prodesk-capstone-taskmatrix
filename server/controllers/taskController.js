import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

if (!title || !title.trim()) {
  return res.status(400).json({
    message: "Task title is required.",
  });
}

const task = await Task.create({
  title: title.trim(),
  description: description?.trim() || "",
  priority,
  status,
  dueDate,
  authorId: req.user.id,
});

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task.",
    });
  }
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      authorId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden.",
      });
    }

    // Only allow specific editable fields through.
    // Prevents clients from reassigning authorId or writing
    // arbitrary fields via req.body (mass assignment).
    const { title, description, priority, status, dueDate } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task.",
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden.",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task.",
    });
  }
};