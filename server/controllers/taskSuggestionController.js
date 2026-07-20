import asyncHandler from "../middleware/asyncHandler.js";
import model from "../config/gemini.js";
import buildTaskSuggestionPrompt from "../prompts/taskSuggestionPrompt.js";

export const generateTaskSuggestions = asyncHandler(async (req, res) => {
  const { taskTitle } = req.body;

  const prompt = buildTaskSuggestionPrompt(taskTitle);

  const result = await model.generateContent(prompt);

  const response = await result.response;

  let text = response.text().trim();

  // Remove markdown code blocks if Gemini returns them
  text = text.replace(/^```json\s*/i, "");
  text = text.replace(/^```\s*/i, "");
  text = text.replace(/```$/i, "").trim();

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(text);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to parse AI response.");
  }

  if (
    !parsedResponse.subtasks ||
    !Array.isArray(parsedResponse.subtasks)
  ) {
    res.status(500);
    throw new Error("Invalid AI response format.");
  }

  res.status(200).json(parsedResponse);
});