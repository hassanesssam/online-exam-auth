'use client';

import React, { useState } from "react";
import QuizStartModalQuestion from "../modalQuestions/page";

type QuizStartModalProps = {
  quizTitle: string;
  quizDuration: number;
  quizId : string;
  isOpen: boolean;
  onClose: () => void;
};

const QuizStartModal: React.FC<QuizStartModalProps> = ({ isOpen, onClose, quizTitle, quizDuration ,quizId}) => {
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  console.log(`idd` , quizId);
  console.log(`issdd` , quizTitle);
  
  const handleStartQuiz = () => {
    setIsSecondModalOpen(true);
  };

  if (!isOpen && !isSecondModalOpen) return null;

  return (
    <>
      {/* First Modal */}
      {isOpen && !isSecondModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-[20px] shadow-lg w-[650px]">
            <div className="border-b mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{quizTitle}</h3>
              <p className="text-gray-600 mb-4">Duration: {quizDuration} minutes</p>
            </div>
            <div className="border-b mb-4 pb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Instructions</h2>
              <ul>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
              </ul>
            </div>
            <p className="mb-4">Do you want to start this quiz?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={handleStartQuiz} className="px-4 py-2 bg-blue-600 text-white rounded-md">Start Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal */}
      {isSecondModalOpen && (
        <QuizStartModalQuestion isOpen={isSecondModalOpen} onClose={()=> setIsSecondModalOpen(false)} examId={quizId}/>
      )}
    </>
  );
};

export default QuizStartModal;
