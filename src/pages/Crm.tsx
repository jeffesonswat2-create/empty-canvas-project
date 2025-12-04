import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Target, TrendingUp, Plus, Loader2, Search } from "lucide-react";
import { useClientes, useCreateCliente } from "@/hooks/useClientes";
import { useOportunidades, useEtapasFunil } from "@/hooks/useOportunidades";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Crm = () => {
  const { data: clientes, isLoading: loadingClientes } = useClientes();
  const { data: oportunidades, isLoading: loadingOportunidades } = useOportunidades();
  const { data: etapas } = useEtapasFunil();
  const createCliente = useCreateCliente();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
  });

  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCliente.mutateAsync(novoCliente);
      setIsDialogOpen(false);
      setNovoCliente({ nome: "", email: "", telefone: "", documento: "" });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const totalClientes = clientes?.length || 0;
  const clientesEsteMes = clientes?.filter(c => {
    const createdAt = new Date(c.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length || 0;
  
  const oportunidadesAbertas = oportunidades?.filter(o => o.status === 'andamento').length || 0;
  const taxaConversao = oportunidades && oportunidades.length > 0
    ? Math.round((oportunidades.filter(o => o.status === 'ganho').length / oportunidades.length) * 100)
    : 0;

  const clientesFiltrados = clientes?.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documento?.includes(searchTerm)
  ) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM</h1>
          <p className="text-muted-foreground mt-1">Gestão de relacionamento com clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCliente} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoCliente.email}
                  onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">CPF/CNPJ</Label>
                <Input
                  id="documento"
                  value={novoCliente.documento}
                  onChange={(e) => setNovoCliente({ ...novoCliente, documento: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createCliente.isPending}>
                {createCliente.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Cliente"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Total de Clientes</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {loadingClientes ? <Loader2 className="h-4 w-4 animate-spin" /> : totalClientes.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+{clientesEsteMes} este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Novos Clientes</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent" />
              {loadingClientes ? <Loader2 className="h-4 w-4 animate-spin" /> : clientesEsteMes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Oportunidades</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              {loadingOportunidades ? <Loader2 className="h-4 w-4 animate-spin" /> : oportunidadesAbertas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {loadingOportunidades ? <Loader2 className="h-4 w-4 animate-spin" /> : `${taxaConversao}%`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">Oportunidades ganhas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Lista de clientes cadastrados</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingClientes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
            </div>
          ) : (
            <div className="space-y-3">
              {clientesFiltrados.slice(0, 10).map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div>
                    <p className="text-sm font-medium">{cliente.nome}</p>
                    <p className="text-xs text-muted-foreground">{cliente.email || cliente.telefone || "Sem contato"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(cliente.created_at)}</span>
                </div>
              ))}
              {clientesFiltrados.length > 10 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Mostrando 10 de {clientesFiltrados.length} clientes
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {etapas && etapas.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Oportunidades por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {etapas.map((etapa) => {
                const oportunidadesEtapa = oportunidades?.filter(o => o.etapa_id === etapa.id) || [];
                const valorTotal = oportunidadesEtapa.reduce((acc, o) => acc + Number(o.valor_previsto || 0), 0);
                
                return (
                  <div 
                    key={etapa.id} 
                    className="min-w-[200px] p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: etapa.cor || '#3BA3FF' }}
                      />
                      <span className="font-medium text-sm">{etapa.nome}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
                        {oportunidadesEtapa.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Crm;
