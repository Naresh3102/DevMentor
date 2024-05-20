import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import CourseSection from "./components/CourseSection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CourseSection />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
