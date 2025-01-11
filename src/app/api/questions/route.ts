import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("exam");
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('Online_Exam_token')?.value;
  const token = tokenCookie;

  if (!examId || !token) {
    return NextResponse.json({ error: "Missing exam ID or token" }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.API}/questions?exam=${examId}`, {
      headers: {
        token,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch quiz data" }, { status: response.status });
    }

    const data = await response.json();

    if (data.message !== "success" || !data.questions) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 500 });
    }

    return NextResponse.json({ questions: data.questions });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}
