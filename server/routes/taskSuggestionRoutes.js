import express from "express";

import { generateTaskSuggestions } from "../controllers/taskSuggestionController.js";
import validate from "../middleware/validate.js";
import { taskSuggestionSchema } from "../validators/taskSuggestionValidator.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "AI route is working",
  });
});

router.post(
  "/suggestions",
  validate(taskSuggestionSchema),
  generateTaskSuggestions
);

export default router;