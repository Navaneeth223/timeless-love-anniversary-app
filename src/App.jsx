import { Routes, Route, Navigate } from "react-router-dom";
import Creator from "./pages/Creator";
import Anniversary from "./pages/Anniversary";

export default function App() {
  return (
    <div className="min-h-screen bg-aurora-soft text-slate-900">
      <Routes>
        <Route path="/" element={<Creator />} />
        <Route path="/anniversary" element={<Anniversary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
