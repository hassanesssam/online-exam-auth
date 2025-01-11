"use server"

import { JSON_HEADER } from "../constants/api.constants";

export const registerUser = async (userData : FormValues) => {
    try {
      const res = await fetch("https://exam.elevateegy.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          ...JSON_HEADER
        },
        body: JSON.stringify(userData),
      });
  
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to Send Data');
      }
  
      const data = await res.json();
      return data.subjects;
    } catch (error: unknown) {
      throw error;
    }
  };
  