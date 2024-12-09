import { useState } from "react";

type GridItem = {
  id: string;
  component: string;
  x: number;
  y: number;
  data?: any;
};

export default function Grid({
  initialData,
  onSave,
}: {
  initialData: GridItem[];
  onSave: (data: GridItem[]) => void;
}) {
  const [gridItems, setGridItems] = useState<GridItem[]>(initialData || []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const component = e.dataTransfer.getData("component");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(x, y);
    setGridItems((prev) => [
      ...prev,
      { id: Date.now().toString(), component, x, y, data: getDefaultData(component) },
    ]);
  };

  const getDefaultData = (component: string) => {
    switch (component) {
      case "Question":
        return { question: "" };
      case "Options":
        return { options: [] };
      case "Timer":
        return { time: 300 }; // Default 5 minutes in seconds
      case "Image":
        return { file: null, preview: null };
      case "Progress Bar":
        return { progress: 0 };
      default:
        return {};
    }
  };

  const updateGridItem = (id: string, newData: any) => {
    setGridItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, data: newData } : item))
    );
  };

  const handleSaveGrid = async () => {
    try {
      // Prepare the data to send
      const gridData = gridItems.map((item) => {
        switch (item.component) {
          case "Question":
            return { question: item.data?.question };
          case "Options":
            return { options: item.data?.options };
          case "Timer":
            return { timer: item.data?.time };
          case "Image":
            return { image: item.data?.file };
          case "Progress Bar":
            return { progress: item.data?.progress };
          default:
            return {};
        }
      });

      // Make the POST request to the API
      const response = await fetch("https://chabbi-ai-backend.onrender.com/api/blog/addQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: gridData }), // Sending the data as JSON
      });

  
      const result = await response.json();
      console.log("Grid saved successfully:", result);

      // Call onSave callback
      onSave(gridItems);
    } catch (error) {
      console.error("Error saving grid:", error);
    }
  };

  return (
    <div
      className="relative flex-1 bg-gray-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {gridItems.map((item) => (
        <div
          key={item.id}
          className="absolute bg-white border p-4 rounded shadow"
          style={{ top: item.y, left: item.x }}
        >
          {item.component === "Question" && (
            <div>
              <label className="block font-bold">Question:</label>
              <input
                type="text"
                placeholder="Enter Question"
                value={item.data?.question || ""}
                onChange={(e) =>
                  updateGridItem(item.id, { ...item.data, question: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
          )}

          {item.component === "Options" && (
            <div>
              <label className="block font-bold">Options:</label>
              {item.data?.options.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateGridItem(item.id, {
                        ...item.data,
                        options: item.data.options.map((o: string, i: number) =>
                          i === idx ? e.target.value : o
                        ),
                      })
                    }
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() =>
                      updateGridItem(item.id, {
                        ...item.data,
                        options: item.data.options.filter((_, i) => i !== idx),
                      })
                    }
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateGridItem(item.id, {
                    ...item.data,
                    options: [...(item.data.options || []), ""],
                  })
                }
                className="mt-2 bg-blue-500 text-white p-2 rounded"
              >
                Add Option
              </button>
            </div>
          )}

          {item.component === "Timer" && (
            <div>
              <label className="block font-bold">Timer (seconds):</label>
              <input
                type="number"
                value={item.data?.time || 0}
                onChange={(e) =>
                  updateGridItem(item.id, { ...item.data, time: parseInt(e.target.value) })
                }
                className="border p-2 rounded w-full"
              />
            </div>
          )}

          {item.component === "Image" && (
            <div>
              <label className="block font-bold">Upload Image:</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const preview = file ? URL.createObjectURL(file) : null;
                  updateGridItem(item.id, { ...item.data, file, preview });
                }}
                className="mt-2"
              />
              {item.data?.preview && (
                <img
                  src={item.data.preview}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover"
                />
              )}
            </div>
          )}

          {item.component === "Progress Bar" && (
            <div>
              <label className="block font-bold">Progress:</label>
              <progress
                value={item.data?.progress || 0}
                max={100}
                className="w-full"
              ></progress>
              <button
                onClick={() =>
                  updateGridItem(item.id, {
                    ...item.data,
                    progress: Math.min(100, (item.data.progress || 0) + 10),
                  })
                }
                className="mt-2 bg-green-500 text-white p-2 rounded"
              >
                Increment Progress
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleSaveGrid} // Call the handleSaveGrid function when clicked
      >
        Save Grid
      </button>
    </div>
  );
}
