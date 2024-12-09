import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import axios from "axios";

type Question = {
  _id: string;
  questions: string;
  img: string;
  options: string[];
  progess: string;
  answare: string;
  timmer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const QuestionsPage = () => {
  const location = useLocation();
  const { topic } = location.state || {};
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes for each question
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0); // Score tracking

  useEffect(() => {
    // Fetch 10 random questions from the API
    axios
      .get(`https://chabbi-ai-backend.onrender.com/api/blog/viewQuestion?topic=${topic}`) // Fetch 10 questions
      .then((response) => {
        setQuestions(response.data.data); // Set the fetched data into state
        console.log(response.data.data);
      })
      .catch((err) => {
        setError("Failed to fetch questions");
        console.error("Error fetching data:", err);
      });
  }, []);

  useEffect(() => {
    // Timer for each question (3 minutes for each question)
    const questionTimer = setInterval(() => {
      if (!quizFinished && timeRemaining > 0) {
        setTimeRemaining((prev) => prev - 1); // Decrease timer
      } else if (timeRemaining === 0) {
        handleAnswerSelection("");
      }
    }, 1000);

    return () => {
      clearInterval(questionTimer);
    };
  }, [timeRemaining, quizFinished]);

  const handleAnswerSelection = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer; // Save the selected answer for the current question
    setSelectedAnswers(updatedAnswers);

    // Check if the answer is correct and update the score
    if (answer === questions[currentQuestionIndex].answare) {
      setScore((prev) => prev + 1); // Add 1 point for a correct answer
    }

    // Move to the next question
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(180); // Reset timer for the next question
    } else {
      // Stop the quiz when all 10 questions are answered
      setQuizFinished(true);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!questions.length) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <nav className="w-full bg-slate-100 shadow-lg">
        <div className="px-10 py-3 lg:text-lg md:text-sm sm:text-xs flex justify-between flex-wrap">
          <div>Welcome to Quiz Test</div>
          <div className="flex justify-between gap-10">
            <div className="border rounded-full px-2 shadow">
              Time remaining: {Math.floor(timeRemaining / 60)}:
              {timeRemaining % 60}
            </div>
            <div>User</div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center flex-col py-6">
        <div className="w-full sm:w-3/4 lg:w-1/2 border border-gray-300 rounded-lg shadow-lg p-6">
          {/* Question Header */}
          <div className="text-xl font-semibold text-gray-800">
            <h1>Question {currentQuestionIndex + 1}</h1>
          </div>

          {/* Question Text */}
          <div className="mt-4">
            <h3 className="text-xl font-medium text-gray-800">
              {currentQuestion.questions}
            </h3>
          </div>

          {/* Image */}
          {currentQuestion.img && (
            <img
              src={currentQuestion.img}
              alt={currentQuestion.questions}
              className="w-full mt-4 rounded-lg"
            />
          )}

          {/* Options List */}
          <ul className="grid grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="flex justify-center">
                <button
                  onClick={() => handleAnswerSelection(option)}
                  className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-md text-left text-lg font-medium transition-all duration-300"
                  disabled={quizFinished} // Disable the options when quiz is finished
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          {/* Score and Show Answer Section */}
          <div className="flex flex-col items-center mt-8">
            <p className="text-lg font-semibold text-gray-700"></p>
          </div>
        </div>
      </div>

      {quizFinished && (
        <div className="text-center py-6">
          <h2 className="text-2xl font-semibold">Quiz Finished!</h2>
          <p className="mt-4">Your final score is: {score} / 10</p>
          <button
            onClick={() => navigate(`/quizApp?topic=${topic}`)} // Pass topic in the URL
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Proceed to Answare Page
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
