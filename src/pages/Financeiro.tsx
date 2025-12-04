import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const Financeiro = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground mt-1">Gestão financeira completa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Saldo Atual</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-success">
              <Wallet className="h-5 w-5" />
              R$ 45.230,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Atualizado agora</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Receitas (Mês)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              R$ 78.500,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Despesas (Mês)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              R$ 33.270,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">-5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Lucro Líquido</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-success">
              <DollarSign className="h-5 w-5" />
              R$ 45.230,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">Margem: 57,6%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Contas a Receber</CardTitle>
            <CardDescription>Próximos recebimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { cliente: "Empresa ABC", valor: "R$ 5.200,00", venc: "10/12" },
                { cliente: "Loja XYZ", valor: "R$ 3.800,00", venc: "15/12" },
                { cliente: "Comércio 123", valor: "R$ 2.450,00", venc: "20/12" },
              ].map((conta, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{conta.cliente}</p>
                    <p className="text-xs text-muted-foreground">Venc: {conta.venc}</p>
                  </div>
                  <span className="text-sm font-medium text-success">{conta.valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Contas a Pagar</CardTitle>
            <CardDescription>Próximos pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { fornecedor: "Fornecedor A", valor: "R$ 8.500,00", venc: "12/12" },
                { fornecedor: "Aluguel", valor: "R$ 4.200,00", venc: "15/12" },
                { fornecedor: "Energia", valor: "R$ 1.850,00", venc: "18/12" },
              ].map((conta, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{conta.fornecedor}</p>
                    <p className="text-xs text-muted-foreground">Venc: {conta.venc}</p>
                  </div>
                  <span className="text-sm font-medium text-destructive">{conta.valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;
