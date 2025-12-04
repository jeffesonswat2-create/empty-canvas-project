import { useState } from "react";
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Download, 
  Edit, 
  Copy, 
  Star, 
  Archive, 
  Eye,
  Printer,
  RotateCw,
  FileDown,
  Trash2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type TipoVisualizacao = "modelos" | "geradas";
type OrigemFiltro = "todos" | "estoque" | "consignacao" | "pdv";
type FormatoFiltro = "todos" | "a4-3col" | "termica-40x30" | "termica-60x40" | "personalizado";

interface ModeloEtiqueta {
  id: string;
  nome: string;
  formato: string;
  finalidade: string;
  campos: string;
  ultimaAtualizacao: string;
  status: "ativo" | "inativo";
}

interface ListaEtiqueta {
  id: string;
  nome: string;
  origem: string;
  modeloUtilizado: string;
  quantidade: number;
  criadoEm: string;
  status: "pendente" | "parcial" | "concluida";
}

const Etiquetas = () => {
  const [tipoVisualizacao, setTipoVisualizacao] = useState<TipoVisualizacao>("modelos");
  const [origemFiltro, setOrigemFiltro] = useState<OrigemFiltro>("todos");
  const [formatoFiltro, setFormatoFiltro] = useState<FormatoFiltro>("todos");
  const [busca, setBusca] = useState("");
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalImprimirAberto, setModalImprimirAberto] = useState(false);

  // Dados mock - Modelos
  const [modelos] = useState<ModeloEtiqueta[]>([
    {
      id: "1",
      nome: "Etiqueta Padrão Produtos",
      formato: "A4 – 3 colunas",
      finalidade: "Produtos",
      campos: "Código, Nome, Preço, Código de barras",
      ultimaAtualizacao: "2025-01-15 10:30",
      status: "ativo"
    },
    {
      id: "2",
      nome: "Etiqueta Consignação",
      formato: "Térmica 40x30",
      finalidade: "Consignação",
      campos: "Nome, Preço, Lote, Validade",
      ultimaAtualizacao: "2025-01-10 14:20",
      status: "ativo"
    },
    {
      id: "3",
      nome: "Etiqueta PDV Promocional",
      formato: "Térmica 60x40",
      finalidade: "PDV",
      campos: "Nome, Preço promocional, Código de barras",
      ultimaAtualizacao: "2024-12-20 09:15",
      status: "inativo"
    }
  ]);

  // Dados mock - Listas Geradas
  const [listas] = useState<ListaEtiqueta[]>([
    {
      id: "1",
      nome: "Produtos novos – 15/01/2025",
      origem: "Produtos",
      modeloUtilizado: "Etiqueta Padrão Produtos",
      quantidade: 150,
      criadoEm: "2025-01-15 11:00",
      status: "pendente"
    },
    {
      id: "2",
      nome: "Consignação lote 003",
      origem: "Consignação",
      modeloUtilizado: "Etiqueta Consignação",
      quantidade: 75,
      criadoEm: "2025-01-10 16:45",
      status: "parcial"
    },
    {
      id: "3",
      nome: "Reposição PDV – Janeiro",
      origem: "PDV",
      modeloUtilizado: "Etiqueta PDV Promocional",
      quantidade: 200,
      criadoEm: "2025-01-08 13:30",
      status: "concluida"
    }
  ]);

  const handleCriarModelo = () => {
    setModalCriarAberto(true);
  };

  const handleSalvarModelo = () => {
    toast.success("Modelo de etiqueta salvo com sucesso");
    setModalCriarAberto(false);
  };

  const handleEditarModelo = (id: string) => {
    toast.info(`Editando modelo ${id}`);
    setModalCriarAberto(true);
  };

  const handleDuplicarModelo = (id: string) => {
    toast.success(`Modelo ${id} duplicado com sucesso`);
  };

  const handleDefinirPadrao = (id: string) => {
    toast.success(`Modelo ${id} definido como padrão`);
  };

  const handleArquivar = (id: string) => {
    toast.success(`Modelo ${id} arquivado`);
  };

  const handleVisualizarItens = (id: string) => {
    toast.info(`Visualizando itens da lista ${id}`);
    setModalDetalhesAberto(true);
  };

  const handleImprimir = (id: string) => {
    toast.info(`Abrindo diálogo de impressão para ${id}`);
    setModalImprimirAberto(true);
  };

  const handleRegerar = (id: string) => {
    toast.success(`Lista ${id} regenerada`);
  };

  const handleExportarPDF = (id: string) => {
    toast.success(`PDF da lista ${id} exportado`);
  };

  const handleExcluirLista = (id: string) => {
    toast.success(`Lista ${id} excluída`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      ativo: { variant: "default", label: "Ativo" },
      inativo: { variant: "secondary", label: "Inativo" },
      pendente: { variant: "outline", label: "Pendente" },
      parcial: { variant: "outline", label: "Parcialmente impressa" },
      concluida: { variant: "default", label: "Concluída" }
    };

    const config = variants[status] || variants.pendente;
    
    return (
      <Badge 
        variant={config.variant}
        className={status === "ativo" || status === "concluida" ? "bg-success/20 text-success hover:bg-success/30" : 
                   status === "pendente" || status === "parcial" ? "bg-warning/20 text-warning hover:bg-warning/30" : ""}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      <main className="flex-1 p-6 space-y-6 overflow-auto" style={{ backgroundColor: '#0F1115' }}>
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#3BA3FF' }}>
              Etiquetas
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8EA0B5' }}>
              Gerencie modelos, gere e imprima etiquetas para produtos, consignação e vendas.
            </p>
          </div>
          <Button 
            onClick={handleCriarModelo}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar modelo de etiqueta
          </Button>
        </div>

        {/* Filtros e Ações */}
        <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Busca */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8EA0B5' }} />
                <Input
                  placeholder="Buscar etiquetas ou modelos"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                  style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}
                />
              </div>

              {/* Tipo de Visualização */}
              <Select value={tipoVisualizacao} onValueChange={(value) => setTipoVisualizacao(value as TipoVisualizacao)}>
                <SelectTrigger style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue placeholder="Tipo de visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modelos">Modelos de etiquetas</SelectItem>
                  <SelectItem value="geradas">Etiquetas geradas</SelectItem>
                </SelectContent>
              </Select>

              {/* Origem */}
              <Select value={origemFiltro} onValueChange={(value) => setOrigemFiltro(value as OrigemFiltro)}>
                <SelectTrigger style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="estoque">Estoque / Produtos</SelectItem>
                  <SelectItem value="consignacao">Consignação</SelectItem>
                  <SelectItem value="pdv">PDV / Vendas</SelectItem>
                </SelectContent>
              </Select>

              {/* Formato */}
              <Select value={formatoFiltro} onValueChange={(value) => setFormatoFiltro(value as FormatoFiltro)}>
                <SelectTrigger style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue placeholder="Formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="a4-3col">A4 – 3 colunas</SelectItem>
                  <SelectItem value="termica-40x30">Térmica 40x30</SelectItem>
                  <SelectItem value="termica-60x40">Térmica 60x40</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar lista
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal - Modelos */}
        {tipoVisualizacao === "modelos" && (
          <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
            <CardHeader>
              <CardTitle style={{ color: '#E7EEF6' }}>Modelos de Etiquetas</CardTitle>
              <CardDescription style={{ color: '#8EA0B5' }}>
                Gerencie seus templates de etiquetas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: '#20283A' }}>
                      <TableHead style={{ color: '#8EA0B5' }}>Nome do modelo</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Formato</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Finalidade</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Campos exibidos</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Última atualização</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Status</TableHead>
                      <TableHead style={{ color: '#8EA0B5' }}>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelos.map((modelo) => (
                      <TableRow key={modelo.id} style={{ borderColor: '#20283A' }}>
                        <TableCell style={{ color: '#E7EEF6' }} className="font-medium">
                          {modelo.nome}
                        </TableCell>
                        <TableCell style={{ color: '#E7EEF6' }}>{modelo.formato}</TableCell>
                        <TableCell style={{ color: '#E7EEF6' }}>{modelo.finalidade}</TableCell>
                        <TableCell style={{ color: '#8EA0B5' }} className="text-sm max-w-xs truncate">
                          {modelo.campos}
                        </TableCell>
                        <TableCell style={{ color: '#8EA0B5' }} className="text-sm">
                          {modelo.ultimaAtualizacao}
                        </TableCell>
                        <TableCell>{getStatusBadge(modelo.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarModelo(modelo.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicarModelo(modelo.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDefinirPadrao(modelo.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArquivar(modelo.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Archive className="h-4 w-4" />
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
        )}

        {/* Conteúdo Principal - Etiquetas Geradas */}
        {tipoVisualizacao === "geradas" && (
          <>
            {/* Card de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
                <CardHeader className="pb-3">
                  <CardDescription style={{ color: '#8EA0B5' }}>
                    Etiquetas prontas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: '#3BA3FF' }}>425</div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
                <CardHeader className="pb-3">
                  <CardDescription style={{ color: '#8EA0B5' }}>
                    Impressas hoje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: '#22C55E' }}>150</div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
                <CardHeader className="pb-3">
                  <CardDescription style={{ color: '#8EA0B5' }}>
                    Última lista gerada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium" style={{ color: '#E7EEF6' }}>
                    Produtos novos – 15/01/2025
                  </div>
                  <div className="text-xs" style={{ color: '#8EA0B5' }}>15/01/2025 11:00</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Listas */}
            <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
              <CardHeader>
                <CardTitle style={{ color: '#E7EEF6' }}>Listas de Etiquetas</CardTitle>
                <CardDescription style={{ color: '#8EA0B5' }}>
                  Gerencie suas listas de impressão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: '#20283A' }}>
                        <TableHead style={{ color: '#8EA0B5' }}>Nome da lista</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Origem</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Modelo utilizado</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Quantidade</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Criado em</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Status</TableHead>
                        <TableHead style={{ color: '#8EA0B5' }}>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listas.map((lista) => (
                        <TableRow key={lista.id} style={{ borderColor: '#20283A' }}>
                          <TableCell style={{ color: '#E7EEF6' }} className="font-medium">
                            {lista.nome}
                          </TableCell>
                          <TableCell style={{ color: '#E7EEF6' }}>{lista.origem}</TableCell>
                          <TableCell style={{ color: '#E7EEF6' }}>{lista.modeloUtilizado}</TableCell>
                          <TableCell style={{ color: '#E7EEF6' }}>{lista.quantidade}</TableCell>
                          <TableCell style={{ color: '#8EA0B5' }} className="text-sm">
                            {lista.criadoEm}
                          </TableCell>
                          <TableCell>{getStatusBadge(lista.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVisualizarItens(lista.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImprimir(lista.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRegerar(lista.id)}
                                className="h-8 w-8 p-0"
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExportarPDF(lista.id)}
                                className="h-8 w-8 p-0"
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExcluirLista(lista.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </>
        )}
      </main>

      {/* Modal Criar/Editar Modelo */}
      <Dialog open={modalCriarAberto} onOpenChange={setModalCriarAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E7EEF6' }}>Criar Modelo de Etiqueta</DialogTitle>
            <DialogDescription style={{ color: '#8EA0B5' }}>
              Configure os campos e o formato da sua etiqueta
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome-modelo" style={{ color: '#E7EEF6' }}>Nome do modelo</Label>
                <Input 
                  id="nome-modelo" 
                  placeholder="Ex: Etiqueta Padrão Produtos"
                  style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="formato" style={{ color: '#E7EEF6' }}>Formato da etiqueta</Label>
                <Select defaultValue="a4-3col">
                  <SelectTrigger className="mt-1" style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4-3col">A4 – 3 colunas</SelectItem>
                    <SelectItem value="termica-40x30">Térmica 40x30</SelectItem>
                    <SelectItem value="termica-60x40">Térmica 60x40</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label style={{ color: '#E7EEF6' }}>Finalidade</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fin-produtos" />
                    <label htmlFor="fin-produtos" className="text-sm" style={{ color: '#E7EEF6' }}>
                      Produtos (estoque)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fin-consignacao" />
                    <label htmlFor="fin-consignacao" className="text-sm" style={{ color: '#E7EEF6' }}>
                      Consignação
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fin-pdv" />
                    <label htmlFor="fin-pdv" className="text-sm" style={{ color: '#E7EEF6' }}>
                      PDV / Vendas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fin-generico" />
                    <label htmlFor="fin-generico" className="text-sm" style={{ color: '#E7EEF6' }}>
                      Genérico
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label style={{ color: '#E7EEF6' }}>Campos da etiqueta</Label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "Código do produto",
                    "Nome / Descrição resumida",
                    "Preço de venda",
                    "Preço promocional",
                    "Código de barras (EAN / interno)",
                    "SKU",
                    "Lote",
                    "Validade",
                    "Nome da empresa",
                    "CNPJ"
                  ].map((campo) => (
                    <div key={campo} className="flex items-center space-x-2">
                      <Checkbox id={campo} />
                      <label htmlFor={campo} className="text-sm" style={{ color: '#E7EEF6' }}>
                        {campo}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pré-visualização */}
            <div>
              <Label style={{ color: '#E7EEF6' }}>Pré-visualização</Label>
              <div 
                className="mt-2 border rounded-lg p-4 min-h-[400px] flex items-center justify-center"
                style={{ backgroundColor: '#0F1115', borderColor: '#20283A' }}
              >
                <div className="text-center space-y-2 border-2 border-dashed rounded p-6" style={{ borderColor: '#20283A', width: '200px' }}>
                  <div className="text-xs font-bold" style={{ color: '#E7EEF6' }}>PRODUTO EXEMPLO</div>
                  <div className="text-sm" style={{ color: '#8EA0B5' }}>SKU: 12345</div>
                  <div className="text-lg font-bold" style={{ color: '#3BA3FF' }}>R$ 19,90</div>
                  <div className="h-12 bg-muted/20 flex items-center justify-center text-xs" style={{ color: '#8EA0B5' }}>
                    |||||||||||||||
                  </div>
                  <div className="text-xs" style={{ color: '#8EA0B5' }}>7891234567890</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalCriarAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarModelo} className="bg-primary hover:bg-primary/90">
              Salvar modelo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Itens */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="max-w-3xl" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E7EEF6' }}>Produtos novos – 15/01/2025</DialogTitle>
            <DialogDescription style={{ color: '#8EA0B5' }}>
              Modelo: Etiqueta Padrão Produtos | Origem: Produtos | Status: Pendente
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: '#20283A' }}>
                  <TableHead style={{ color: '#8EA0B5' }}>Selecionar</TableHead>
                  <TableHead style={{ color: '#8EA0B5' }}>Código</TableHead>
                  <TableHead style={{ color: '#8EA0B5' }}>Nome do produto</TableHead>
                  <TableHead style={{ color: '#8EA0B5' }}>Quantidade</TableHead>
                  <TableHead style={{ color: '#8EA0B5' }}>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow style={{ borderColor: '#20283A' }}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>001</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>Produto A</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>50</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>R$ 19,90</TableCell>
                </TableRow>
                <TableRow style={{ borderColor: '#20283A' }}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>002</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>Produto B</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>100</TableCell>
                  <TableCell style={{ color: '#E7EEF6' }}>R$ 29,90</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalDetalhesAberto(false)}>
              Fechar
            </Button>
            <Button variant="outline">
              Marcar selecionados como impressos
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Imprimir selecionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Imprimir */}
      <Dialog open={modalImprimirAberto} onOpenChange={setModalImprimirAberto}>
        <DialogContent style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E7EEF6' }}>Configurações de Impressão</DialogTitle>
            <DialogDescription style={{ color: '#8EA0B5' }}>
              Configure as opções de impressão
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="impressora" style={{ color: '#E7EEF6' }}>Impressora (opcional)</Label>
              <Select>
                <SelectTrigger className="mt-1" style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impressora1">Impressora Térmica 1</SelectItem>
                  <SelectItem value="impressora2">Impressora A4 Padrão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formato-impressao" style={{ color: '#E7EEF6' }}>Formato (sobrescrever)</Label>
              <Select>
                <SelectTrigger className="mt-1" style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue placeholder="Usar formato padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4-3col">A4 – 3 colunas</SelectItem>
                  <SelectItem value="termica-40x30">Térmica 40x30</SelectItem>
                  <SelectItem value="termica-60x40">Térmica 60x40</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="marcar-impressa" />
              <label htmlFor="marcar-impressa" className="text-sm" style={{ color: '#E7EEF6' }}>
                Marcar como impressa após concluir
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalImprimirAberto(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                toast.success("Impressão iniciada");
                setModalImprimirAberto(false);
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Etiquetas;