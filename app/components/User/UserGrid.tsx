import React, { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react"; // Import useLocation hook
import axios from "axios"; // Import axios for making API calls

// Define the structure of the response data
interface QuestionResponse {
  question: string;
  answer: string;
  img: string;
  options: string[];
  progress: string;
  timer: string;
}

const QuizResultss = () => {
    const location = useLocation();
    const { topic } = location.state || {}; // Get topic from location state

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (topic) {
      setLoading(true);
      setError(null);

      const fetchQuestions = async () => {
        try {
          console.log("Fetching questions for topic:", topic);
          const response = await axios.get(
            `https://chabbi-ai-backend.onrender.com/api/blog/viewQuestion?topic=${topic}`
          );
          console.log("Fetched data:", response.data); // Log the response data

          // Check if response.data contains valid questions
          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            // Map the response to match the structure of QuestionResponse
            const formattedQuestions = response.data.map((item: any) => ({
              question: item.questions,
              answer: item.answare,
              img: item.img,
              options: item.options,
              progress: item.progress,
              timer: item.timer,
            }));
            setQuestions(formattedQuestions); // Set the questions if valid
          } else {
            setError("No questions found for this topic");
          }
        } catch (err) {
          setError("Failed to fetch questions");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [topic]); // Re-fetch when topic changes

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <div>
              <p><strong>Question:</strong> {question.question}</p>
              <p><strong>Answer:</strong> {question.answer}</p>
              {question.img && <img src={question.img} alt="Question" width="200" />}
              <p><strong>Options:</strong></p>
              <ul>
                {question.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <p><strong>Progress:</strong> {question.progress}</p>
              <p><strong>Timer:</strong> {question.timer} seconds</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResultss;
