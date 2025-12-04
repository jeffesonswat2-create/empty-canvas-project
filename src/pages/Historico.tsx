import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, FileText, DollarSign, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Historico = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
        <p className="text-muted-foreground mt-1">Histórico de vendas e operações</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Últimas Operações</CardTitle>
          <CardDescription>Histórico das últimas vendas e movimentações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { tipo: "venda", numero: "#1234", desc: "Venda para Cliente ABC", valor: "R$ 1.500,00", data: "Há 5 min" },
              { tipo: "nfe", numero: "#5678", desc: "NF-e emitida", valor: "R$ 1.500,00", data: "Há 10 min" },
              { tipo: "pagamento", numero: "#9012", desc: "Pagamento recebido", valor: "R$ 3.200,00", data: "Há 30 min" },
              { tipo: "venda", numero: "#1233", desc: "Venda para Cliente XYZ", valor: "R$ 890,00", data: "Há 1 hora" },
              { tipo: "estoque", numero: "#3456", desc: "Entrada de estoque", valor: "50 unidades", data: "Há 2 horas" },
            ].map((op, i) => {
              const icons = {
                venda: <Package className="h-5 w-5 text-primary" />,
                nfe: <FileText className="h-5 w-5 text-accent" />,
                pagamento: <DollarSign className="h-5 w-5 text-success" />,
                estoque: <History className="h-5 w-5 text-warning" />,
              };
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {icons[op.tipo as keyof typeof icons]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{op.desc}</p>
                      <p className="text-xs text-muted-foreground">{op.numero}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{op.valor}</p>
                    <p className="text-xs text-muted-foreground">{op.data}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Historico;
