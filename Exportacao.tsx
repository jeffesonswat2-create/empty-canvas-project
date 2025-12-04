import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Download, Send, FileText, Search } from "lucide-react";

interface Document {
  id: string;
  dataEmissao: string;
  numero: string;
  serie: string;
  modelo: "NFe" | "NFCe" | "NFSe";
  cliente: string;
  valor: number;
  situacao: "Autorizado" | "Cancelado" | "Denegado";
  exportado: boolean;
  ultimaExportacao?: string;
}

interface HistoricoExportacao {
  id: string;
  dataHora: string;
  usuario: string;
  periodoInicio: string;
  periodoFim: string;
  tipos: string;
  formato: string;
  quantidade: number;
  situacao: "Concluída" | "Com falhas";
  arquivo: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    dataEmissao: "15/01/2025",
    numero: "123456",
    serie: "1",
    modelo: "NFe",
    cliente: "João Silva Comércio LTDA",
    valor: 2500.00,
    situacao: "Autorizado",
    exportado: true,
    ultimaExportacao: "20/01/2025 14:30"
  },
  {
    id: "2",
    dataEmissao: "16/01/2025",
    numero: "123457",
    serie: "1",
    modelo: "NFCe",
    cliente: "Maria Santos",
    valor: 150.00,
    situacao: "Autorizado",
    exportado: false
  },
  {
    id: "3",
    dataEmissao: "17/01/2025",
    numero: "123458",
    serie: "1",
    modelo: "NFe",
    cliente: "Empresa ABC LTDA",
    valor: 5800.00,
    situacao: "Cancelado",
    exportado: false
  },
  {
    id: "4",
    dataEmissao: "18/01/2025",
    numero: "123459",
    serie: "2",
    modelo: "NFSe",
    cliente: "Serviços XYZ",
    valor: 1200.00,
    situacao: "Autorizado",
    exportado: true,
    ultimaExportacao: "19/01/2025 09:15"
  },
  {
    id: "5",
    dataEmissao: "19/01/2025",
    numero: "123460",
    serie: "1",
    modelo: "NFe",
    cliente: "Distribuidora DEF",
    valor: 8900.00,
    situacao: "Denegado",
    exportado: false
  }
];

const mockHistorico: HistoricoExportacao[] = [
  {
    id: "1",
    dataHora: "20/01/2025 14:30",
    usuario: "Admin",
    periodoInicio: "01/01/2025",
    periodoFim: "20/01/2025",
    tipos: "NFe, NFCe",
    formato: "XML",
    quantidade: 45,
    situacao: "Concluída",
    arquivo: "exportacao_jan_2025.zip"
  },
  {
    id: "2",
    dataHora: "15/01/2025 10:20",
    usuario: "Contador",
    periodoInicio: "01/12/2024",
    periodoFim: "31/12/2024",
    tipos: "Mistos",
    formato: "Excel",
    quantidade: 120,
    situacao: "Concluída",
    arquivo: "exportacao_dez_2024.xlsx"
  },
  {
    id: "3",
    dataHora: "10/01/2025 16:45",
    usuario: "Admin",
    periodoInicio: "01/01/2025",
    periodoFim: "10/01/2025",
    tipos: "NFe",
    formato: "TXT",
    quantidade: 28,
    situacao: "Com falhas",
    arquivo: "exportacao_parcial.txt"
  }
];

