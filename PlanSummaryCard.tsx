import { Crown, Check, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanSummaryCardProps {
  planName?: string;
  planStatus?: "active" | "expired";
  features?: string[];
}

const PlanSummaryCard = ({
  planName = "Profissional",
  planStatus = "active",
  features = [
    "Acesso completo ao CRM",
    "Emissão ilimitada de notas fiscais",
    "Suporte prioritário 24/7",
    "Automações avançadas",
  ],
}: PlanSummaryCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-card to-secondary border-border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Plano {planName}</CardTitle>
            <Badge
              variant={planStatus === "active" ? "default" : "destructive"}
              className="mt-1"
            >
              {planStatus === "active" ? "Ativo" : "Expirado"}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <ArrowUpCircle className="h-4 w-4" />
          Atualizar Plano
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlanSummaryCard;
