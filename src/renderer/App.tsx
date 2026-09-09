import { Route, Routes, useParams } from "react-router";
import Home from "./pages/Home";
import TaskCreate from "./pages/task/TaskCreate";

const TaskCreateRoute = () => {
  const { status = "" } = useParams();
  return <TaskCreate status={status} />;
};

export const App = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/tasks/new/:status" element={<TaskCreateRoute />} />
    </Routes>
  );
};
