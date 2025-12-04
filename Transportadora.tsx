import { useState } from "react";
import {
  Truck,
  Plus,
  Pencil,
  Power,
  Trash2,
  Search,
  ArrowUpDown,
  AlertTriangle,
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
import { useToast } from "@/hooks/use-toast";

interface Transportadora {
  id: number;
  nome: string;
  cnpj: string;
  inscricaoEstadual?: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  responsavel: string;
  ativo: boolean;
  vinculada: boolean; // Se está vinculada a movimentações
}

const Transportadora = () => {
  const { toast } = useToast();

  // Estados
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([
    {
      id: 1,
      nome: "Transportadora Rápida Ltda",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123.456.789",
      cep: "01310-100",
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      telefone: "(11) 98765-4321",
      responsavel: "João Silva",
      ativo: true,
      vinculada: true,
    },
    {
      id: 2,
      nome: "Logística Veloz S.A.",
      cnpj: "98.765.432/0001-10",
      inscricaoEstadual: "987.654.321",
      cep: "20040-020",
      logradouro: "Av. Rio Branco",
      numero: "156",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      telefone: "(21) 91234-5678",
      responsavel: "Maria Santos",
      ativo: true,
      vinculada: false,
    },
    {
      id: 3,
      nome: "Cargas & Entregas",
      cnpj: "45.678.901/0001-23",
      inscricaoEstadual: "",
      cep: "30130-010",
      logradouro: "Rua da Bahia",
      numero: "789",
      bairro: "Centro",
      cidade: "Belo Horizonte",
      uf: "MG",
      telefone: "(31) 99876-5432",
      responsavel: "Pedro Oliveira",
      ativo: false,
      vinculada: false,
    },
  ]);

  const [isNovaTransportadoraOpen, setIsNovaTransportadoraOpen] = useState(false);
  const [isEditarTransportadoraOpen, setIsEditarTransportadoraOpen] = useState(false);
  const [transportadoraEditando, setTransportadoraEditando] = useState<Transportadora | null>(null);
  const [alertaDesativacao, setAlertaDesativacao] = useState<{
    open: boolean;
    transportadora: Transportadora | null;
  }>({ open: false, transportadora: null });
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<{
    open: boolean;
    transportadora: Transportadora | null;
  }>({ open: false, transportadora: null });

  // Filtros
  const [filtroPesquisa, setFiltroPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroUF, setFiltroUF] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<{
    campo: "nome" | "cnpj" | "cidade";
    direcao: "asc" | "desc";
  }>({ campo: "nome", direcao: "asc" });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    inscricaoEstadual: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    telefone: "",
    responsavel: "",
    ativo: true,
  });

  // Máscaras
  const aplicarMascaraCNPJ = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const aplicarMascaraCEP = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  const aplicarMascaraTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  // Validação de CNPJ básica
  const validarCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/\D/g, "");
    return numeros.length === 14;
  };

  // Abrir modal de nova transportadora
  const abrirNovaTransportadora = () => {
    setFormData({
      nome: "",
      cnpj: "",
      inscricaoEstadual: "",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      telefone: "",
      responsavel: "",
      ativo: true,
    });
    setIsNovaTransportadoraOpen(true);
  };

  // Abrir modal de edição
  const abrirEditarTransportadora = (transportadora: Transportadora) => {
    setTransportadoraEditando(transportadora);
    setFormData({
      nome: transportadora.nome,
      cnpj: transportadora.cnpj,
      inscricaoEstadual: transportadora.inscricaoEstadual || "",
      cep: transportadora.cep,
      logradouro: transportadora.logradouro,
      numero: transportadora.numero,
      bairro: transportadora.bairro,
      cidade: transportadora.cidade,
      uf: transportadora.uf,
      telefone: transportadora.telefone,
      responsavel: transportadora.responsavel,
      ativo: transportadora.ativo,
    });
    setIsEditarTransportadoraOpen(true);
  };

  // Salvar nova transportadora
  const salvarNovaTransportadora = () => {
    // Validações
    if (!formData.nome || !formData.cnpj) {
      toast({
        title: "Erro",
        description: "Nome e CNPJ são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!validarCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "CNPJ inválido",
        variant: "destructive",
      });
      return;
    }

    const novaTransportadora: Transportadora = {
      id: transportadoras.length + 1,
      ...formData,
      vinculada: false,
    };

    setTransportadoras([...transportadoras, novaTransportadora]);
    setIsNovaTransportadoraOpen(false);
    toast({
      title: "Sucesso",
      description: "Transportadora cadastrada com sucesso",
    });
  };

  // Atualizar transportadora
  const atualizarTransportadora = () => {
    if (!transportadoraEditando) return;

    if (!formData.nome || !formData.cnpj) {
      toast({
        title: "Erro",
        description: "Nome e CNPJ são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!validarCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "CNPJ inválido",
        variant: "destructive",
      });
      return;
    }

    // Se está tentando desativar e está vinculada
    if (!formData.ativo && transportadoraEditando.vinculada) {
      setAlertaDesativacao({
        open: true,
        transportadora: transportadoraEditando,
      });
      return;
    }

    setTransportadoras(
      transportadoras.map((t) =>
        t.id === transportadoraEditando.id
          ? { ...t, ...formData }
          : t
      )
    );

    setIsEditarTransportadoraOpen(false);
    setTransportadoraEditando(null);
    toast({
      title: "Sucesso",
      description: "Transportadora atualizada",
    });
  };

  // Confirmar desativação com aviso
  const confirmarDesativacao = () => {
    if (!transportadoraEditando) return;

    setTransportadoras(
      transportadoras.map((t) =>
        t.id === transportadoraEditando.id
          ? { ...t, ...formData }
          : t
      )
    );

    setAlertaDesativacao({ open: false, transportadora: null });
    setIsEditarTransportadoraOpen(false);
    setTransportadoraEditando(null);
    toast({
      title: "Transportadora desativada",
      description: "A transportadora foi desativada com sucesso",
    });
  };

  // Alternar status
  const alternarStatus = (transportadora: Transportadora) => {
    if (transportadora.ativo && transportadora.vinculada) {
      setAlertaDesativacao({
        open: true,
        transportadora,
      });
      return;
    }

    setTransportadoras(
      transportadoras.map((t) =>
        t.id === transportadora.id
          ? { ...t, ativo: !t.ativo }
          : t
      )
    );

    toast({
      title: transportadora.ativo ? "Desativada" : "Ativada",
      description: `Transportadora ${transportadora.ativo ? "desativada" : "ativada"} com sucesso`,
    });
  };

  // Confirmar exclusão
  const confirmarExcluir = (transportadora: Transportadora) => {
    if (transportadora.vinculada) {
      toast({
        title: "Não é possível excluir",
        description: "Esta transportadora está vinculada a movimentações",
        variant: "destructive",
      });
      return;
    }

    setConfirmacaoExclusao({
      open: true,
      transportadora,
    });
  };

  const excluirTransportadora = () => {
    if (!confirmacaoExclusao.transportadora) return;

    setTransportadoras(
      transportadoras.filter((t) => t.id !== confirmacaoExclusao.transportadora!.id)
    );

    setConfirmacaoExclusao({ open: false, transportadora: null });
    toast({
      title: "Sucesso",
      description: "Transportadora excluída",
    });
  };

  // Ordenação
  const ordenarPor = (campo: "nome" | "cnpj" | "cidade") => {
    setOrdenacao({
      campo,
      direcao:
        ordenacao.campo === campo && ordenacao.direcao === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Lista de UFs
  const ufs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  // Filtrar e ordenar
  const transportadorasFiltradas = transportadoras
    .filter((t) => {
      const matchPesquisa =
        filtroPesquisa === "" ||
        t.nome.toLowerCase().includes(filtroPesquisa.toLowerCase()) ||
        t.cnpj.includes(filtroPesquisa);
      const matchStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativo" && t.ativo) ||
        (filtroStatus === "inativo" && !t.ativo);
      const matchUF =
        filtroUF === "todos" || t.uf === filtroUF;

      return matchPesquisa && matchStatus && matchUF;
    })
    .sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      
      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1;
      return 0;
    });

  // Paginação
  const totalPaginas = Math.ceil(transportadorasFiltradas.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const transportadorasPaginadas = transportadorasFiltradas.slice(indiceInicial, indiceFinal);

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Transportadoras
          </h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie transportadoras utilizadas nas suas operações fiscais e de vendas.
          </p>
        </div>
        <Button
          onClick={abrirNovaTransportadora}
          style={{ backgroundColor: "#FF8A00" }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transportadora
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Transportadoras Cadastradas
          </CardTitle>
          <CardDescription>
            Lista completa de transportadoras parceiras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou CNPJ"
                value={filtroPesquisa}
                onChange={(e) => {
                  setFiltroPesquisa(e.target.value);
                  setPaginaAtual(1);
                }}
                className="pl-9"
              />
            </div>

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
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="ativo">Ativas</SelectItem>
                <SelectItem value="inativo">Inativas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtroUF}
              onValueChange={(value) => {
                setFiltroUF(value);
                setPaginaAtual(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estados</SelectItem>
                {ufs.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contador */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total: {transportadorasFiltradas.length} transportadora(s)</span>
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
                    onClick={() => ordenarPor("nome")}
                  >
                    <div className="flex items-center gap-2">
                      Nome da Transportadora
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("cnpj")}
                  >
                    <div className="flex items-center gap-2">
                      CNPJ
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("cidade")}
                  >
                    <div className="flex items-center gap-2">
                      Cidade / UF
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportadorasPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma transportadora encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transportadorasPaginadas.map((transportadora) => (
                    <TableRow
                      key={transportadora.id}
                      className={!transportadora.ativo ? "opacity-50" : ""}
                    >
                      <TableCell className="font-medium">
                        {transportadora.nome}
                      </TableCell>
                      <TableCell>{transportadora.cnpj}</TableCell>
                      <TableCell>
                        {transportadora.cidade} / {transportadora.uf}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: transportadora.ativo ? "#22C55E" : "#EF4444",
                            color: "white",
                          }}
                        >
                          {transportadora.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirEditarTransportadora(transportadora)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alternarStatus(transportadora)}
                            title={transportadora.ativo ? "Desativar" : "Ativar"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmarExcluir(transportadora)}
                            title="Excluir"
                            disabled={transportadora.vinculada}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Modal: Nova Transportadora */}
      <Dialog open={isNovaTransportadoraOpen} onOpenChange={setIsNovaTransportadoraOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Transportadora</DialogTitle>
            <DialogDescription>
              Cadastre uma nova transportadora no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nome">
                  Nome da Transportadora <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Transportadora Rápida Ltda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: aplicarMascaraCNPJ(e.target.value) })
                  }
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) =>
                    setFormData({ ...formData, inscricaoEstadual: e.target.value })
                  }
                  placeholder="000.000.000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: aplicarMascaraCEP(e.target.value) })
                  }
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  placeholder="Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Select
                  value={formData.uf}
                  onValueChange={(value) => setFormData({ ...formData, uf: value })}
                >
                  <SelectTrigger id="uf">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: aplicarMascaraTelefone(e.target.value) })
                  }
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do contato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.ativo ? "ativo" : "inativo"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ativo: value === "ativo" })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNovaTransportadoraOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarNovaTransportadora}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Transportadora */}
      <Dialog open={isEditarTransportadoraOpen} onOpenChange={setIsEditarTransportadoraOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Transportadora</DialogTitle>
            <DialogDescription>
              Atualize os dados da transportadora
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-nome">
                  Nome da Transportadora <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Transportadora Rápida Ltda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cnpj">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-cnpj"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: aplicarMascaraCNPJ(e.target.value) })
                  }
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="edit-inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) =>
                    setFormData({ ...formData, inscricaoEstadual: e.target.value })
                  }
                  placeholder="000.000.000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cep">CEP</Label>
                <Input
                  id="edit-cep"
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: aplicarMascaraCEP(e.target.value) })
                  }
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-logradouro">Logradouro</Label>
                <Input
                  id="edit-logradouro"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-numero">Número</Label>
                <Input
                  id="edit-numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bairro">Bairro</Label>
                <Input
                  id="edit-bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  placeholder="Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cidade">Cidade</Label>
                <Input
                  id="edit-cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-uf">UF</Label>
                <Select
                  value={formData.uf}
                  onValueChange={(value) => setFormData({ ...formData, uf: value })}
                >
                  <SelectTrigger id="edit-uf">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone / WhatsApp</Label>
                <Input
                  id="edit-telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: aplicarMascaraTelefone(e.target.value) })
                  }
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-responsavel">Responsável</Label>
                <Input
                  id="edit-responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do contato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.ativo ? "ativo" : "inativo"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ativo: value === "ativo" })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditarTransportadoraOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={atualizarTransportadora}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Aviso de Desativação */}
      <AlertDialog
        open={alertaDesativacao.open}
        onOpenChange={(open) => setAlertaDesativacao({ ...alertaDesativacao, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Atenção: Transportadora Vinculada
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta transportadora está vinculada a movimentações. Desativá-la pode impedir
              operações futuras.
              <br />
              <br />
              Deseja continuar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setAlertaDesativacao({ open: false, transportadora: null })}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmarDesativacao}>
              Sim, desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Confirmação de Exclusão */}
      <AlertDialog
        open={confirmacaoExclusao.open}
        onOpenChange={(open) => setConfirmacaoExclusao({ ...confirmacaoExclusao, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transportadora{" "}
              <strong>{confirmacaoExclusao.transportadora?.nome}</strong>?
              <br />
              <br />
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmacaoExclusao({ open: false, transportadora: null })}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={excluirTransportadora}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transportadora;
