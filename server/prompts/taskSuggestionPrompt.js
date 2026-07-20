const buildTaskSuggestionPrompt = (taskTitle) => `
You are an experienced Agile Project Manager.

Generate ONLY valid JSON.

Do not include markdown.

Do not wrap the response inside \`\`\`.

Generate between 5 and 8 actionable subtasks for this task:

"${taskTitle}"

Return ONLY this JSON format:

{
  "subtasks": [
    {
      "title": "...",
      "priority": "High"
    }
  ]
}

Rules:
- title must be short.
- priority must be one of: High, Medium, Low.
- No explanation.
- No extra text.
`;

export default buildTaskSuggestionPrompt;