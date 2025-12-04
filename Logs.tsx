import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ExternalLink, RefreshCw, Download, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface LogsProps {
  automacaoId: string | null;
}

interface LogExecution {
  id: string;
  automacaoNome: string;
  dataHora: string;
  duracao: string;
  disparador: string;
  status: "sucesso" | "falha";
  mensagem: string;
}

export function Logs({ automacaoId }: LogsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedLog, setSelectedLog] = useState<LogExecution | null>(null);

  const logs: LogExecution[] = [
    {
      id: "exec-001",
      automacaoNome: "Cobrança automática de boletos",
      dataHora: "2025-11-20 14:30:15",
      duracao: "2.3s",
      disparador: "boleto_em_aberto",
      status: "sucesso",
      mensagem: "E-mail enviado com sucesso para cliente@example.com",
    },
    {
      id: "exec-002",
      automacaoNome: "Follow-up pós-venda",
      dataHora: "2025-11-20 14:28:42",
      duracao: "1.8s",
      disparador: "pedido_entregue",
      status: "sucesso",
      mensagem: "E-mail de agradecimento enviado",
    },
    {
      id: "exec-003",
      automacaoNome: "Reprocessar rejeições fiscais",
      dataHora: "2025-11-20 14:25:10",
      duracao: "5.2s",
      disparador: "nfe_rejeitada",
      status: "falha",
      mensagem: "Erro ao comunicar com SEFAZ: timeout após 5s",
    },
    {
      id: "exec-004",
      automacaoNome: "Qualificar lead",
      dataHora: "2025-11-20 14:20:33",
      duracao: "1.5s",
      disparador: "lead_criado",
      status: "sucesso",
      mensagem: "Tarefa CRM criada e e-mail enviado",
    },
    {
      id: "exec-005",
      automacaoNome: "Alerta de expiração de consignação",
      dataHora: "2025-11-20 14:15:08",
      duracao: "3.1s",
      disparador: "agendamento_diario",
      status: "sucesso",
      mensagem: "5 alertas enviados para clientes com consignação próxima ao vencimento",
    },
    {
      id: "exec-006",
      automacaoNome: "Cobrança automática de boletos",
      dataHora: "2025-11-20 14:10:22",
      duracao: "0.8s",
      disparador: "boleto_em_aberto",
      status: "falha",
      mensagem: "E-mail inválido: cliente sem e-mail cadastrado",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.automacaoNome.toLowerCase().includes(search.toLowerCase()) ||
      log.disparador.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || log.status === statusFilter;
    const matchesAutomacao =
      !automacaoId || log.automacaoNome.includes(automacaoId);
    return matchesSearch && matchesStatus && matchesAutomacao;
  });

  const handleReexecute = (logId: string) => {
    toast.info("Reexecutando automação...");
    setTimeout(() => {
      toast.success("Automação reexecutada com sucesso");
    }, 2000);
  };

  const handleDownloadLog = (logId: string) => {
    toast.success("Log baixado com sucesso");
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por automação ou disparador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sucesso">Sucesso</SelectItem>
                <SelectItem value="falha">Falha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de logs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Execuções</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Automação</TableHead>
                <TableHead>Disparador</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.dataHora}
                  </TableCell>
                  <TableCell>{log.automacaoNome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.disparador}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.duracao}
                  </TableCell>
                  <TableCell>
                    {log.status === "sucesso" ? (
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Sucesso
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Falha
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedLog(log)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReexecute(log.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownloadLog(log.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma execução encontrada
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Execução</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID da execução</p>
                  <p className="font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data/Hora</p>
                  <p className="font-mono">{selectedLog.dataHora}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Automação</p>
                  <p>{selectedLog.automacaoNome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Disparador</p>
                  <Badge variant="outline">{selectedLog.disparador}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Duração</p>
                  <p className="font-mono">{selectedLog.duracao}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {selectedLog.status === "sucesso" ? (
                    <Badge
                      variant="default"
                      className="bg-green-500/10 text-green-500"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Sucesso
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-red-500/10 text-red-500"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Falha
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Mensagem</p>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm">{selectedLog.mensagem}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Input recebido
                </p>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(
                        {
                          cliente_id: "12345",
                          boleto_id: "BOL-2025-001",
                          valor: 1250.0,
                          vencimento: "2025-12-01",
                          dias_vencimento: 11,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReexecute(selectedLog.id)}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reexecutar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadLog(selectedLog.id)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar JSON
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
