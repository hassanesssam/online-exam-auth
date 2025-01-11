declare type Answer = {
    answer: string;
    key: string;
  };
  
declare type Question = {
    question: string;
    answers: Answer[];
    correct: string;
  };

 declare type QuizStartModalQuestionProps = {
    isOpen: boolean;
    onClose: () => void;
    examId: string;
  };

