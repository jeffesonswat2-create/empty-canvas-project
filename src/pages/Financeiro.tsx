import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Loader2 } from "lucide-react";
import { useLancamentos, useCreateLancamento, useContas, useCategorias, useResumoFinanceiro } from "@/hooks/useFinanceiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Financeiro = () => {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());
  
  const { data: lancamentos, isLoading: loadingLancamentos } = useLancamentos({ mes, ano });
  const { data: resumo, isLoading: loadingResumo } = useResumoFinanceiro(mes, ano);
  const { data: contas } = useContas();
  const { data: categorias } = useCategorias();
  const createLancamento = useCreateLancamento();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoLancamento, setNovoLancamento] = useState({
    descricao: "",
    valor: "",
    tipo: "receita" as "receita" | "despesa",
    categoria_id: "",
    conta_id: "",
    data_vencimento: "",
  });

  const handleCreateLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLancamento.mutateAsync({
        descricao: novoLancamento.descricao,
        valor: parseFloat(novoLancamento.valor),
        tipo: novoLancamento.tipo,
        categoria_id: novoLancamento.categoria_id || null,
        conta_id: novoLancamento.conta_id || null,
        data_vencimento: novoLancamento.data_vencimento || null,
        status: 'pendente',
      });
      setIsDialogOpen(false);
      setNovoLancamento({
        descricao: "",
        valor: "",
        tipo: "receita",
        categoria_id: "",
        conta_id: "",
        data_vencimento: "",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const contasAReceber = lancamentos?.filter(l => l.tipo === 'receita' && l.status === 'pendente') || [];
  const contasAPagar = lancamentos?.filter(l => l.tipo === 'despesa' && l.status === 'pendente') || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Gestão financeira completa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLancamento} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={novoLancamento.tipo}
                  onValueChange={(value: "receita" | "despesa") => 
                    setNovoLancamento({ ...novoLancamento, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={novoLancamento.descricao}
                  onChange={(e) => setNovoLancamento({ ...novoLancamento, descricao: e.target.value })}
                  placeholder="Descrição do lançamento"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={novoLancamento.valor}
                  onChange={(e) => setNovoLancamento({ ...novoLancamento, valor: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={novoLancamento.categoria_id}
                  onValueChange={(value) => setNovoLancamento({ ...novoLancamento, categoria_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias?.filter(c => c.tipo === novoLancamento.tipo).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Conta</Label>
                <Select
                  value={novoLancamento.conta_id}
                  onValueChange={(value) => setNovoLancamento({ ...novoLancamento, conta_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {contas?.map((conta) => (
                      <SelectItem key={conta.id} value={conta.id}>{conta.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={novoLancamento.data_vencimento}
                  onChange={(e) => setNovoLancamento({ ...novoLancamento, data_vencimento: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createLancamento.isPending}>
                {createLancamento.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Lançamento"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Saldo Realizado</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-success">
              <Wallet className="h-5 w-5" />
              {loadingResumo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatCurrency(resumo?.saldoRealizado || 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Pagos no mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Receitas (Mês)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              {loadingResumo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatCurrency(resumo?.receitas || 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">
              {formatCurrency(resumo?.receitasPagas || 0)} recebido
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Despesas (Mês)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              {loadingResumo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatCurrency(resumo?.despesas || 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(resumo?.despesasPagas || 0)} pago
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Saldo Previsto</CardDescription>
            <CardTitle className={`text-2xl flex items-center gap-2 ${(resumo?.saldo || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              <DollarSign className="h-5 w-5" />
              {loadingResumo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatCurrency(resumo?.saldo || 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Previsto para o mês</p>
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
            {loadingLancamentos ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : contasAReceber.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma conta a receber</p>
            ) : (
              <div className="space-y-4">
                {contasAReceber.slice(0, 5).map((lancamento) => (
                  <div key={lancamento.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{lancamento.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        Venc: {lancamento.data_vencimento 
                          ? format(new Date(lancamento.data_vencimento), "dd/MM", { locale: ptBR })
                          : "Sem data"}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(Number(lancamento.valor))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Contas a Pagar</CardTitle>
            <CardDescription>Próximos pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLancamentos ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : contasAPagar.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma conta a pagar</p>
            ) : (
              <div className="space-y-4">
                {contasAPagar.slice(0, 5).map((lancamento) => (
                  <div key={lancamento.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{lancamento.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        Venc: {lancamento.data_vencimento 
                          ? format(new Date(lancamento.data_vencimento), "dd/MM", { locale: ptBR })
                          : "Sem data"}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-destructive">
                      {formatCurrency(Number(lancamento.valor))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;
