import { z } from "zod";

export const taskSuggestionSchema = z.object({
  taskTitle: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters.")
    .max(150, "Task title cannot exceed 150 characters."),
});