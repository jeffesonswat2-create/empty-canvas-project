import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Fiscal = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fiscal</h1>
        <p className="text-muted-foreground mt-1">Gestão de notas fiscais e documentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>NF-e Emitidas (Mês)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              247
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+18% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Autorizadas</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              243
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">98,4% de sucesso</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Em Processamento</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-warning">
              <Clock className="h-5 w-5" />
              3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Aguardando SEFAZ</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Rejeitadas</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-destructive">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Últimas Notas Fiscais</CardTitle>
          <CardDescription>Notas emitidas recentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { numero: "NF-e 001234", cliente: "Cliente ABC", valor: "R$ 1.500,00", status: "Autorizada" },
              { numero: "NF-e 001233", cliente: "Cliente XYZ", valor: "R$ 3.200,00", status: "Autorizada" },
              { numero: "NF-e 001232", cliente: "Cliente 123", valor: "R$ 890,00", status: "Processando" },
              { numero: "NF-e 001231", cliente: "Cliente DEF", valor: "R$ 2.100,00", status: "Autorizada" },
            ].map((nota, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{nota.numero}</p>
                    <p className="text-xs text-muted-foreground">{nota.cliente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{nota.valor}</span>
                  <Badge 
                    variant={nota.status === "Autorizada" ? "default" : "secondary"}
                    className={nota.status === "Autorizada" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}
                  >
                    {nota.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fiscal;
