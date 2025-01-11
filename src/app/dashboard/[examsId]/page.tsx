import QuizCard from '@/components/quizCard/page';
import { cookies } from 'next/headers';


type PageProps = {
  params: {
    examsId: string;
  };
};

const fetchExam = async (examsId: string, token: string | undefined) => {
  try {
    const response = await fetch(`${process.env.API}/exams?subject=${examsId}`, {
      method: 'GET',
      headers: {
        token: token || '',
      },
    });

    if (!response.ok) {
      console.error(`Error fetching exams: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.exams;
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
};


export default async function QuizList({ params: { examsId } }: PageProps) {
  // const session = await getServerSession(options);
  // const token = session?.token;

      const cookieStore = await cookies();
      console.log('Cookies:', cookieStore);
      const tokenCookie = cookieStore.get('Online_Exam_token')?.value;
      console.log('Token Cookie:', tokenCookie);
  
      const token = tokenCookie;
    
  const quizzes = await fetchExam(examsId, token);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full mx-auto rounded-lg">
        <h2 className="text-[18px] font-medium text-[#0F0F0F] mb-6">Front-End Quiz</h2>
        <div className="space-y-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz :examData ) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))
          ) : (
            <p className="text-center text-gray-500">No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
