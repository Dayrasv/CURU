import React from "react";
import { cn } from "../../lib/utils";

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }) {
  // cores das card (cuadrados) com dados
  const colorMap = {
    primary: "from-primary/10 to-primary/5 text-primary",
    accent: "from-accent/10 to-accent/5 text-accent-foreground",
    chart3: "from-blue-500/10 to-blue-500/5 text-blue-600",
    chart4: "from-rose-500/10 to-rose-500/5 text-rose-600",
    chart5: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
  };

  // cores dos icones
  const iconBg = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    chart3: "bg-blue-500/15 text-blue-600",
    chart4: "bg-rose-500/15 text-rose-600",
    chart5: "bg-emerald-500/15 text-emerald-600",
  };

  return (
  <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 border border-border/50",
    colorMap[color]
  )}>
    
    <div className="relative">

      {/* Configuracoes do icone */}
      <div className={cn(
        "absolute top-0 right-5 p-3 rounded-xl flex items-center justify-center",
        iconBg[color]
      )}>
        <Icon className="w-4 h-4" />
      </div>

      {/*  */}
      <div className="pr-12 pt-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 whitespace-nowrap">
          {title}
        </p>

        <p className="text-2xl font-bold text-foreground">
          {value}
        </p>

        {trend && (
          <p className="text-xs font-medium mt-1 text-muted-foreground">
            {trend}
          </p>
        )}
     </div>

    


    </div>
  </div>
);

}