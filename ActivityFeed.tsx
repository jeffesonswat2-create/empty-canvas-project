import { FileText, UserPlus, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: number;
  type: "nfe" | "opportunity" | "payment" | "other";
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "nfe",
    description: "Emitiu NFe #1023",
    time: "Há 2 horas",
  },
  {
    id: 2,
    type: "opportunity",
    description: "Nova oportunidade criada: Venda de Livros",
    time: "Há 5 horas",
  },
  {
    id: 3,
    type: "payment",
    description: "Pagamento recebido: R$ 2.500,00",
    time: "Há 1 dia",
  },
  {
    id: 4,
    type: "nfe",
    description: "Emitiu NFe #1022",
    time: "Há 2 dias",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "nfe":
      return <FileText className="h-5 w-5 text-primary" />;
    case "opportunity":
      return <UserPlus className="h-5 w-5 text-accent" />;
    case "payment":
      return <DollarSign className="h-5 w-5 text-success" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

const ActivityFeed = () => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
