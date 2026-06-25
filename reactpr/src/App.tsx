import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ProfessorDashboard from "./components/ProfessorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import ManagerDashboard from "./components/ManagerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/professor" element={<ProfessorDashboard />} />

      <Route path="/student" element={<StudentDashboard />} />

      <Route path="/manager" element={<ManagerDashboard />} />
    </Routes>
  );
}

export default App;
