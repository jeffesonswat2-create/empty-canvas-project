import { useState } from "react";
import {
  Check,
  Clock,
  X,
  Search,
  Filter,
  Download,
  MoreVertical,
  FileText,
  Printer,
  Mail,
  Copy,
  MessageCircle,
  Ban,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mockDocuments = [
  {
    id: "1",
    tipo: "NF-e",
    chave: "35250512345678000190550010000000011234567890",
    numero: "000001",
    serie: "001",
    modelo: "55",
    operacao: "Venda",
    pedido: "PED-2024-001",
    status: "Autorizado",
    dataEmissao: "24/10/2025 10:30",
    dataPedido: "24/10/2025 09:15",
    finalidade: "Venda",
    valorTotal: "R$ 1.250,00",
    frete: "R$ 25,00",
    cliente: "João Silva & Cia Ltda",
    vendedor: "Carlos Santos",
  },
  {
    id: "2",
    tipo: "NFC-e",
    chave: "35250512345678000190650010000000021234567891",
    numero: "000002",
    serie: "001",
    modelo: "65",
    operacao: "Venda",
    pedido: "PED-2024-002",
    status: "Pendente",
    dataEmissao: "24/10/2025 11:45",
    dataPedido: "24/10/2025 11:00",
    finalidade: "Venda",
    valorTotal: "R$ 850,00",
    frete: "R$ 0,00",
    cliente: "Maria Oliveira",
    vendedor: "Ana Costa",
  },
  {
    id: "3",
    tipo: "NF-e",
    chave: "35250512345678000190550010000000031234567892",
    numero: "000003",
    serie: "001",
    modelo: "55",
    operacao: "Devolução",
    pedido: "DEV-2024-001",
    status: "Cancelado",
    dataEmissao: "23/10/2025 14:20",
    dataCancelamento: "23/10/2025 16:00",
    finalidade: "Devolução",
    valorTotal: "R$ 450,00",
    frete: "R$ 0,00",
    cliente: "Pedro Almeida",
    vendedor: "Carlos Santos",
  },
];

const Historico = () => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Calculate totals
  const totals = {
    autorizadas: mockDocuments
      .filter((d) => d.status === "Autorizado")
      .reduce((sum, d) => sum + parseFloat(d.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 0),
    pendentes: mockDocuments
      .filter((d) => d.status === "Pendente")
      .reduce((sum, d) => sum + parseFloat(d.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 0),
    canceladas: mockDocuments
      .filter((d) => d.status === "Cancelado")
      .reduce((sum, d) => sum + parseFloat(d.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 0),
  };

  const filteredDocuments = mockDocuments.filter((doc) => {
    if (selectedStatus && doc.status !== selectedStatus) return false;
    if (searchTerm && !JSON.stringify(doc).toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  const handleAction = (action: string, docId: string) => {
    toast({
      title: "Ação executada",
      description: `${action} para documento ${docId}`,
    });
  };

  const handleRowClick = (doc: typeof mockDocuments[0]) => {
    setSelectedDoc(doc);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      Autorizado: { bg: "bg-green-500/20", text: "text-green-400" },
      Pendente: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      Cancelado: { bg: "bg-red-500/20", text: "text-red-400" },
    };
    const variant = variants[status] || { bg: "bg-muted", text: "text-muted-foreground" };
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0`}>
        {status}
      </Badge>
    );
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredDocuments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDocuments.map((doc) => doc.id));
    }
  };

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: '#0F1115' }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#E7EEF6]">Histórico Unificado</h1>
          <p className="text-[#E7EEF6]/60 mt-1">
            Gerencie todos os documentos fiscais em um só lugar
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedStatus(selectedStatus === "Autorizado" ? null : "Autorizado")}
            className={`p-4 rounded-lg border transition-all ${
              selectedStatus === "Autorizado"
                ? "border-[#3BA3FF] bg-[#3BA3FF]/10"
                : "border-[#20283A] bg-[#151924] hover:border-[#3BA3FF]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-[#E7EEF6]/60">Vendas autorizadas</p>
                <p className="text-2xl font-bold text-[#E7EEF6]">
                  R$ {totals.autorizadas.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === "Pendente" ? null : "Pendente")}
            className={`p-4 rounded-lg border transition-all ${
              selectedStatus === "Pendente"
                ? "border-[#FF8A00] bg-[#FF8A00]/10"
                : "border-[#20283A] bg-[#151924] hover:border-[#FF8A00]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-[#E7EEF6]/60">Pendentes de autorização</p>
                <p className="text-2xl font-bold text-[#E7EEF6]">
                  R$ {totals.pendentes.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === "Cancelado" ? null : "Cancelado")}
            className={`p-4 rounded-lg border transition-all ${
              selectedStatus === "Cancelado"
                ? "border-red-500 bg-red-500/10"
                : "border-[#20283A] bg-[#151924] hover:border-red-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-[#E7EEF6]/60">Canceladas</p>
                <p className="text-2xl font-bold text-[#E7EEF6]">
                  R$ {totals.canceladas.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[#E7EEF6]/60">Período</label>
              <Select defaultValue="30dias">
                <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#E7EEF6]/60">Tipo</label>
              <Select>
                <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="devolucoes">Devoluções</SelectItem>
                  <SelectItem value="trocas">Trocas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#E7EEF6]/60">Documento</label>
              <Select>
                <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfe">NF-e</SelectItem>
                  <SelectItem value="nfce">NFC-e</SelectItem>
                  <SelectItem value="nfse">NFS-e</SelectItem>
                  <SelectItem value="pedido">Pedido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#E7EEF6]/60">Status</label>
              <Select>
                <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autorizado">Autorizado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="processamento">Em processamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E7EEF6]/40" />
                <Input
                  placeholder="Buscar por chave, número, cliente, produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0F1115] border-[#20283A] text-[#E7EEF6] placeholder:text-[#E7EEF6]/40"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10 hover:border-[#3BA3FF]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Aplicar
            </Button>
            <Button
              variant="outline"
              className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10 hover:border-[#3BA3FF]"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus(null);
              }}
            >
              Limpar
            </Button>
            <Button className="bg-[#3BA3FF] hover:bg-[#3BA3FF]/90 text-white">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="documentos" className="w-full">
          <TabsList className="bg-[#151924] border border-[#20283A]">
            <TabsTrigger value="documentos" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
              Documentos
            </TabsTrigger>
            <TabsTrigger value="produtos" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="clientes" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
              Clientes/Fornecedores
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documentos" className="mt-4">
            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-[#3BA3FF]/10 border border-[#3BA3FF]/30 flex items-center gap-3">
                <span className="text-sm text-[#E7EEF6]">
                  {selectedRows.length} documento(s) selecionado(s)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                >
                  <Printer className="h-3 w-3 mr-1" />
                  Imprimir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Exportar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Ban className="h-3 w-3 mr-1" />
                  Cancelar
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-[#20283A] bg-[#151924] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#20283A] hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.length === filteredDocuments.length}
                        onCheckedChange={toggleAllRows}
                        className="border-[#20283A]"
                      />
                    </TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Documento</TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Operação</TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Status</TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Datas</TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Cliente</TableHead>
                    <TableHead className="text-[#E7EEF6]/80">Valor Total</TableHead>
                    <TableHead className="text-[#E7EEF6]/80 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="border-[#20283A] hover:bg-[#0F1115] cursor-pointer"
                      onClick={() => handleRowClick(doc)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.includes(doc.id)}
                          onCheckedChange={() => toggleRowSelection(doc.id)}
                          className="border-[#20283A]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-[#3BA3FF] text-[#3BA3FF]">
                              {doc.tipo}
                            </Badge>
                            <span className="text-xs text-[#E7EEF6]/60">
                              Nº {doc.numero} | Série {doc.serie}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#E7EEF6]/40 font-mono">
                              {doc.chave.substring(0, 20)}...
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(doc.chave);
                                toast({ title: "Chave copiada!" });
                              }}
                              className="text-[#3BA3FF] hover:text-[#3BA3FF]/80"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-[#E7EEF6]">{doc.operacao}</p>
                          {doc.pedido && (
                            <p className="text-xs text-[#3BA3FF]">{doc.pedido}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-[#E7EEF6]/60">
                            Emissão: {doc.dataEmissao}
                          </p>
                          {doc.dataPedido && (
                            <p className="text-xs text-[#E7EEF6]/60">
                              Pedido: {doc.dataPedido}
                            </p>
                          )}
                          {doc.dataCancelamento && (
                            <p className="text-xs text-red-400/80">
                              Cancel.: {doc.dataCancelamento}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-[#E7EEF6]">{doc.cliente}</p>
                          <p className="text-xs text-[#E7EEF6]/60">{doc.vendedor}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#E7EEF6]">
                            {doc.valorTotal}
                          </p>
                          {doc.frete !== "R$ 0,00" && (
                            <p className="text-xs text-[#E7EEF6]/60">
                              Frete: {doc.frete}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#151924] border-[#20283A]">
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("Devolução", doc.id)}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Realizar devolução
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("Carta de Correção", doc.id)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Carta de correção
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("WhatsApp", doc.id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Enviar WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#20283A]" />
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("Imprimir", doc.id)}
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Imprimir DANFE
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("Exportar XML", doc.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportar XML
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[#E7EEF6] focus:bg-[#3BA3FF]/10 focus:text-[#E7EEF6]"
                              onClick={() => handleAction("Exportar PDF", doc.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportar PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#20283A]" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                              onClick={() => handleAction("Cancelar", doc.id)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Cancelar nota
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#E7EEF6]/60">Itens por página:</span>
                <Select defaultValue="20">
                  <SelectTrigger className="w-20 bg-[#151924] border-[#20283A] text-[#E7EEF6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#E7EEF6]/60">
                  Mostrando {filteredDocuments.length} de {mockDocuments.length} documentos
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="produtos" className="mt-4">
            <div className="p-8 text-center rounded-lg border border-[#20283A] bg-[#151924]">
              <FileText className="h-12 w-12 mx-auto text-[#E7EEF6]/40 mb-4" />
              <p className="text-[#E7EEF6]/60">Histórico por produto em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="clientes" className="mt-4">
            <div className="p-8 text-center rounded-lg border border-[#20283A] bg-[#151924]">
              <FileText className="h-12 w-12 mx-auto text-[#E7EEF6]/40 mb-4" />
              <p className="text-[#E7EEF6]/60">Timeline de clientes/fornecedores em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="mt-4">
            <div className="p-8 text-center rounded-lg border border-[#20283A] bg-[#151924]">
              <FileText className="h-12 w-12 mx-auto text-[#E7EEF6]/40 mb-4" />
              <p className="text-[#E7EEF6]/60">Visão financeira em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="bg-[#0F1115] border-[#20283A] sm:max-w-xl overflow-y-auto">
          {selectedDoc && (
            <>
              <SheetHeader>
                <SheetTitle className="text-[#E7EEF6] flex items-center gap-3">
                  <span>{selectedDoc.tipo} - {selectedDoc.numero}</span>
                  {getStatusBadge(selectedDoc.status)}
                </SheetTitle>
                <SheetDescription className="text-[#E7EEF6]/60">
                  Detalhes completos do documento fiscal
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                  >
                    <Printer className="h-3 w-3 mr-2" />
                    Reimprimir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                  >
                    <Mail className="h-3 w-3 mr-2" />
                    Enviar E-mail
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                  >
                    <MessageCircle className="h-3 w-3 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#20283A] text-[#E7EEF6] hover:bg-[#3BA3FF]/10"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Exportar
                  </Button>
                </div>

                {/* Document Info */}
                <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924] space-y-3">
                  <h3 className="font-semibold text-[#E7EEF6] mb-3">Informações do Documento</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#E7EEF6]/60">Chave de Acesso</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[#E7EEF6] font-mono text-xs break-all">{selectedDoc.chave}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedDoc.chave);
                            toast({ title: "Chave copiada!" });
                          }}
                          className="text-[#3BA3FF] hover:text-[#3BA3FF]/80"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#E7EEF6]/60">Número/Série</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.numero} / {selectedDoc.serie}</p>
                    </div>
                    <div>
                      <p className="text-[#E7EEF6]/60">Modelo</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.modelo}</p>
                    </div>
                    <div>
                      <p className="text-[#E7EEF6]/60">Operação</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.operacao}</p>
                    </div>
                    <div>
                      <p className="text-[#E7EEF6]/60">Data de Emissão</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.dataEmissao}</p>
                    </div>
                    {selectedDoc.pedido && (
                      <div>
                        <p className="text-[#E7EEF6]/60">Pedido</p>
                        <p className="text-[#3BA3FF]">{selectedDoc.pedido}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924] space-y-3">
                  <h3 className="font-semibold text-[#E7EEF6] mb-3">Cliente/Fornecedor</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-[#E7EEF6]/60">Nome</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.cliente}</p>
                    </div>
                    <div>
                      <p className="text-[#E7EEF6]/60">Vendedor</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.vendedor}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924] space-y-3">
                  <h3 className="font-semibold text-[#E7EEF6] mb-3">Valores</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-[#E7EEF6]/60">Valor Total</p>
                      <p className="text-[#E7EEF6] font-medium">{selectedDoc.valorTotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[#E7EEF6]/60">Frete</p>
                      <p className="text-[#E7EEF6]">{selectedDoc.frete}</p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924]">
                  <h3 className="font-semibold text-[#E7EEF6] mb-3">Itens do Documento</h3>
                  <p className="text-sm text-[#E7EEF6]/60">
                    Detalhamento de itens em desenvolvimento
                  </p>
                </div>

                {/* Logs Section */}
                <div className="p-4 rounded-lg border border-[#20283A] bg-[#151924]">
                  <h3 className="font-semibold text-[#E7EEF6] mb-3">Logs e Eventos SEFAZ</h3>
                  <p className="text-sm text-[#E7EEF6]/60">
                    Histórico de eventos em desenvolvimento
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Historico;