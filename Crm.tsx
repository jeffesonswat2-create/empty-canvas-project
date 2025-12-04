import { useState } from "react";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FunnelChart } from "@/components/FunnelChart";

interface Opportunity {
  id: number;
  cliente: string;
  etapa: string;
  valor: string;
  responsavel: string;
  dataCriacao: string;
  status: string;
  observacoes?: string;
}

const Crm = () => {
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados com estado
  const stats = [
    {
      label: "Oportunidades Abertas",
      value: "23",
      icon: Briefcase,
      color: "#3BA3FF",
      bgColor: "rgba(59, 163, 255, 0.1)",
    },
    {
      label: "Oportunidades Concluídas",
      value: "8",
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Tarefas Pendentes",
      value: "5",
      icon: Clock,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Clientes Ativos",
      value: "156",
      icon: Users,
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
  ];

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      cliente: "Empresa ABC Ltda",
      etapa: "Negociação",
      valor: "R$ 45.000,00",
      responsavel: "João Silva",
      dataCriacao: "15/01/2024",
      status: "andamento",
      observacoes: "Cliente em processo de análise de proposta. Reunião agendada para próxima semana.",
    },
    {
      id: 2,
      cliente: "Tech Solutions SA",
      etapa: "Proposta",
      valor: "R$ 32.500,00",
      responsavel: "Maria Santos",
      dataCriacao: "18/01/2024",
      status: "andamento",
      observacoes: "Proposta enviada aguardando retorno do cliente.",
    },
    {
      id: 3,
      cliente: "Varejo Plus",
      etapa: "Fechado",
      valor: "R$ 28.000,00",
      responsavel: "Pedro Costa",
      dataCriacao: "10/01/2024",
      status: "ganho",
      observacoes: "Negócio fechado com sucesso. Contrato assinado.",
    },
  ]);

  const [editForm, setEditForm] = useState<Opportunity>({
    id: 0,
    cliente: "",
    etapa: "",
    valor: "",
    responsavel: "",
    dataCriacao: "",
    status: "",
    observacoes: "",
  });

  const tasks = [
    {
      id: 1,
      descricao: "Follow-up com Empresa ABC",
      cliente: "Empresa ABC Ltda",
      dataLimite: "22/01/2024",
      status: "pendente",
    },
    {
      id: 2,
      descricao: "Enviar proposta atualizada",
      cliente: "Tech Solutions SA",
      dataLimite: "20/01/2024",
      status: "pendente",
    },
    {
      id: 3,
      descricao: "Reunião de fechamento",
      cliente: "Varejo Plus",
      dataLimite: "19/01/2024",
      status: "concluida",
    },
  ];

  const clientes = [
    {
      id: 1,
      nome: "Empresa ABC Ltda",
      documento: "12.345.678/0001-90",
      email: "contato@empresaabc.com.br",
      telefone: "(11) 98765-4321",
      ultimoContato: "18/01/2024",
      oportunidades: 3,
    },
    {
      id: 2,
      nome: "Tech Solutions SA",
      documento: "98.765.432/0001-10",
      email: "vendas@techsolutions.com",
      telefone: "(11) 91234-5678",
      ultimoContato: "17/01/2024",
      oportunidades: 2,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; color: string }> = {
      andamento: { label: "Em Andamento", color: "#3BA3FF" },
      ganho: { label: "Ganho", color: "#10B981" },
      perdido: { label: "Perdido", color: "#EF4444" },
      pendente: { label: "Pendente", color: "#F59E0B" },
      concluida: { label: "Concluída", color: "#10B981" },
    };
    const variant = variants[status] || variants.andamento;
    return (
      <Badge style={{ backgroundColor: variant.color, color: "#FFFFFF" }}>
        {variant.label}
      </Badge>
    );
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setViewDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm({ ...opportunity });
    setEditDialogOpen(true);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.cliente || !editForm.valor || !editForm.etapa || !editForm.responsavel) {
      toast.error("❌ Preencha todos os campos obrigatórios");
      return;
    }

    setOpportunities(opportunities.map(opp => 
      opp.id === editForm.id ? editForm : opp
    ));
    
    setEditDialogOpen(false);
    toast.success("✅ Oportunidade atualizada com sucesso");
  };

  const confirmDelete = () => {
    if (selectedOpportunity) {
      setOpportunities(opportunities.filter(opp => opp.id !== selectedOpportunity.id));
      setDeleteDialogOpen(false);
      toast.success("✅ Oportunidade excluída com sucesso");
    }
  };

  const handleSaveOpportunity = () => {
    toast.success("✅ Oportunidade criada com sucesso");
    setOpportunityDialogOpen(false);
  };

  const handleSaveTask = () => {
    toast.success("✅ Tarefa criada com sucesso");
    setTaskDialogOpen(false);
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0F1115" }}>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#E7EEF6" }}>
          CRM — Relacionamento com Clientes
        </h1>
        <p style={{ color: "#8EA0B5" }}>
          Acompanhe oportunidades, clientes e tarefas em andamento
        </p>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border"
            style={{
              backgroundColor: "#151924",
              borderColor: "#20283A",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-2" style={{ color: "#8EA0B5" }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: "#E7EEF6" }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Funil */}
      <div className="mb-8">
        <FunnelChart />
      </div>

      {/* Oportunidades */}
      <Card
        className="mb-8 border"
        style={{
          backgroundColor: "#151924",
          borderColor: "#20283A",
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ color: "#E7EEF6" }}>Oportunidades</CardTitle>
              <CardDescription style={{ color: "#8EA0B5" }}>
                Gerencie suas oportunidades de venda
              </CardDescription>
            </div>
            <Button
              onClick={() => setOpportunityDialogOpen(true)}
              className="gap-2"
              style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
            >
              <Plus size={16} />
              Nova Oportunidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#8EA0B5" }}
              />
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 border"
              style={{
                backgroundColor: "#151924",
                borderColor: "#20283A",
                color: "#E7EEF6",
              }}
            >
              <Filter size={16} />
              Filtros
            </Button>
          </div>

          <div className="rounded-md border" style={{ borderColor: "#20283A" }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "#20283A" }}>
                  <TableHead style={{ color: "#8EA0B5" }}>Cliente</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Etapa</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Valor</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Responsável</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Data Criação</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Status</TableHead>
                  <TableHead style={{ color: "#8EA0B5" }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opp) => (
                  <TableRow key={opp.id} style={{ borderColor: "#20283A" }}>
                    <TableCell style={{ color: "#E7EEF6" }}>{opp.cliente}</TableCell>
                    <TableCell style={{ color: "#E7EEF6" }}>{opp.etapa}</TableCell>
                    <TableCell style={{ color: "#E7EEF6" }}>{opp.valor}</TableCell>
                    <TableCell style={{ color: "#E7EEF6" }}>{opp.responsavel}</TableCell>
                    <TableCell style={{ color: "#E7EEF6" }}>{opp.dataCriacao}</TableCell>
                    <TableCell>{getStatusBadge(opp.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOpportunity(opp)}
                          style={{ color: "#3BA3FF" }}
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOpportunity(opp)}
                          style={{ color: "#F59E0B" }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOpportunity(opp)}
                          style={{ color: "#EF4444" }}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Tarefas e Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarefas */}
        <Card
          className="border"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: "#E7EEF6" }}>Tarefas e Follow-ups</CardTitle>
                <CardDescription style={{ color: "#8EA0B5" }}>
                  Acompanhe suas tarefas
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setTaskDialogOpen(true)}
                className="gap-2"
                style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
              >
                <Plus size={14} />
                Nova Tarefa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium" style={{ color: "#E7EEF6" }}>
                      {task.descricao}
                    </h4>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#8EA0B5" }}>
                    Cliente: {task.cliente}
                  </p>
                  <p className="text-sm" style={{ color: "#8EA0B5" }}>
                    Prazo: {task.dataLimite}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card
          className="border"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#E7EEF6" }}>Clientes</CardTitle>
            <CardDescription style={{ color: "#8EA0B5" }}>
              Lista de clientes ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                  }}
                >
                  <h4 className="font-medium mb-2" style={{ color: "#E7EEF6" }}>
                    {cliente.nome}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p style={{ color: "#8EA0B5" }}>
                      CNPJ/CPF: {cliente.documento}
                    </p>
                    <p style={{ color: "#8EA0B5" }}>Email: {cliente.email}</p>
                    <p style={{ color: "#8EA0B5" }}>
                      Telefone: {cliente.telefone}
                    </p>
                    <p style={{ color: "#8EA0B5" }}>
                      Último contato: {cliente.ultimoContato}
                    </p>
                    <p style={{ color: "#3BA3FF" }}>
                      {cliente.oportunidades} oportunidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Visualizar Oportunidade */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent
          className="border max-w-2xl"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
            color: "#E7EEF6",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E7EEF6" }}>
              Detalhes da Oportunidade
            </DialogTitle>
            <DialogDescription style={{ color: "#8EA0B5" }}>
              Informações completas da oportunidade
            </DialogDescription>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Cliente
                  </Label>
                  <p className="text-base" style={{ color: "#E7EEF6" }}>
                    {selectedOpportunity.cliente}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Etapa
                  </Label>
                  <p className="text-base" style={{ color: "#E7EEF6" }}>
                    {selectedOpportunity.etapa}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Valor
                  </Label>
                  <p className="text-base font-bold" style={{ color: "#22C55E" }}>
                    {selectedOpportunity.valor}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Responsável
                  </Label>
                  <p className="text-base" style={{ color: "#E7EEF6" }}>
                    {selectedOpportunity.responsavel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Data de Criação
                  </Label>
                  <p className="text-base" style={{ color: "#E7EEF6" }}>
                    {selectedOpportunity.dataCriacao}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Status
                  </Label>
                  <div>{getStatusBadge(selectedOpportunity.status)}</div>
                </div>
              </div>

              {selectedOpportunity.observacoes && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: "#8EA0B5" }}>
                    Observações / Histórico
                  </Label>
                  <div
                    className="p-3 rounded-md border"
                    style={{
                      backgroundColor: "#0F1115",
                      borderColor: "#20283A",
                    }}
                  >
                    <p className="text-sm" style={{ color: "#E7EEF6" }}>
                      {selectedOpportunity.observacoes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewDialogOpen(false)}
              style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Oportunidade */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="border max-w-2xl"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
            color: "#E7EEF6",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E7EEF6" }}>
              Editar Oportunidade
            </DialogTitle>
            <DialogDescription style={{ color: "#8EA0B5" }}>
              Altere os dados da oportunidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Cliente *</Label>
              <Input
                value={editForm.cliente}
                onChange={(e) => setEditForm({ ...editForm, cliente: e.target.value })}
                placeholder="Nome do cliente"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#E7EEF6" }}>Valor Estimado *</Label>
                <Input
                  value={editForm.valor}
                  onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                  placeholder="R$ 0,00"
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                    color: "#E7EEF6",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#E7EEF6" }}>Etapa *</Label>
                <Select
                  value={editForm.etapa}
                  onValueChange={(value) => setEditForm({ ...editForm, etapa: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "#0F1115",
                      borderColor: "#20283A",
                      color: "#E7EEF6",
                    }}
                  >
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "#151924",
                      borderColor: "#20283A",
                    }}
                  >
                    <SelectItem value="Prospecção">Prospecção</SelectItem>
                    <SelectItem value="Contato">Contato Inicial</SelectItem>
                    <SelectItem value="Proposta">Proposta Enviada</SelectItem>
                    <SelectItem value="Negociação">Negociação</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#E7EEF6" }}>Responsável *</Label>
                <Input
                  value={editForm.responsavel}
                  onChange={(e) => setEditForm({ ...editForm, responsavel: e.target.value })}
                  placeholder="Nome do responsável"
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                    color: "#E7EEF6",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#E7EEF6" }}>Status *</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "#0F1115",
                      borderColor: "#20283A",
                      color: "#E7EEF6",
                    }}
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "#151924",
                      borderColor: "#20283A",
                    }}
                  >
                    <SelectItem value="andamento">Em Andamento</SelectItem>
                    <SelectItem value="ganho">Ganho</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Observações</Label>
              <Textarea
                value={editForm.observacoes || ""}
                onChange={(e) => setEditForm({ ...editForm, observacoes: e.target.value })}
                placeholder="Observações sobre a oportunidade"
                rows={4}
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              style={{
                backgroundColor: "#0F1115",
                borderColor: "#20283A",
                color: "#E7EEF6",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Excluir Oportunidade */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          className="border"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#E7EEF6" }}>
              Excluir oportunidade
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#8EA0B5" }}>
              Tem certeza que deseja excluir esta oportunidade?
              <br />
              <span style={{ color: "#EF4444" }}>
                Esta ação não poderá ser desfeita.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                backgroundColor: "#0F1115",
                borderColor: "#20283A",
                color: "#E7EEF6",
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              style={{
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Nova Oportunidade */}
      <Dialog open={opportunityDialogOpen} onOpenChange={setOpportunityDialogOpen}>
        <DialogContent
          className="border"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
            color: "#E7EEF6",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E7EEF6" }}>
              Nova Oportunidade
            </DialogTitle>
            <DialogDescription style={{ color: "#8EA0B5" }}>
              Preencha os dados da nova oportunidade de venda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Cliente</Label>
              <Input
                placeholder="Nome do cliente"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Valor Estimado</Label>
              <Input
                placeholder="R$ 0,00"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Etapa</Label>
              <Select>
                <SelectTrigger
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                    color: "#E7EEF6",
                  }}
                >
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "#151924",
                    borderColor: "#20283A",
                  }}
                >
                  <SelectItem value="prospeccao">Prospecção</SelectItem>
                  <SelectItem value="contato">Contato Inicial</SelectItem>
                  <SelectItem value="proposta">Proposta Enviada</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechado">Fechado (Ganho)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Responsável</Label>
              <Input
                placeholder="Nome do responsável"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Observações</Label>
              <Textarea
                placeholder="Observações sobre a oportunidade"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpportunityDialogOpen(false)}
              style={{
                backgroundColor: "#0F1115",
                borderColor: "#20283A",
                color: "#E7EEF6",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveOpportunity}
              style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nova Tarefa */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent
          className="border"
          style={{
            backgroundColor: "#151924",
            borderColor: "#20283A",
            color: "#E7EEF6",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#E7EEF6" }}>Nova Tarefa</DialogTitle>
            <DialogDescription style={{ color: "#8EA0B5" }}>
              Crie um lembrete ou follow-up
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Descrição</Label>
              <Input
                placeholder="Descrição da tarefa"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Cliente Vinculado</Label>
              <Select>
                <SelectTrigger
                  style={{
                    backgroundColor: "#0F1115",
                    borderColor: "#20283A",
                    color: "#E7EEF6",
                  }}
                >
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "#151924",
                    borderColor: "#20283A",
                  }}
                >
                  <SelectItem value="1">Empresa ABC Ltda</SelectItem>
                  <SelectItem value="2">Tech Solutions SA</SelectItem>
                  <SelectItem value="3">Varejo Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label style={{ color: "#E7EEF6" }}>Data Limite</Label>
              <Input
                type="date"
                style={{
                  backgroundColor: "#0F1115",
                  borderColor: "#20283A",
                  color: "#E7EEF6",
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTaskDialogOpen(false)}
              style={{
                backgroundColor: "#0F1115",
                borderColor: "#20283A",
                color: "#E7EEF6",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveTask}
              style={{ backgroundColor: "#3BA3FF", color: "#FFFFFF" }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crm;
