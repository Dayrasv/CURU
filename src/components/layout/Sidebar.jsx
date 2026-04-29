import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, School, FolderKanban, Users, 
  PlusCircle, Menu, X, Leaf, ChevronRight, Camera, Video, CircuitBoard
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Projetos", icon: FolderKanban, path: "/projetos" },
  //{ label: "Novo Projeto", icon: PlusCircle, path: "/projects/new" },
  { label: "Instituições", icon: School, path: "/instituicoes" },
  { label: "Turmas", icon: Users, path: "/turmas" },
  { label: "Tecnologias", icon: CircuitBoard, path: "/curu" },

];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // cambio del color de la hoja
  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">  
          <div className="w-10 h-10 rounded-xl bg-[#00548d] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">SISTA</h1>
            <p className="text-[11px] text-white/80 tracking-wide uppercase">Plataforma Educacional</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
              isActive(item.path) // en esta area se cambian los colores de seleccion y encima mouse menu lateral
                ? "bg-[#00548d] text-white shadow-lg"
                : "text-white/80 hover:bg-[#002f52] hover:text-white"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span className="flex-1">{item.label}</span>
            {isActive(item.path) && <ChevronRight className="w-4 h-4 opacity-60" />}
          </Link>
        ))}
      </nav>      
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-lg border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#003f6b] z-30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Menu lateral */}
      <aside className={cn(
         "fixed top-0 left-0 h-screen w-64 bg-[#002944] z-50 transform transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        <NavContent />
      </aside>
    </>
  );
}