import { Route, Routes, useParams } from "react-router";
import Home from "./pages/Home";
import TaskCreate from "./pages/task/TaskCreate";
import TaskUpdate from "./pages/task/TaskUpdate";

const TaskCreateRoute = () => {
  const { status = "" } = useParams();
  return <TaskCreate status={status} />;
};

const TaskUpdateRoute = () => {
  const { id = "" } = useParams();
  return <TaskUpdate id={Number(id)} />;
};

export const App = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/tasks/new/:status" element={<TaskCreateRoute />} />
      <Route path="/tasks/:id/edit" element={<TaskUpdateRoute />} />
    </Routes>
  );
};
