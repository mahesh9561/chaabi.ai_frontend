import React, { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import axios from "axios";

type Question = {
  _id: string;
  questions: string;
  img: string;
  options: string[];
  progress: string;
  answare: string;
  timer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const QuizAppPage = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!topic) {
      setError("No topic provided");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://chabbi-ai-backend.onrender.com/api/blog/viewQuestion?topic=${topic}`
        );
        setQuestions(response.data.data);
        // console.log(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch questions. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found for this topic.</div>;
  }

  return (
    <div>
      <nav className="w-full bg-slate-100 shadow-lg">
        <div className="px-10 py-3 lg:text-lg md:text-sm sm:text-xs flex justify-between flex-wrap">
          <div>Welcome to Quiz Test</div>
          <div className="flex justify-between gap-10">
            <div>User</div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center flex-col py-6">
        <div className="w-full sm:w-3/4 lg:w-1/2 border border-gray-300 rounded-lg shadow-lg p-6 lg:text-lg md:text-sm sm:text-xs">
          <h1 className="text-2xl font-bold mb-4">
            Quiz Questions for Topic: {topic}
          </h1>
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question._id} className="p-4 border rounded shadow">
                <h3 className="font-semibold">{question.questions}</h3>
                <h4>{question.answare}</h4>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizAppPage;
