import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Play, Pause, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Automacoes = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Automações</h1>
        <p className="text-muted-foreground mt-1">Automatize tarefas repetitivas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Automações Ativas</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-success">
              <Play className="h-5 w-5" />
              8
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Pausadas</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-warning">
              <Pause className="h-5 w-5" />
              2
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Execuções (Hoje)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              156
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Suas Automações</CardTitle>
          <CardDescription>Gerencie suas automações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { nome: "Envio de NF-e automático", desc: "Envia NF-e após venda", ativo: true },
              { nome: "Cobrança automática", desc: "Envia cobrança 3 dias antes do venc.", ativo: true },
              { nome: "Atualização de estoque", desc: "Sincroniza estoque com marketplace", ativo: true },
              { nome: "Relatório diário", desc: "Envia relatório por e-mail às 18h", ativo: false },
              { nome: "Backup automático", desc: "Backup dos dados às 02h", ativo: true },
            ].map((auto, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${auto.ativo ? 'bg-success/20' : 'bg-muted'}`}>
                    <Zap className={`h-5 w-5 ${auto.ativo ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{auto.nome}</p>
                    <p className="text-xs text-muted-foreground">{auto.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={auto.ativo ? "default" : "secondary"} className={auto.ativo ? "bg-success/20 text-success" : ""}>
                    {auto.ativo ? "Ativo" : "Pausado"}
                  </Badge>
                  <Switch checked={auto.ativo} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Automacoes;
