export default function Sidebar() {
  const components = ["Question", "Options", "Progress Bar", "Timer", "Image"];

  return (
    <div className="w-1/6 p-4 bg-gray-800 text-white overflow-y-auto">
      <h2 className="text-lg font-bold">Components</h2>
      <ul>
        {components.map((component, idx) => (
          <li
            key={idx}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("component", component)}
            className="p-2 my-2 bg-gray-600 rounded cursor-pointer"
          >
            {component}
          </li>
        ))}
      </ul>
    </div>
  );
}
