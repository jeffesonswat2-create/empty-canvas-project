import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle2, TrendingUp, XCircle } from "lucide-react";

export function Kpis() {
  const kpis = [
    {
      label: "Automações ativas",
      value: "23",
      icon: Activity,
      trend: "+3",
      trendUp: true,
    },
    {
      label: "Execuções hoje",
      value: "1.245",
      icon: TrendingUp,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Taxa de sucesso (7d)",
      value: "98%",
      icon: CheckCircle2,
      trend: "+2%",
      trendUp: true,
    },
    {
      label: "Falhas (7d)",
      value: "31",
      icon: XCircle,
      trend: "-5",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p
                  className={`text-xs ${
                    kpi.trendUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {kpi.trend}
                </p>
              </div>
              <kpi.icon className="w-8 h-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
