import { BASE_URL } from "@/lib/apiConnection";

export const generateMockInterviewJD = async (title: string, description: string) => {
	try {
		const res = await fetch(`${BASE_URL}mockinterview/generate_mock_interview_jd`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
			}),
		});

		if (!res.ok) {
			throw new Error(`Backend error: ${res.status} ${res.statusText}`);
		}

		const data = await res.json();

		if (!data?.success || !data?.data) {
			throw new Error(data?.message || "Invalid response format from backend");
		}

		return data.data as string;
	} catch (error) {
		console.error("Error generating mock interview description via backend:", error);
		throw new Error("Failed to generate mock interview description");
	}
};
