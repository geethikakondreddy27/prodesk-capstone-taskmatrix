import express from "express";
import protect from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { taskSchema } from "../validators/taskValidator.js";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(validate(taskSchema), createTask)
  .get(getTasks);

router.route("/:id")
  .put(validate(taskSchema), updateTask)
  .delete(deleteTask);

export default router;