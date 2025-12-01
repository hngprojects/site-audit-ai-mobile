import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';

export interface SubmitRequestFormRequest {
    user_id: string;
    job_id: string;
    website: string;
    selected_category: string[];
}

export interface SubmitRequestFormResponse {
    status_code: number;
    status: string;
    message: string;
    data?: any;
}

export const requestFormService = {
    async submitRequestForm(data: SubmitRequestFormRequest): Promise<SubmitRequestFormResponse> {
        const { user_id, job_id, website, selected_category } = data;
        console.log("DATA:", data);
        // Validate required fields
        if (!user_id) {
            throw new Error('User ID is required');
        }
        if (!job_id) {
            throw new Error('Job ID is required');
        }
        if (!website) {
            throw new Error('Website URL is required');
        }
        if (!selected_category || selected_category.length === 0) {
            throw new Error('At least one category must be selected');
        }

        try {
            const response = await apiClient.post<SubmitRequestFormResponse>(
                '/api/v1/request-form/',
                {
                    user_id: user_id.trim(),
                    job_id: job_id.trim(),
                    website: website.trim(),
                    selected_category: selected_category,
                }
            );

            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = formatErrorMessage(error.response || error);
                throw new Error(errorMessage);
            }
            throw error;
        }
    },
};
