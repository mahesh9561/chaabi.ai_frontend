export const fetchQuizData = async () => {
  // Mock data example
  return [
    { component: "Progress Bar", x: 50, y: 100 },
    { component: "Timer", x: 150, y: 200 },
  ];
};

export const saveGridData = async (gridData: any) => {
  console.log("Saving grid data:", gridData);
  return { success: true };
};
