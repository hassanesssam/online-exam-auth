import { getServerSession } from 'next-auth';
import axios from 'axios';
import QuizCard from '@/components/quizCard/page';
import { options } from '@/app/api/auth/[...nextauth]/route';


type PageProps = {
  params: {
    examsId: string;
  };
};

const fetchExam = async (examsId: string, token: string | undefined) => {
  try {
    const res = await axios.get(`https://exam.elevateegy.com/api/v1/exams?subject=${examsId}`, {
      headers: { token },
    });
    return res.data.exams; 
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
};

export default async function QuizList({ params: { examsId } }: PageProps) {
  const session = await getServerSession(options);
  const token = session?.token;
    
  const quizzes = await fetchExam(examsId, token);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full mx-auto rounded-lg">
        <h2 className="text-[18px] font-medium text-[#0F0F0F] mb-6">Front-End Quiz</h2>
        <div className="space-y-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz: any) => (
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
