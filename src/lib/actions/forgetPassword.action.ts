import { JSON_HEADER } from "../constants/api.constants";

export const sendForgotPasswordEmail = async (email: string) => {
    const response = await fetch("https://exam.elevateegy.com/api/v1/auth/forgotPassword", {
      method: "POST",
      headers: {
        ...JSON_HEADER
      },
      body: JSON.stringify({ email }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send forgot password email");
    }
  
    return data;
  };
  
  export const verifyResetCode = async (resetCode: string) => {
    const response = await fetch("https://exam.elevateegy.com/api/v1/auth/verifyResetCode", {
      method: "POST",
      headers: {
        ...JSON_HEADER
      },
      body: JSON.stringify({ resetCode }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify reset code");
    }
  
    return data;
  };
  
  export const resetPassword = async (email: string, newPassword: string) => {
    const response = await fetch("https://exam.elevateegy.com/api/v1/auth/resetPassword", {
      method: "PUT",
      headers: {
        ...JSON_HEADER
      },
      body: JSON.stringify({ email, newPassword }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }
  
    return data;
  };
  