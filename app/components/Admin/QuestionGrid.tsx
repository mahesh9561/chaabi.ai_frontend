import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useState } from "react";

type Question = {
  id: number;
  text: string;
};

// Loader function to fetch questions
export const loader: LoaderFunction = async () => {
  const response = await fetch("https://api.example.com/questions");
  const questions: Question[] = await response.json();
  return json(questions);
};

// Action function to handle saving grid
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const savedGrid = formData.get("grid");

  // Perform backend saving logic here (e.g., saving to a database)
  console.log("Saving grid:", savedGrid);

  return json({ success: true });
};

export default function QuestionGrid() {
  const questions = useLoaderData<Question[]>();
  const [grid, setGrid] = useState<string[]>([]);

  const handleSaveGrid = async () => {
    const response = await fetch("/path-to-route", {
      method: "POST",
      body: new URLSearchParams({ grid: JSON.stringify(grid) }),
    });

    if (response.ok) {
      alert("Grid saved successfully!");
    } else {
      alert("Error saving grid.");
    }
  };

  const handleAddComponent = (component: string) => {
    setGrid((prevGrid) => [...prevGrid, component]);
  };

  return (
    <div>
      <div className="components">
        <button onClick={() => handleAddComponent("Progress Bar")}>
          Progress Bar
        </button>
        <button onClick={() => handleAddComponent("Timer")}>Timer</button>
        <button onClick={() => handleAddComponent("Question Text")}>
          Question Text
        </button>
        <button onClick={() => handleAddComponent("Image")}>Image</button>
        <button onClick={() => handleAddComponent("Options")}>Options</button>
      </div>

      <div className="grid">
        {grid.map((component, index) => (
          <div key={index} className="grid-item">
            {component === "Question Text" && questions[index] && (
              <p>{questions[index].text}</p>
            )}
            {component}
          </div>
        ))}
      </div>

      <button onClick={handleSaveGrid}>Save Grid</button>
    </div>
  );
}
