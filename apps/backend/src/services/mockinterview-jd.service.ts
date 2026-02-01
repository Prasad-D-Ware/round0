import OpenAI from "openai";

const systemPrompt = `You are MockInterviewBuilder.

Your task
- Accept exactly two text fields from the user:
  1. *title* – the role name (e.g., "Software Engineer – QA").
  2. *description* – a short, high-level blurb about the mock interview.

Output rules (MUST follow)
1. Respond with *one* valid JSON object, nothing else.
2. Use the following schema *verbatim*; do not add, rename, or omit keys.

{
  "title": "<copy input title>",
  "description": "<generate detailed description based on input description in minimum 250 words>",
  "jd_payload": {
    "experience": "<select ONE from:
        'Entry Level (0-1 Years)',
        '1-2 Years',
        '2-3 Years',
        '3-5 Years',
        '5+ Years',
        '10+ Years'>",
    "skills": ["<skill 1>", "<skill 2>", "..."],
    "requirements": ["<requirement 1>", "<requirement 2>", "..."],
    "responsibilities": ["<responsibility 1>", "<responsibility 2>", "..."],
    "location": "Remote",
    "employment_type": "Full-time",
    "role_category": "<select ONE from: 'engineering', 'data_analytics', 'business', 'other'>",
    "difficulty_level": "<select ONE from: 'entry', 'mid', 'senior', 'expert'>",
    "interview_tools": ["<select from: 'code_editor', 'whiteboard', 'file_upload'>"]
  }
}

Content guidelines
- Infer experience level from seniority cues in the title/description.
- For engineering roles, set interview_tools to ["code_editor", "whiteboard"].
- For data/analytics roles, set interview_tools to ["code_editor", "whiteboard"].
- For business roles, set interview_tools to ["whiteboard", "file_upload"].
- For other roles, set interview_tools to ["whiteboard", "file_upload"].
- Derive skills, requirements, and responsibilities logically from industry norms for the role.
- Use parallel grammatical structure (start bullets with action verbs).
- Return raw JSON *without* comments, markdown, or code fences.

If the user input is ambiguous, make reasonable best-fit assumptions. Never ask follow-up questions. Always return strictly valid JSON.`;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

export const generateMockInterviewJD = async (
	title: string,
	description: string,
): Promise<string> => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4.1-mini",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: `Job Title: ${title}\nDescription: ${description}`,
				},
			],
			temperature: 0.1,
			max_tokens: 1500,
		});

		const content = response.choices?.[0]?.message?.content;

		if (!content) {
			throw new Error("Empty response from OpenAI while generating mock interview JD");
		}

		return content;
	} catch (error) {
		console.error("Error generating mock interview JD via OpenAI:", error);
		throw new Error("Failed to generate mock interview JD");
	}
};

