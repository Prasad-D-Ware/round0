import { BASE_URL } from "@/lib/apiConnection";

export const jobFetchingApi = {
    GET_ALL_JOBS: `${BASE_URL}job_posting/get_jobs`,
    GET_JOB_BY_ID: `${BASE_URL}job_posting/get_job_by_id`,
}

export const candidateApi = {
    GET_ALL_CANDIDATES : `${BASE_URL}users/get_all_candidates`,
    GET_CANDIDATE_DATA : `${BASE_URL}users/get_candidate`
}

export const reportApi = {
    GET_REPORT: `${BASE_URL}report/getReportByInterviewRoundId`,
};

export const recruiterApi = {
    GET_ALL_RECRUITERS : `${BASE_URL}users/get_all_recruiters`,
}

export const mockInterviewApi = {
    CREATE_MOCK_JOB: `${BASE_URL}job_posting/create_mock_job`,
    GET_ALL_MOCK_JOBS: `${BASE_URL}job_posting/get_all_mock_jobs`,
    GET_MOCK_JOB_BY_ID: `${BASE_URL}job_posting/get_mock_job_by_id`,
    GET_MOCK_INTERVIEWS: `${BASE_URL}mockinterview/get_mockinterviews`,
    UPDATE_MOCK_JOB: `${BASE_URL}job_posting/update_mock_job_by_id`,
    DELETE_MOCK_JOB: `${BASE_URL}job_posting/delete_mock_job_by_id`,
    GET_ANALYTICS: `${BASE_URL}mockinterview/analytics`,
    GET_CANDIDATE_PROGRESS: `${BASE_URL}mockinterview/candidate_progress`,
}