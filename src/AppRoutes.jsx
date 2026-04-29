import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projects";
import Instituicoes from "./pages/Institutions";
import Turmas from "./pages/ClassGroups";
import Curu from "./pages/Curu";
import AppLayout from "./components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/instituicoes" element={<Instituicoes />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/curu" element={<Curu />} />
      </Route>
    </Routes>
  );
}