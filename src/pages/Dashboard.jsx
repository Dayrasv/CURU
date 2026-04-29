import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

import { FolderKanban, School, Users, GraduationCap, FlaskConical, CircuitBoard } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProjectsByAreaChart from "../components/dashboard/ProjectsByAreaChart";
import ProjectsByStatusChart from "../components/dashboard/ProjectsByStatusChart";
import InstitutionMap from "../components/dashboard/InstitutionMap";
import RecentProjects from "../components/dashboard/RecentProjects";

export default function Dashboard() {

  // 🔹 PROYECTOS
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Projects").select("*");
      if (error) throw error;
      return data;
    },
  });

  // 🔹 INSTITUCIONES
  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("CURU_Intitucoes").select("*");
      if (error) throw error;
      return data;
    },
  });

  // 🔹 PARTICIPACIONES
  const { data: participations = [] } = useQuery({
    queryKey: ["participations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Participations").select("*");
      if (error) throw error;
      return data;
    },
  });

  const totalStudents = participations.reduce(
    (sum, p) => sum + (p.students_involved || 0),
    0
  );

  const completedProjects = projects.filter(
    (p) => p.status === "concluido"
  ).length;

  const macroprojectProjects = projects.filter(
    (p) => p.uses_macroproject
  ).length;

  const avgStudents =
    projects.length > 0
      ? Math.round(totalStudents / projects.length)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Projetos" value={projects.length} icon={FolderKanban} />
        <StatCard title="Instituições" value={institutions.length} icon={School} />
        <StatCard title="Estudantes" value={totalStudents} icon={GraduationCap} />
        <StatCard title="Concluídos" value={completedProjects} icon={FlaskConical} />
        <StatCard title="Média E/P" value={avgStudents} icon={Users} />
        <StatCard title="Usam CURU" value={macroprojectProjects} icon={CircuitBoard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsByStatusChart projects={projects} />
        <ProjectsByAreaChart projects={projects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={projects} institutions={institutions} />
        <InstitutionMap institutions={institutions} />
      </div>
    </div>
  );
}
