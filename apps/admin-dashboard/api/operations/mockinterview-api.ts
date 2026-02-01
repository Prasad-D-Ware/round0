import { apiConnector } from "@/lib/apiConnector";
import { mockInterviewApi } from "../api";

export const createMockJobPosting = async (
    title: string,
    description: string,
    jd_payload: object,
    token: string
) => {
    try {
        const response = await apiConnector(
            "POST",
            mockInterviewApi.CREATE_MOCK_JOB,
            { title, description, jd_payload },
            { Authorization: token },
            null,
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAllMockInterviews = async (token: string) => {
    try {
        const response = await apiConnector(
            "GET",
            mockInterviewApi.GET_MOCK_INTERVIEWS,
            null,
            { Authorization: token },
            null,
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getMockJobPostingById = async (job_id: string, token: string) => {
    try {
        const response = await apiConnector(
            "GET",
            mockInterviewApi.GET_MOCK_JOB_BY_ID,
            null,
            { Authorization: token },
            { job_id },
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAllMockJobPostings = async (token: string) => {
    try {
        const response = await apiConnector(
            "GET",
            mockInterviewApi.GET_ALL_MOCK_JOBS,
            null,
            { Authorization: token },
            null,
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const updateMockJobPosting = async (
    job_id: string,
    title: string,
    description: string,
    jd_payload: object,
    token: string
) => {
    try {
        const response = await apiConnector(
            "PUT",
            mockInterviewApi.UPDATE_MOCK_JOB,
            { job_id, title, description, jd_payload },
            { Authorization: token },
            null,
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const deleteMockJobPosting = async (
    job_id: string,
    token: string
) => {
    try {
        const response = await apiConnector(
            "DELETE",
            mockInterviewApi.DELETE_MOCK_JOB,
            null,
            { Authorization: token },
            { job_id },
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getMockInterviewAnalytics = async (token: string) => {
    try {
        const response = await apiConnector(
            "GET",
            mockInterviewApi.GET_ANALYTICS,
            null,
            { Authorization: token },
            null,
            null
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};
