declare type Quiz = {
  _id: string;
  title: string;
  numberOfQuestions: number;
  duration: number;
};

declare type QuizCardProps = {
  quiz: Quiz;
};