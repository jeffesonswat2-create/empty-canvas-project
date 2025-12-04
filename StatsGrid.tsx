import { DollarSign, Users, CheckSquare, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

const stats: Stat[] = [
  {
    label: "Total de Vendas",
    value: "R$ 124.500",
    change: "+12%",
    trend: "up",
    icon: <DollarSign className="h-6 w-6" />,
    color: "text-success",
  },
  {
    label: "Oportunidades Abertas",
    value: "23",
    change: "+5",
    trend: "up",
    icon: <Users className="h-6 w-6" />,
    color: "text-primary",
  },
  {
    label: "Tarefas Pendentes",
    value: "8",
    change: "-3",
    trend: "down",
    icon: <CheckSquare className="h-6 w-6" />,
    color: "text-warning",
  },
  {
    label: "Notas Fiscais Emitidas",
    value: "156",
    change: "+18",
    trend: "up",
    icon: <FileText className="h-6 w-6" />,
    color: "text-accent",
  },
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-card border-border shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
