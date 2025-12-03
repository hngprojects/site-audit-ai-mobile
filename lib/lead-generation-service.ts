import { LeadResponse } from "@/type";
import { apiClient, formatErrorMessage, isAxiosError } from "./api-client";

export const leadService = {
  async createLead(email: string): Promise<LeadResponse> {
    try {
      const response = await apiClient.post('/api/v1/leads/', { email });
      const res = response.data;

      
      if (
        res?.status_code === 201 &&
        res?.message === "Thanks! We received your request and will get back to you."
      ) {
        return {
          ...res,
          message: "Thanks! We've received your email address."
        };
      }

      return res;

    } catch (error) {
      if (isAxiosError(error)) {
        const res = error.response?.data;

        // Custom error message for duplicate email
        if (res?.status_code === 400 && res?.message === "Email already submitted") {
          
          const err: any = error; 
          err.response.data = {
            ...res,
            message: "Email already exists. Same email cannot be submitted twice."
          };
          throw err;
        }

        // For other API errors, attach formatted message
        const err: any = error;
        err.response.data = {
          ...res,
          message: formatErrorMessage(res)
        };
        throw err;
      }

      // Non-Axios errors
      const genericErr: any = new Error("Failed to submit email. Please try again.");
      throw genericErr;
    }
  },
};
