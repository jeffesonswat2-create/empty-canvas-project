import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MeuContrato = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Contrato</h1>
        <p className="text-muted-foreground mt-1">Informações do seu plano e contrato</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Plano Atual</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-primary/20 text-primary">Ativo</Badge>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Vencimento</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              15/01/2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">42 dias restantes</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Valor Mensal</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-success" />
              R$ 299,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Próximo débito: 05/01</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Em dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">Todas faturas pagas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recursos do Plano</CardTitle>
          <CardDescription>Funcionalidades incluídas no seu plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Emissão ilimitada de NF-e",
              "CRM completo",
              "Relatórios avançados",
              "Suporte prioritário",
              "Integrações com marketplaces",
              "Backup automático",
              "Multi-usuários (até 5)",
              "API de integração",
            ].map((recurso, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">{recurso}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeuContrato;
