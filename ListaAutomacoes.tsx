import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Upload,
  Download,
  MoreVertical,
  Edit,
  Copy,
  FileText,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Automacao {
  id: string;
  nome: string;
  descricao: string;
  status: "ativa" | "desativada";
  ultimaExecucao: string;
  totalExecucoes: number;
  taxaSucesso: number;
}

interface ListaAutomacoesProps {
  onCreate: () => void;
  onEdit: (id: string) => void;
  onViewLogs: (id: string) => void;
}

export function ListaAutomacoes({ onCreate, onEdit, onViewLogs }: ListaAutomacoesProps) {
  const [search, setSearch] = useState("");
  const [automacoes, setAutomacoes] = useState<Automacao[]>([
    {
      id: "auto-001",
      nome: "Cobrança automática de boletos",
      descricao: "Envia e-mail de lembrete 3, 7 e 14 dias antes do vencimento",
      status: "ativa",
      ultimaExecucao: "2025-11-20 14:30",
      totalExecucoes: 1245,
      taxaSucesso: 98.5,
    },
    {
      id: "auto-002",
      nome: "Follow-up pós-venda",
      descricao: "E-mail de agradecimento 7 dias após a compra",
      status: "ativa",
      ultimaExecucao: "2025-11-20 12:15",
      totalExecucoes: 892,
      taxaSucesso: 99.2,
    },
    {
      id: "auto-003",
      nome: "Reprocessar rejeições fiscais",
      descricao: "Tenta corrigir e reenviar NFe rejeitadas automaticamente",
      status: "desativada",
      ultimaExecucao: "2025-11-19 18:45",
      totalExecucoes: 567,
      taxaSucesso: 87.3,
    },
    {
      id: "auto-004",
      nome: "Qualificar lead",
      descricao: "Cria tarefa CRM e envia e-mail quando lead entra via formulário",
      status: "ativa",
      ultimaExecucao: "2025-11-20 15:00",
      totalExecucoes: 2341,
      taxaSucesso: 96.8,
    },
    {
      id: "auto-005",
      nome: "Alerta de expiração de consignação",
      descricao: "Notifica cliente 5 dias antes da data limite de retorno",
      status: "ativa",
      ultimaExecucao: "2025-11-20 09:00",
      totalExecucoes: 234,
      taxaSucesso: 100,
    },
  ]);

  const handleToggleStatus = (id: string) => {
    setAutomacoes((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? {
              ...auto,
              status: auto.status === "ativa" ? "desativada" : "ativa",
            }
          : auto
      )
    );
    toast.success("Status atualizado com sucesso");
  };

  const handleClone = (id: string) => {
    const auto = automacoes.find((a) => a.id === id);
    if (auto) {
      const novaAuto = {
        ...auto,
        id: `auto-${Date.now()}`,
        nome: `${auto.nome} (cópia)`,
      };
      setAutomacoes((prev) => [...prev, novaAuto]);
      toast.success("Automação clonada com sucesso");
    }
  };

  const handleDelete = (id: string) => {
    setAutomacoes((prev) => prev.filter((auto) => auto.id !== id));
    toast.success("Automação excluída com sucesso");
  };

  const handleImport = () => {
    toast.info("Funcionalidade de importação em desenvolvimento");
  };

  const handleExport = () => {
    toast.info("Funcionalidade de exportação em desenvolvimento");
  };

  const filteredAutomacoes = automacoes.filter(
    (auto) =>
      auto.nome.toLowerCase().includes(search.toLowerCase()) ||
      auto.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar automações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={onCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar automação
          </Button>
          <Button variant="outline" onClick={handleImport} className="gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Grid de automações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAutomacoes.map((auto) => (
          <Card key={auto.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{auto.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{auto.descricao}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(auto.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleClone(auto.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Clonar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewLogs(auto.id)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Ver logs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(auto.id)}>
                      {auto.status === "ativa" ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(auto.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={auto.status === "ativa" ? "default" : "secondary"}>
                  {auto.status === "ativa" ? "Ativa" : "Desativada"}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Taxa de sucesso: {auto.taxaSucesso}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Última execução</p>
                  <p className="font-medium">{auto.ultimaExecucao}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total execuções</p>
                  <p className="font-medium">{auto.totalExecucoes.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAutomacoes.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma automação encontrada. Crie sua primeira automação ou use um template.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
