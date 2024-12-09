import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { fetchQuizData, saveGridData } from "~/routes/api/api";
import Sidebar from "~/components/Admin/Sidebar";
import Grid from "~/components/Admin/Grid";

export const loader: LoaderFunction = async () => {
  const data = await fetchQuizData(); // Fetch existing grid or quiz data
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const gridData = formData.get("gridData");
  await saveGridData(gridData); // Save the grid data
  return null;
};

export default function Admin() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  const saveGridConfiguration = (gridState: any) => {
    fetcher.submit(
      { gridData: JSON.stringify(gridState) },
      { method: "post", action: "/admin" }
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Grid initialData={data} onSave={saveGridConfiguration} />
    </div>
  );
}