export default function Exportacao() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoricoExportacao | null>(null);
  const [formato, setFormato] = useState("XML");
  const [agrupamento, setAgrupamento] = useState("individual");
  const [emailContabilidade, setEmailContabilidade] = useState("");
  const [mensagem, setMensagem] = useState("Segue em anexo os arquivos fiscais do período solicitado para análise contábil.");

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDocs(mockDocuments.map(doc => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, docId]);
    } else {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
      setSelectAll(false);
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "Autorizado":
      case "Concluída":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Cancelado":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "Denegado":
      case "Com falhas":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Exportação de Documentos Fiscais</h1>
        <p className="text-muted-foreground">Gere e exporte arquivos XML, TXT e relatórios para sua contabilidade.</p>
      </div>

      {/* Bloco 1 - Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data inicial</Label>
              <Input type="date" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Data final</Label>
              <Input type="date" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de documento</Label>
              <Select defaultValue="todos">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="nfe">NFe – Nota Fiscal Eletrônica</SelectItem>
                  <SelectItem value="nfce">NFCe – Cupom Fiscal Eletrônico</SelectItem>
                  <SelectItem value="nfse">NFSe – Nota Fiscal de Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Situação</Label>
              <Select defaultValue="todos">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="autorizado">Autorizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="denegado">Denegado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Empresa / Filial</Label>
              <Select defaultValue="matriz">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matriz">LR Distribuidora de Livros e Revistas LTDA</SelectItem>
                  <SelectItem value="filial1">Filial São Paulo</SelectItem>
                  <SelectItem value="filial2">Filial Rio de Janeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exportado?</Label>
              <Select defaultValue="todos">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="nao">Não exportado</SelectItem>
                  <SelectItem value="sim">Exportado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Limpar filtros</Button>
            <Button>Aplicar filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Bloco 2 - Lista de documentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Documentos encontrados</CardTitle>
            <CardDescription className="mt-1.5">{mockDocuments.length} documentos encontrados</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <Label htmlFor="select-all" className="cursor-pointer">Selecionar todos</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Data emissão</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Cliente / Destinatário</TableHead>
                  <TableHead>Valor total</TableHead>
                  <TableHead>Situação SEFAZ</TableHead>
                  <TableHead>Exportado?</TableHead>
                  <TableHead>Última exportação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>{doc.dataEmissao}</TableCell>
                    <TableCell className="font-mono">{doc.numero}</TableCell>
                    <TableCell>{doc.serie}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.modelo}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{doc.cliente}</TableCell>
                    <TableCell className="font-mono">R$ {doc.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getSituacaoColor(doc.situacao)}>
                        {doc.situacao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.exportado ? "default" : "outline"}>
                        {doc.exportado ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {doc.ultimaExportacao || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Selecione os documentos para exportar.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Formato:</Label>
                <Select value={formato} onValueChange={setFormato}>
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XML">XML</SelectItem>
                    <SelectItem value="TXT">TXT</SelectItem>
                    <SelectItem value="CSV">Planilha CSV</SelectItem>
                    <SelectItem value="Excel">Planilha Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Agrupamento:</Label>
                <Select value={agrupamento} onValueChange={setAgrupamento}>
                  <SelectTrigger className="w-52 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Um arquivo por documento</SelectItem>
                    <SelectItem value="consolidado">Arquivo único consolidado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">Marcar como exportados</Button>
              <Button disabled={selectedDocs.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Exportar selecionados
              </Button>
              <Button variant="link" onClick={() => setSendModal(true)}>
                <Send className="mr-2 h-4 w-4" />
                Enviar para contabilidade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloco 3 - Histórico */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Histórico de exportações</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome do arquivo ou usuário..." 
              className="pl-8 bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Período exportado</TableHead>
                  <TableHead>Tipo de documentos</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Arquivo gerado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistorico.map((hist) => (
                  <TableRow key={hist.id}>
                    <TableCell className="font-mono">{hist.dataHora}</TableCell>
                    <TableCell>{hist.usuario}</TableCell>
                    <TableCell>{hist.periodoInicio} a {hist.periodoFim}</TableCell>
                    <TableCell>{hist.tipos}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{hist.formato}</Badge>
                    </TableCell>
                    <TableCell>{hist.quantidade}</TableCell>
                    <TableCell>
                      <Badge className={getSituacaoColor(hist.situacao)}>
                        {hist.situacao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Baixar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedHistory(hist);
                            setDetailsModal(true);
                          }}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Ver detalhes
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

      {/* Modal - Enviar para contabilidade */}
      <Dialog open={sendModal} onOpenChange={setSendModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar arquivos para contabilidade</DialogTitle>
            <DialogDescription>
              Configure o envio dos documentos exportados para o email da contabilidade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail da contabilidade</Label>
              <Input
                id="email"
                type="email"
                placeholder="contabilidade@exemplo.com"
                value={emailContabilidade}
                onChange={(e) => setEmailContabilidade(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="anexar" defaultChecked />
              <Label htmlFor="anexar" className="cursor-pointer">
                Anexar arquivos exportados automaticamente
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Modelo de mensagem</Label>
              <Select defaultValue="padrao">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="mensal">Resumo mensal</SelectItem>
                  <SelectItem value="semanal">Resumo semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setSendModal(false)}>
              <Send className="mr-2 h-4 w-4" />
              Enviar agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal - Detalhes do histórico */}
      <Dialog open={detailsModal} onOpenChange={setDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da exportação</DialogTitle>
          </DialogHeader>
          {selectedHistory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Período exportado</Label>
                  <p className="mt-1">{selectedHistory.periodoInicio} a {selectedHistory.periodoFim}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo de documentos</Label>
                  <p className="mt-1">{selectedHistory.tipos}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Formato</Label>
                  <p className="mt-1">{selectedHistory.formato}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantidade</Label>
                  <p className="mt-1">{selectedHistory.quantidade} documentos incluídos</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Lista resumida</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p>NFe: 123456, 123458, 123460...</p>
                  <p>NFCe: 123457, 123461, 123465...</p>
                  <p>NFSe: 123459, 123463...</p>
                </div>
              </div>
              {selectedHistory.situacao === "Com falhas" && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Logs de erros</Label>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-400">
                    <p>Nota 123460 – rejeitada pela SEFAZ na exportação anterior.</p>
                    <p>Nota 123462 – arquivo XML corrompido.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsModal(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
