import { CheckCircle, AlertCircle, XCircle, Shield, Webhook, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Integration {
  name: string;
  status: "active" | "warning" | "error";
  description: string;
  icon: React.ReactNode;
}

const integrations: Integration[] = [
  {
    name: "API Conectada",
    status: "active",
    description: "Funcionando corretamente",
    icon: <Key className="h-5 w-5" />,
  },
  {
    name: "Webhooks",
    status: "active",
    description: "3 webhooks ativos",
    icon: <Webhook className="h-5 w-5" />,
  },
  {
    name: "Certificado Digital",
    status: "warning",
    description: "Expira em 30 dias",
    icon: <Shield className="h-5 w-5" />,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-success";
    case "warning":
      return "text-warning";
    case "error":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    case "error":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
    case "warning":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Atenção</Badge>;
    case "error":
      return <Badge variant="destructive">Erro</Badge>;
    default:
      return null;
  }
};

const IntegrationStatus = () => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Integrações Ativas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-card flex items-center justify-center ${getStatusColor(integration.status)}`}>
                  {integration.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {integration.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(integration.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationStatus;
