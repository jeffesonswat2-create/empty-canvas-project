import { useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Power,
  Search,
  Copy,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FiguraTributaria {
  id: number;
  codigo: string;
  descricao: string;
  tipoOperacao: "Entrada" | "Saída";
  ativo: boolean;
  observacoes?: string;
}

const FigurasTributarias = () => {
  const { toast } = useToast();
  
  // Estados
  const [figuras, setFiguras] = useState<FiguraTributaria[]>([
    {
      id: 1,
      codigo: "FT-001",
      descricao: "Venda para consumidor final",
      tipoOperacao: "Saída",
      ativo: true,
      observacoes: "Operação padrão de venda",
    },
    {
      id: 2,
      codigo: "FT-002",
      descricao: "Venda para revenda",
      tipoOperacao: "Saída",
      ativo: true,
      observacoes: "",
    },
    {
      id: 3,
      codigo: "FT-003",
      descricao: "Compra para estoque",
      tipoOperacao: "Entrada",
      ativo: true,
      observacoes: "",
    },
    {
      id: 4,
      codigo: "FT-004",
      descricao: "Devolução de venda",
      tipoOperacao: "Entrada",
      ativo: false,
      observacoes: "Figura desativada temporariamente",
    },
    {
      id: 5,
      codigo: "FT-005",
      descricao: "Venda com substituição tributária",
      tipoOperacao: "Saída",
      ativo: true,
      observacoes: "",
    },
    {
      id: 6,
      codigo: "FT-006",
      descricao: "Compra com substituição tributária",
      tipoOperacao: "Entrada",
      ativo: true,
      observacoes: "",
    },
  ]);

  const [isNovaFiguraOpen, setIsNovaFiguraOpen] = useState(false);
  const [isEditarFiguraOpen, setIsEditarFiguraOpen] = useState(false);
  const [figuraEditando, setFiguraEditando] = useState<FiguraTributaria | null>(null);
  const [tipoOperacaoAlterado, setTipoOperacaoAlterado] = useState(false);
  const [confirmacao, setConfirmacao] = useState<{
    open: boolean;
    figura: FiguraTributaria | null;
    acao: "ativar" | "desativar";
  }>({ open: false, figura: null, acao: "desativar" });

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPesquisa, setFiltroPesquisa] = useState<string>("");
  const [ordenacao, setOrdenacao] = useState<{
    campo: "codigo" | "descricao" | "tipoOperacao";
    direcao: "asc" | "desc";
  }>({ campo: "codigo", direcao: "asc" });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  // Form state
  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    tipoOperacao: "Saída" as "Entrada" | "Saída",
    ativo: true,
    observacoes: "",
  });

  // Gerar próximo código
  const gerarProximoCodigo = () => {
    const ultimaFigura = figuras[figuras.length - 1];
    if (!ultimaFigura) return "FT-001";
    
    const numero = parseInt(ultimaFigura.codigo.split("-")[1]) + 1;
    return `FT-${numero.toString().padStart(3, "0")}`;
  };

  // Validar código duplicado
  const validarCodigoDuplicado = (codigo: string, idAtual?: number) => {
    return figuras.some(
      (f) => f.codigo === codigo && f.id !== idAtual
    );
  };

  // Abrir modal de nova figura
  const abrirNovaFigura = () => {
    setFormData({
      codigo: gerarProximoCodigo(),
      descricao: "",
      tipoOperacao: "Saída",
      ativo: true,
      observacoes: "",
    });
    setIsNovaFiguraOpen(true);
  };

  // Abrir modal de edição
  const abrirEditarFigura = (figura: FiguraTributaria) => {
    setFiguraEditando(figura);
    setFormData({
      codigo: figura.codigo,
      descricao: figura.descricao,
      tipoOperacao: figura.tipoOperacao,
      ativo: figura.ativo,
      observacoes: figura.observacoes || "",
    });
    setTipoOperacaoAlterado(false);
    setIsEditarFiguraOpen(true);
  };

  // Duplicar figura
  const duplicarFigura = (figura: FiguraTributaria) => {
    setFormData({
      codigo: gerarProximoCodigo(),
      descricao: `${figura.descricao} (Cópia)`,
      tipoOperacao: figura.tipoOperacao,
      ativo: true,
      observacoes: figura.observacoes || "",
    });
    setIsNovaFiguraOpen(true);
    toast({
      title: "Figura duplicada",
      description: "Ajuste os dados e salve a nova figura tributária.",
    });
  };

  // Salvar nova figura
  const salvarNovaFigura = () => {
    // Validações
    if (!formData.codigo || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Código e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (validarCodigoDuplicado(formData.codigo)) {
      toast({
        title: "Erro",
        description: "Código já existe. Use outro código.",
        variant: "destructive",
      });
      return;
    }

    const novaFigura: FiguraTributaria = {
      id: figuras.length + 1,
      ...formData,
    };

    setFiguras([...figuras, novaFigura]);
    setIsNovaFiguraOpen(false);
    toast({
      title: "Sucesso",
      description: "Figura tributária cadastrada com sucesso",
    });
  };

  // Atualizar figura
  const atualizarFigura = () => {
    if (!figuraEditando) return;

    // Validações
    if (!formData.codigo || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Código e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (validarCodigoDuplicado(formData.codigo, figuraEditando.id)) {
      toast({
        title: "Erro",
        description: "Código já existe. Use outro código.",
        variant: "destructive",
      });
      return;
    }

    setFiguras(
      figuras.map((f) =>
        f.id === figuraEditando.id
          ? { ...f, ...formData }
          : f
      )
    );
    setIsEditarFiguraOpen(false);
    setFiguraEditando(null);
    setTipoOperacaoAlterado(false);
    toast({
      title: "Sucesso",
      description: "Figura tributária atualizada",
    });
  };

  // Alternar status
  const confirmarAlterarStatus = (figura: FiguraTributaria) => {
    setConfirmacao({
      open: true,
      figura,
      acao: figura.ativo ? "desativar" : "ativar",
    });
  };

  const alterarStatus = () => {
    if (!confirmacao.figura) return;

    setFiguras(
      figuras.map((f) =>
        f.id === confirmacao.figura!.id
          ? { ...f, ativo: !f.ativo }
          : f
      )
    );

    const acao = confirmacao.figura.ativo ? "desativada" : "ativada";
    toast({
      title: "Sucesso",
      description: `Figura tributária ${acao}`,
    });

    setConfirmacao({ open: false, figura: null, acao: "desativar" });
  };

  // Ordenação
  const ordenarPor = (campo: "codigo" | "descricao" | "tipoOperacao") => {
    setOrdenacao({
      campo,
      direcao:
        ordenacao.campo === campo && ordenacao.direcao === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Filtrar e ordenar figuras
  const figurasFiltradas = figuras
    .filter((figura) => {
      const matchTipo =
        filtroTipo === "todos" || figura.tipoOperacao === filtroTipo;
      const matchStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativo" && figura.ativo) ||
        (filtroStatus === "inativo" && !figura.ativo);
      const matchPesquisa =
        filtroPesquisa === "" ||
        figura.codigo.toLowerCase().includes(filtroPesquisa.toLowerCase()) ||
        figura.descricao.toLowerCase().includes(filtroPesquisa.toLowerCase());

      return matchTipo && matchStatus && matchPesquisa;
    })
    .sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      
      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1;
      return 0;
    });

  // Paginação
  const totalPaginas = Math.ceil(figurasFiltradas.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const figurasPaginadas = figurasFiltradas.slice(indiceInicial, indiceFinal);

  // Detectar mudança de tipo de operação
  const handleTipoOperacaoChange = (novoTipo: "Entrada" | "Saída") => {
    if (figuraEditando && figuraEditando.tipoOperacao !== novoTipo) {
      setTipoOperacaoAlterado(true);
    } else {
      setTipoOperacaoAlterado(false);
    }
    setFormData({ ...formData, tipoOperacao: novoTipo });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Figuras Tributárias
          </h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie figuras tributárias utilizadas na emissão de documentos fiscais.
          </p>
        </div>
        <Button 
          onClick={abrirNovaFigura}
          style={{ backgroundColor: "#FF8A00" }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Figura Tributária
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Figuras Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de figuras tributárias configuradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por código ou descrição"
                value={filtroPesquisa}
                onChange={(e) => {
                  setFiltroPesquisa(e.target.value);
                  setPaginaAtual(1);
                }}
                className="pl-9"
              />
            </div>

            <Select 
              value={filtroTipo} 
              onValueChange={(value) => {
                setFiltroTipo(value);
                setPaginaAtual(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filtroStatus} 
              onValueChange={(value) => {
                setFiltroStatus(value);
                setPaginaAtual(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contador */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total: {figurasFiltradas.length} figura(s)</span>
            {totalPaginas > 1 && (
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
            )}
          </div>

          {/* Tabela */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("codigo")}
                  >
                    <div className="flex items-center gap-2">
                      Código
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("descricao")}
                  >
                    <div className="flex items-center gap-2">
                      Descrição
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("tipoOperacao")}
                  >
                    <div className="flex items-center gap-2">
                      Tipo de Operação
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Ativo?</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {figurasPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma figura tributária encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  figurasPaginadas.map((figura) => (
                    <TableRow
                      key={figura.id}
                      className={!figura.ativo ? "opacity-50" : ""}
                    >
                      <TableCell className="font-medium">{figura.codigo}</TableCell>
                      <TableCell>{figura.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{figura.tipoOperacao}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: figura.ativo ? "#3B82F6" : "#EF4444",
                            color: "white",
                          }}
                        >
                          {figura.ativo ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirEditarFigura(figura)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicarFigura(figura)}
                            title="Duplicar"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmarAlterarStatus(figura)}
                            title={figura.ativo ? "Desativar" : "Ativar"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                  <Button
                    key={pagina}
                    variant={paginaAtual === pagina ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaginaAtual(pagina)}
                  >
                    {pagina}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Nova Figura */}
      <Dialog open={isNovaFiguraOpen} onOpenChange={setIsNovaFiguraOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Figura Tributária</DialogTitle>
            <DialogDescription>
              Cadastre uma nova figura tributária no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">
                  Código <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="FT-001"
                />
                <p className="text-xs text-muted-foreground">
                  Código gerado automaticamente, mas editável
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-operacao">
                  Tipo de Operação <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tipoOperacao}
                  onValueChange={(value: "Entrada" | "Saída") =>
                    setFormData({ ...formData, tipoOperacao: value })
                  }
                >
                  <SelectTrigger id="tipo-operacao">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">
                Descrição da operação <span className="text-destructive">*</span>
              </Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Venda para consumidor final"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao">Status</Label>
              <Select
                value={formData.ativo ? "ativo" : "inativo"}
                onValueChange={(value) =>
                  setFormData({ ...formData, ativo: value === "ativo" })
                }
              >
                <SelectTrigger id="situacao">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Observações adicionais (opcional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNovaFiguraOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarNovaFigura}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Figura */}
      <Dialog open={isEditarFiguraOpen} onOpenChange={setIsEditarFiguraOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Figura Tributária</DialogTitle>
            <DialogDescription>
              Atualize os dados da figura tributária
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-codigo">
                  Código <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-codigo"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="FT-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tipo-operacao">
                  Tipo de Operação <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tipoOperacao}
                  onValueChange={handleTipoOperacaoChange}
                >
                  <SelectTrigger id="edit-tipo-operacao">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {tipoOperacaoAlterado && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-500">
                    Atenção: Alteração de Tipo de Operação
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A mudança do tipo de operação pode impactar documentos fiscais já emitidos.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-descricao">
                Descrição da operação <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Venda para consumidor final"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-situacao">Status</Label>
              <Select
                value={formData.ativo ? "ativo" : "inativo"}
                onValueChange={(value) =>
                  setFormData({ ...formData, ativo: value === "ativo" })
                }
              >
                <SelectTrigger id="edit-situacao">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Textarea
                id="edit-observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Observações adicionais (opcional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditarFiguraOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={atualizarFigura}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Confirmação de alteração de status */}
      <AlertDialog
        open={confirmacao.open}
        onOpenChange={(open) =>
          setConfirmacao({ ...confirmacao, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar {confirmacao.acao}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {confirmacao.acao} a figura tributária{" "}
              <strong>{confirmacao.figura?.codigo}</strong>?
              {confirmacao.acao === "desativar" && (
                <span className="block mt-2">
                  A figura não será excluída, apenas desativada e poderá ser reativada posteriormente.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={alterarStatus}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FigurasTributarias;
