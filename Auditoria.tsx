import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Shield, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditoriaItem {
  id: string;
  dataHora: Date;
  usuario: string;
  relatorio: string;
  acao: string;
  resultado: string;
}

const Auditoria = () => {
  const [logs, setLogs] = useState<AuditoriaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const mockLogs: AuditoriaItem[] = [
      {
        id: "1",
        dataHora: new Date("2025-11-13T15:20:00"),
        usuario: "Agnaldo Cardoso",
        relatorio: "Vendas por Período",
        acao: "Visualizou",
        resultado: "Sucesso"
      },
      {
        id: "2",
        dataHora: new Date("2025-11-13T14:45:00"),
        usuario: "Agnaldo Cardoso",
        relatorio: "Fluxo de Caixa",
        acao: "Exportou (PDF)",
        resultado: "Sucesso"
      },
      {
        id: "3",
        dataHora: new Date("2025-11-13T13:30:00"),
        usuario: "Maria Eduarda",
        relatorio: "Notas Fiscais",
        acao: "Agendou",
        resultado: "Sucesso"
      },
      {
        id: "4",
        dataHora: new Date("2025-11-13T11:15:00"),
        usuario: "Agnaldo Cardoso",
        relatorio: "Vendas por Cliente",
        acao: "Visualizou",
        resultado: "Sucesso"
      },
      {
        id: "5",
        dataHora: new Date("2025-11-13T10:00:00"),
        usuario: "João Silva",
        relatorio: "Consignação",
        acao: "Exportou (XLSX)",
        resultado: "Erro"
      },
      {
        id: "6",
        dataHora: new Date("2025-11-13T09:30:00"),
        usuario: "Maria Eduarda",
        relatorio: "Curva ABC",
        acao: "Visualizou",
        resultado: "Sucesso"
      },
      {
        id: "7",
        dataHora: new Date("2025-11-12T18:00:00"),
        usuario: "Agnaldo Cardoso",
        relatorio: "KPIs de Desempenho",
        acao: "Agendou",
        resultado: "Sucesso"
      },
      {
        id: "8",
        dataHora: new Date("2025-11-12T16:45:00"),
        usuario: "João Silva",
        relatorio: "Fluxo de Caixa",
        acao: "Exportou (CSV)",
        resultado: "Sucesso"
      }
    ];
    setLogs(mockLogs);
  };

  const filteredLogs = logs.filter(log =>
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.relatorio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.acao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Auditoria de Relatórios</CardTitle>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por usuário, relatório ou ação..."
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-card hover:bg-card">
                  <TableHead className="text-muted-foreground">Data/Hora</TableHead>
                  <TableHead className="text-muted-foreground">Usuário</TableHead>
                  <TableHead className="text-muted-foreground">Relatório</TableHead>
                  <TableHead className="text-muted-foreground">Ação</TableHead>
                  <TableHead className="text-muted-foreground">Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-card/50">
                      <TableCell className="text-foreground">
                        {format(log.dataHora, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{log.usuario}</TableCell>
                      <TableCell className="text-foreground">{log.relatorio}</TableCell>
                      <TableCell className="text-foreground">{log.acao}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.resultado === "Sucesso"
                            ? "bg-green-500/20 text-green-500"
                            : log.resultado === "Erro"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {log.resultado}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auditoria;
