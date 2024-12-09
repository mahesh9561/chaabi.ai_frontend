import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@remix-run/react"; // Importing the navigate hook

// Define a TypeScript interface for the response
interface TopicResponse {
  topic: string;
}

interface QuestionResponse {
  question: string;
  answer: string;
  // Define any other fields for the question data
}

const TopicsList = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null); // State to hold selected topic
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]); // State to hold questions for the selected topic
  const [username, setUsername] = useState<string | null>(null); // State to hold username
  const navigate = useNavigate(); // Hook for navigating to another page

  // Function to decode the JWT token and extract the username
  const parseJwt = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    // Fetch topics from API
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          "https://chabbi-ai-backend.onrender.com/api/blog/viewTopics"
        );
        setTopics(response.data);
      } catch (err) {
        setError("Failed to fetch topics");
        console.error(err);
      }
    };

    // Fetch the username from JWT in localStorage
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = parseJwt(token);
      setUsername(decodedToken.username); // Extract and set username from decoded JWT
    }

    fetchTopics();
  }, []);

  // Function to handle topic click and fetch related questions
  const handleTopicClick = async (topic: string) => {
    setSelectedTopic(topic); // Set the selected topic in state
    try {
      const response = await axios.get(
        `https://chabbi-ai-backend.onrender.com/api/blog/viewQuestion?topic=${topic}`
      );
      setQuestions(response.data); // Set the questions data from the response

      // Navigate to the QuizResults page and pass selectedTopic as state
      navigate("/quizAns", { state: { topic } }); // Pass the selected topic as state
    } catch (err) {
      setError("Failed to fetch questions for this topic");
      console.error(err);
    }
  };
  return (
    <div>
      <nav className="w-full bg-slate-100 shadow-lg">
        <div className="px-10 py-3 lg:text-lg md:text-sm sm:text-xs flex justify-between flex-wrap">
          <div>Welcome to Quiz Test</div>
          <div className="flex justify-between gap-10">
            {username ? (
              <div>{username}</div> // Display the username if available
            ) : (
              <div>User</div>
            )}
          </div>
        </div>
      </nav>

      {error && <p>{error}</p>}

      <div className="mt-10 lg:mx-20 md:mx-10 sm:m-5">
        <h3>Please choose the topic</h3>
        <ul className="flex justify-around lg:text-lg md:text-sm sm:text-xs py-10 bg-white shadow-lg mt-5 flex-wrap gap-2">
          {topics.map((topic, index) => (
            <li
              key={index}
              className="bg-blue-100 px-5 py-2 rounded-full shadow-md hover:bg-blue-200 transition-colors duration-300 cursor-pointer"
              onClick={() => handleTopicClick(topic)} // Trigger topic selection on click
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {selectedTopic && (
        <div className="mt-10 text-center">
          <h4 className="text-lg">
            You have selected the topic: {selectedTopic}
          </h4>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg">Questions for {selectedTopic}:</h4>
          <ul className="mt-5 space-y-4">
            {questions.map((question, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="font-medium">{question.question}</p>
                <p className="text-sm text-gray-600">
                  Answer: {question.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicsList;
