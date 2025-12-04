import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  FileText,
  Download,
  Eye,
  CreditCard,
  XCircle,
  Search,
  MoreVertical,
} from "lucide-react";

interface Devolucao {
  id: string;
  codigo: string;
  data: string;
  documentoOrigem: string;
  tipoDocumento: string;
  cliente: string;
  origem: string;
  tipo: string;
  valorDevolvido: number;
  situacao: "Em análise" | "Aprovada" | "Recusada" | "Concluída";
}

interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  situacao: string;
}

const mockDevolucoes: Devolucao[] = [
  {
    id: "1",
    codigo: "DEV-2025-001",
    data: "2025-01-15",
    documentoOrigem: "NFCe 1234",
    tipoDocumento: "NFCe",
    cliente: "João da Silva",
    origem: "PDV",
    tipo: "Total",
    valorDevolvido: 259.90,
    situacao: "Aprovada",
  },
  {
    id: "2",
    codigo: "DEV-2025-002",
    data: "2025-01-16",
    documentoOrigem: "NFe 5678",
    tipoDocumento: "NFe",
    cliente: "Maria Santos Ltda",
    origem: "NFe",
    tipo: "Parcial",
    valorDevolvido: 1540.00,
    situacao: "Em análise",
  },
  {
    id: "3",
    codigo: "DEV-2025-003",
    data: "2025-01-17",
    documentoOrigem: "NFCe 9012",
    tipoDocumento: "NFCe",
    cliente: "Pedro Oliveira",
    origem: "PDV",
    tipo: "Troca",
    valorDevolvido: 89.90,
    situacao: "Concluída",
  },
];

const mockProdutosDevolucao: Produto[] = [
  {
    id: "1",
    nome: "Mouse Gamer RGB",
    quantidade: 1,
    valorUnitario: 129.90,
    valorTotal: 129.90,
    situacao: "Retornado ao estoque",
  },
  {
    id: "2",
    nome: "Teclado Mecânico",
    quantidade: 1,
    valorUnitario: 130.00,
    valorTotal: 130.00,
    situacao: "Retornado ao estoque",
  },
];

