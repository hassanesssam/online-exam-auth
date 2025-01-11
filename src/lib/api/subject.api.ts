import { cookies } from 'next/headers';

export async function fetchSubjects(page: number, limit: number) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('Online_Exam_token')?.value;

    const token = tokenCookie;
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await fetch(`${process.env.API}/subjects?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch subjects');
    }

    const data = await response.json();
    return data.subjects;
  } catch (error: unknown) {
    throw error;
  }
}
