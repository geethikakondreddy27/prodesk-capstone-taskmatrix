import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .optional()
    .default(""),

  priority: z.enum(
    ["Low", "Medium", "High", "Critical"],
    {
      errorMap: () => ({
        message: "Invalid priority."
      })
    }
  ),

  status: z.enum(
    ["To Do", "In Progress", "Completed"],
    {
      errorMap: () => ({
        message: "Invalid task status."
      })
    }
  ),

  dueDate: z
    .union([
      z.string(),
      z.null()
    ])
    .optional()
});