const Devolucao = () => {
  const [devolucoes] = useState<Devolucao[]>(mockDevolucoes);
  const [selectedDevolucao, setSelectedDevolucao] = useState<Devolucao | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [novaDevolucaoOpen, setNovaDevolucaoOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleViewDetails = (devolucao: Devolucao) => {
    setSelectedDevolucao(devolucao);
    setDetailsOpen(true);
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "Aprovada":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Em análise":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Recusada":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Concluída":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const totalPages = Math.ceil(devolucoes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevolucoes = devolucoes.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">Devolução</h1>
          <p className="text-muted-foreground mb-3">
            Gerencie devoluções de vendas, estornos, saldos e documentos fiscais de retorno.
          </p>
          <div className="text-sm text-muted-foreground">
            Vendas / <span className="text-foreground">Devolução</span>
          </div>
        </div>
        <Button onClick={() => setNovaDevolucaoOpen(true)} size="lg">
          Nova devolução
        </Button>
      </div>

      {/* Card de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total devolvido no mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 12.540,00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quantidade de devoluções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Créditos em aberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 3.240,50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes de análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número da nota, cliente ou código da devolução"
              className="pl-10"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Data inicial</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Data final</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Situação</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="analise">Em análise</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="recusada">Recusada</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de devolução</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="total">Devolução total</SelectItem>
                  <SelectItem value="parcial">Devolução parcial</SelectItem>
                  <SelectItem value="troca">Troca</SelectItem>
                  <SelectItem value="estorno">Estorno financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pdv">PDV</SelectItem>
                  <SelectItem value="nfe">NFe</SelectItem>
                  <SelectItem value="nfce">NFCe</SelectItem>
                  <SelectItem value="nfse">NFSe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button>Aplicar filtros</Button>
            <Button variant="outline">Limpar filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Devoluções */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Devoluções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Documento Origem</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDevolucoes.map((devolucao) => (
                  <TableRow key={devolucao.id}>
                    <TableCell className="font-medium">{devolucao.codigo}</TableCell>
                    <TableCell>{formatDate(devolucao.data)}</TableCell>
                    <TableCell>{devolucao.documentoOrigem}</TableCell>
                    <TableCell>{devolucao.cliente}</TableCell>
                    <TableCell>{devolucao.origem}</TableCell>
                    <TableCell>{devolucao.tipo}</TableCell>
                    <TableCell>{formatCurrency(devolucao.valorDevolvido)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSituacaoColor(devolucao.situacao)}>
                        {devolucao.situacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(devolucao)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Gerar crédito
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Gerar nota de devolução
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar devolução
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, devolucoes.length)} de{" "}
              {devolucoes.length} resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Página {currentPage} de {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Painel de Detalhes (Drawer) */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {selectedDevolucao && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {selectedDevolucao.codigo}
                  <Badge variant="outline" className={getSituacaoColor(selectedDevolucao.situacao)}>
                    {selectedDevolucao.situacao}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Origem: {selectedDevolucao.documentoOrigem}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Dados Principais */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dados Principais</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data da devolução:</span>
                      <span className="font-medium">{formatDate(selectedDevolucao.data)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{selectedDevolucao.cliente}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de devolução:</span>
                      <span className="font-medium">{selectedDevolucao.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origem:</span>
                      <span className="font-medium">{selectedDevolucao.origem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usuário que registrou:</span>
                      <span className="font-medium">Admin Sistema</span>
                    </div>
                  </div>
                </div>

                {/* Produtos Devolvidos */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Produtos Devolvidos</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-right">Qtd</TableHead>
                          <TableHead className="text-right">Valor Unit.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProdutosDevolucao.map((produto) => (
                          <TableRow key={produto.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{produto.nome}</div>
                                <div className="text-xs text-muted-foreground">
                                  {produto.situacao}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{produto.quantidade}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(produto.valorUnitario)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(produto.valorTotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Integração Fiscal */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Integração Fiscal</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Documento fiscal de origem:
                      </span>
                      <span className="text-sm font-medium">{selectedDevolucao.documentoOrigem}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar DANFE
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar XML
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Impacto Financeiro */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Impacto Financeiro</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Forma de restituição:</span>
                      <span className="font-medium">Crédito em conta do cliente</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total devolvido:</span>
                      <span className="font-medium text-lg">
                        {formatCurrency(selectedDevolucao.valorDevolvido)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status do estorno:</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400">
                        Concluído
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Histórico */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="w-px h-full bg-border" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm font-medium">Devolução criada</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(selectedDevolucao.data)} - Admin Sistema
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="w-px h-full bg-border" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm font-medium">Devolução aprovada</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(selectedDevolucao.data)} - Gerente Vendas
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Estorno processado</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(selectedDevolucao.data)} - Sistema
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal Nova Devolução */}
      <Dialog open={novaDevolucaoOpen} onOpenChange={setNovaDevolucaoOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Devolução - Passo {step} de 4</DialogTitle>
            <DialogDescription>
              {step === 1 && "Selecione a venda ou documento origem"}
              {step === 2 && "Selecione os itens para devolução"}
              {step === 3 && "Defina o tipo e tratamento da devolução"}
              {step === 4 && "Revise e confirme a devolução"}
            </DialogDescription>
          </DialogHeader>

          {/* Passo 1 - Selecionar venda */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Buscar por</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nfe">Número da NFe/NFCe</Label>
                    <Input id="nfe" placeholder="Digite o número" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdv">Código da venda no PDV</Label>
                    <Input id="pdv" placeholder="Digite o código" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfcnpj">CPF/CNPJ do cliente</Label>
                <Input id="cpfcnpj" placeholder="Digite o CPF ou CNPJ" />
              </div>
              <Button className="w-full" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Buscar venda
              </Button>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Resumo da Venda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-medium">João da Silva</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">15/01/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total da venda:</span>
                    <span className="font-medium">R$ 259,90</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Passo 2 - Selecionar itens */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd. Vendida</TableHead>
                      <TableHead className="text-right">Qtd. Devolver</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Mouse Gamer RGB</div>
                          <div className="text-xs text-muted-foreground">COD: 12345</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">
                        <Input type="number" min="0" max="1" defaultValue="1" className="w-20" />
                      </TableCell>
                      <TableCell className="text-right">R$ 129,90</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Teclado Mecânico</div>
                          <div className="text-xs text-muted-foreground">COD: 67890</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">
                        <Input type="number" min="0" max="1" defaultValue="1" className="w-20" />
                      </TableCell>
                      <TableCell className="text-right">R$ 130,00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo da devolução (opcional)</Label>
                <Textarea
                  id="motivo"
                  placeholder="Descreva o motivo da devolução"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Passo 3 - Tipo e tratamento */}
          {step === 3 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Tipo de devolução</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Devolução total</SelectItem>
                    <SelectItem value="parcial">Devolução parcial</SelectItem>
                    <SelectItem value="troca">Troca</SelectItem>
                    <SelectItem value="estorno">Estorno financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tratamento de estoque</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tratamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voltar">Voltar para estoque</SelectItem>
                    <SelectItem value="perda">Registrar como perda</SelectItem>
                    <SelectItem value="fornecedor">Devolução ao fornecedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tratamento financeiro</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tratamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credito">Gerar crédito para o cliente</SelectItem>
                    <SelectItem value="estorno">Estornar pagamento</SelectItem>
                    <SelectItem value="nenhum">Nenhum movimento financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Passo 4 - Revisão */}
          {step === 4 && (
            <div className="space-y-4 py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo da Devolução</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">Devolução total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Itens:</span>
                      <span className="font-medium">2 produtos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tratamento de estoque:</span>
                      <span className="font-medium">Voltar para estoque</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tratamento financeiro:</span>
                      <span className="font-medium">Gerar crédito para o cliente</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground font-medium">Valor total:</span>
                      <span className="font-bold text-lg">R$ 259,90</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Ao confirmar, a devolução será registrada no sistema, o estoque será atualizado
                      e o crédito será gerado na conta do cliente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} className="w-full sm:w-auto">
                Avançar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setNovaDevolucaoOpen(false);
                  setStep(1);
                }}
                className="w-full sm:w-auto"
              >
                Confirmar devolução
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Devolucao;
