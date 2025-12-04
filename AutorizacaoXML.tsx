import { useState } from "react";
import {
  FileCheck,
  Plus,
  Pencil,
  Power,
  Trash2,
  Search,
  ArrowUpDown,
  AlertTriangle,
  Mail,
  Globe,
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

interface AutorizacaoXML {
  id: number;
  tipo: "E-mail" | "Sistema";
  identificacao: string;
  emailEndpoint: string;
  token?: string;
  descricao?: string;
  ativo: boolean;
  envioAutomatico: boolean;
}

const AutorizacaoXML = () => {
  const { toast } = useToast();

  // Estados
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoXML[]>([
    {
      id: 1,
      tipo: "E-mail",
      identificacao: "contador@exemplo.com.br",
      emailEndpoint: "contador@exemplo.com.br",
      descricao: "Contador da empresa",
      ativo: true,
      envioAutomatico: true,
    },
    {
      id: 2,
      tipo: "Sistema",
      identificacao: "ERP Integrado",
      emailEndpoint: "https://api.erp.com/nfe",
      token: "xxxxx-xxxxx-xxxxx",
      descricao: "Sistema ERP principal",
      ativo: true,
      envioAutomatico: true,
    },
    {
      id: 3,
      tipo: "E-mail",
      identificacao: "cliente@empresa.com.br",
      emailEndpoint: "cliente@empresa.com.br",
      descricao: "",
      ativo: false,
      envioAutomatico: false,
    },
    {
      id: 4,
      tipo: "Sistema",
      identificacao: "API Financeiro",
      emailEndpoint: "https://financeiro.api.com/xml",
      token: "yyyyy-yyyyy-yyyyy",
      descricao: "Integração com sistema financeiro",
      ativo: true,
      envioAutomatico: false,
    },
  ]);

  const [isNovaAutorizacaoOpen, setIsNovaAutorizacaoOpen] = useState(false);
  const [isEditarAutorizacaoOpen, setIsEditarAutorizacaoOpen] = useState(false);
  const [autorizacaoEditando, setAutorizacaoEditando] = useState<AutorizacaoXML | null>(null);
  const [alertaDesativacao, setAlertaDesativacao] = useState<{
    open: boolean;
    autorizacao: AutorizacaoXML | null;
  }>({ open: false, autorizacao: null });
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<{
    open: boolean;
    autorizacao: AutorizacaoXML | null;
  }>({ open: false, autorizacao: null });

  // Filtros
  const [filtroPesquisa, setFiltroPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<{
    campo: "tipo" | "identificacao" | "ativo";
    direcao: "asc" | "desc";
  }>({ campo: "identificacao", direcao: "asc" });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Form state
  const [formData, setFormData] = useState({
    tipo: "E-mail" as "E-mail" | "Sistema",
    identificacao: "",
    emailEndpoint: "",
    token: "",
    descricao: "",
    ativo: true,
  });

  // Validação de e-mail
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação de URL
  const validarURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Abrir modal de nova autorização
  const abrirNovaAutorizacao = () => {
    setFormData({
      tipo: "E-mail",
      identificacao: "",
      emailEndpoint: "",
      token: "",
      descricao: "",
      ativo: true,
    });
    setIsNovaAutorizacaoOpen(true);
  };

  // Abrir modal de edição
  const abrirEditarAutorizacao = (autorizacao: AutorizacaoXML) => {
    setAutorizacaoEditando(autorizacao);
    setFormData({
      tipo: autorizacao.tipo,
      identificacao: autorizacao.identificacao,
      emailEndpoint: autorizacao.emailEndpoint,
      token: autorizacao.token || "",
      descricao: autorizacao.descricao || "",
      ativo: autorizacao.ativo,
    });
    setIsEditarAutorizacaoOpen(true);
  };

  // Salvar nova autorização
  const salvarNovaAutorizacao = () => {
    // Validações
    if (!formData.identificacao) {
      toast({
        title: "Erro",
        description: "Identificação é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (formData.tipo === "E-mail") {
      if (!validarEmail(formData.emailEndpoint)) {
        toast({
          title: "Erro",
          description: "E-mail inválido",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!validarURL(formData.emailEndpoint)) {
        toast({
          title: "Erro",
          description: "URL inválida",
          variant: "destructive",
        });
        return;
      }
    }

    const novaAutorizacao: AutorizacaoXML = {
      id: autorizacoes.length + 1,
      tipo: formData.tipo,
      identificacao: formData.identificacao,
      emailEndpoint: formData.emailEndpoint,
      token: formData.token || undefined,
      descricao: formData.descricao || undefined,
      ativo: formData.ativo,
      envioAutomatico: false,
    };

    setAutorizacoes([...autorizacoes, novaAutorizacao]);
    setIsNovaAutorizacaoOpen(false);
    toast({
      title: "Sucesso",
      description: "Autorização adicionada com sucesso",
    });
  };

  // Atualizar autorização
  const atualizarAutorizacao = () => {
    if (!autorizacaoEditando) return;

    // Validações
    if (!formData.identificacao) {
      toast({
        title: "Erro",
        description: "Identificação é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (formData.tipo === "E-mail") {
      if (!validarEmail(formData.emailEndpoint)) {
        toast({
          title: "Erro",
          description: "E-mail inválido",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!validarURL(formData.emailEndpoint)) {
        toast({
          title: "Erro",
          description: "URL inválida",
          variant: "destructive",
        });
        return;
      }
    }

    // Se está tentando desativar e tem envio automático
    if (!formData.ativo && autorizacaoEditando.envioAutomatico) {
      setAlertaDesativacao({
        open: true,
        autorizacao: autorizacaoEditando,
      });
      return;
    }

    setAutorizacoes(
      autorizacoes.map((a) =>
        a.id === autorizacaoEditando.id
          ? {
              ...a,
              tipo: formData.tipo,
              identificacao: formData.identificacao,
              emailEndpoint: formData.emailEndpoint,
              token: formData.token || undefined,
              descricao: formData.descricao || undefined,
              ativo: formData.ativo,
            }
          : a
      )
    );

    setIsEditarAutorizacaoOpen(false);
    setAutorizacaoEditando(null);
    toast({
      title: "Sucesso",
      description: "Autorização atualizada",
    });
  };

  // Confirmar desativação com aviso
  const confirmarDesativacao = () => {
    if (!autorizacaoEditando) return;

    setAutorizacoes(
      autorizacoes.map((a) =>
        a.id === autorizacaoEditando.id
          ? {
              ...a,
              tipo: formData.tipo,
              identificacao: formData.identificacao,
              emailEndpoint: formData.emailEndpoint,
              token: formData.token || undefined,
              descricao: formData.descricao || undefined,
              ativo: formData.ativo,
            }
          : a
      )
    );

    setAlertaDesativacao({ open: false, autorizacao: null });
    setIsEditarAutorizacaoOpen(false);
    setAutorizacaoEditando(null);
    toast({
      title: "Autorização desativada",
      description: "O envio automático de XML foi interrompido",
    });
  };

  // Alternar status
  const alternarStatus = (autorizacao: AutorizacaoXML) => {
    if (autorizacao.ativo && autorizacao.envioAutomatico) {
      setAlertaDesativacao({
        open: true,
        autorizacao,
      });
      return;
    }

    setAutorizacoes(
      autorizacoes.map((a) =>
        a.id === autorizacao.id
          ? { ...a, ativo: !a.ativo }
          : a
      )
    );

    toast({
      title: autorizacao.ativo ? "Desativada" : "Ativada",
      description: `Autorização ${autorizacao.ativo ? "desativada" : "ativada"} com sucesso`,
    });
  };

  // Confirmar exclusão
  const confirmarExcluir = (autorizacao: AutorizacaoXML) => {
    setConfirmacaoExclusao({
      open: true,
      autorizacao,
    });
  };

  const excluirAutorizacao = () => {
    if (!confirmacaoExclusao.autorizacao) return;

    setAutorizacoes(
      autorizacoes.filter((a) => a.id !== confirmacaoExclusao.autorizacao!.id)
    );

    setConfirmacaoExclusao({ open: false, autorizacao: null });
    toast({
      title: "Sucesso",
      description: "Autorização excluída",
    });
  };

  // Ordenação
  const ordenarPor = (campo: "tipo" | "identificacao" | "ativo") => {
    setOrdenacao({
      campo,
      direcao:
        ordenacao.campo === campo && ordenacao.direcao === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Filtrar e ordenar
  const autorizacoesFiltradas = autorizacoes
    .filter((a) => {
      const matchPesquisa =
        filtroPesquisa === "" ||
        a.identificacao.toLowerCase().includes(filtroPesquisa.toLowerCase()) ||
        a.emailEndpoint.toLowerCase().includes(filtroPesquisa.toLowerCase());
      const matchTipo =
        filtroTipo === "todos" || a.tipo === filtroTipo;
      const matchStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativo" && a.ativo) ||
        (filtroStatus === "inativo" && !a.ativo);

      return matchPesquisa && matchTipo && matchStatus;
    })
    .sort((a, b) => {
      if (ordenacao.campo === "ativo") {
        const valorA = a.ativo ? 1 : 0;
        const valorB = b.ativo ? 1 : 0;
        return ordenacao.direcao === "asc" ? valorA - valorB : valorB - valorA;
      }
      
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      
      if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1;
      return 0;
    });

  // Paginação
  const totalPaginas = Math.ceil(autorizacoesFiltradas.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const autorizacoesPaginadas = autorizacoesFiltradas.slice(indiceInicial, indiceFinal);

  // Atualizar campos ao mudar tipo
  const handleTipoChange = (novoTipo: "E-mail" | "Sistema") => {
    if (novoTipo === "E-mail") {
      setFormData({
        ...formData,
        tipo: novoTipo,
        emailEndpoint: formData.identificacao,
        token: "",
      });
    } else {
      setFormData({
        ...formData,
        tipo: novoTipo,
        emailEndpoint: "",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Autorização ao XML
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle quais destinatários, e-mails ou sistemas podem receber e consumir seus XMLs fiscais.
          </p>
        </div>
        <Button
          onClick={abrirNovaAutorizacao}
          style={{ backgroundColor: "#FF8A00" }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Autorização
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Destinatários Autorizados
          </CardTitle>
          <CardDescription>
            Gerencie os destinatários que podem acessar seus arquivos XML.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por identificação, e-mail ou endpoint"
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
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="E-mail">E-mail</SelectItem>
                <SelectItem value="Sistema">Sistema</SelectItem>
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
            <span>Total: {autorizacoesFiltradas.length} autorização(ões)</span>
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
                    onClick={() => ordenarPor("tipo")}
                  >
                    <div className="flex items-center gap-2">
                      Tipo
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("identificacao")}
                  >
                    <div className="flex items-center gap-2">
                      Identificação
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>E-mail / Endpoint</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => ordenarPor("ativo")}
                  >
                    <div className="flex items-center gap-2">
                      Situação
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autorizacoesPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma autorização encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  autorizacoesPaginadas.map((autorizacao) => (
                    <TableRow
                      key={autorizacao.id}
                      className={!autorizacao.ativo ? "opacity-50" : ""}
                    >
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor:
                              autorizacao.tipo === "E-mail" ? "#3BA3FF" : "#8A63FF",
                            color: "white",
                          }}
                        >
                          {autorizacao.tipo === "E-mail" ? (
                            <Mail className="h-3 w-3 mr-1 inline" />
                          ) : (
                            <Globe className="h-3 w-3 mr-1 inline" />
                          )}
                          {autorizacao.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {autorizacao.identificacao}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {autorizacao.emailEndpoint}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: autorizacao.ativo ? "#22C55E" : "#EF4444",
                            color: "white",
                          }}
                        >
                          {autorizacao.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirEditarAutorizacao(autorizacao)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alternarStatus(autorizacao)}
                            title={autorizacao.ativo ? "Desativar" : "Ativar"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmarExcluir(autorizacao)}
                            title="Excluir"
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

      {/* Modal: Nova Autorização */}
      <Dialog open={isNovaAutorizacaoOpen} onOpenChange={setIsNovaAutorizacaoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Autorização</DialogTitle>
            <DialogDescription>
              Cadastre um novo destinatário autorizado a receber XMLs fiscais
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo de autorização <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={handleTipoChange}
              >
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-mail">E-mail</SelectItem>
                  <SelectItem value="Sistema">Sistema (API)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo === "E-mail" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-mail <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.identificacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identificacao: e.target.value,
                        emailEndpoint: e.target.value,
                      })
                    }
                    placeholder="exemplo@email.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-email">Descrição opcional</Label>
                  <Textarea
                    id="descricao-email"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Ex: Contador da empresa"
                    rows={2}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sistema">
                    Nome do Sistema / Identificador <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sistema"
                    value={formData.identificacao}
                    onChange={(e) =>
                      setFormData({ ...formData, identificacao: e.target.value })
                    }
                    placeholder="Ex: ERP Integrado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint">
                    Endpoint (URL da API) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endpoint"
                    value={formData.emailEndpoint}
                    onChange={(e) =>
                      setFormData({ ...formData, emailEndpoint: e.target.value })
                    }
                    placeholder="https://api.exemplo.com/nfe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Token ou Chave de acesso</Label>
                  <Input
                    id="token"
                    type="password"
                    value={formData.token}
                    onChange={(e) =>
                      setFormData({ ...formData, token: e.target.value })
                    }
                    placeholder="Token de autenticação (opcional)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Será armazenado de forma segura
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-sistema">Descrição opcional</Label>
                  <Textarea
                    id="descricao-sistema"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Ex: Sistema ERP principal"
                    rows={2}
                  />
                </div>
              </>
            )}

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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNovaAutorizacaoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarNovaAutorizacao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Autorização */}
      <Dialog open={isEditarAutorizacaoOpen} onOpenChange={setIsEditarAutorizacaoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Autorização</DialogTitle>
            <DialogDescription>
              Atualize os dados do destinatário autorizado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tipo">
                Tipo de autorização <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={handleTipoChange}
              >
                <SelectTrigger id="edit-tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-mail">E-mail</SelectItem>
                  <SelectItem value="Sistema">Sistema (API)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo === "E-mail" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">
                    E-mail <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.identificacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identificacao: e.target.value,
                        emailEndpoint: e.target.value,
                      })
                    }
                    placeholder="exemplo@email.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-descricao-email">Descrição opcional</Label>
                  <Textarea
                    id="edit-descricao-email"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Ex: Contador da empresa"
                    rows={2}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-sistema">
                    Nome do Sistema / Identificador <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-sistema"
                    value={formData.identificacao}
                    onChange={(e) =>
                      setFormData({ ...formData, identificacao: e.target.value })
                    }
                    placeholder="Ex: ERP Integrado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-endpoint">
                    Endpoint (URL da API) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-endpoint"
                    value={formData.emailEndpoint}
                    onChange={(e) =>
                      setFormData({ ...formData, emailEndpoint: e.target.value })
                    }
                    placeholder="https://api.exemplo.com/nfe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-token">Token ou Chave de acesso</Label>
                  <Input
                    id="edit-token"
                    type="password"
                    value={formData.token}
                    onChange={(e) =>
                      setFormData({ ...formData, token: e.target.value })
                    }
                    placeholder="Token de autenticação (opcional)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Será armazenado de forma segura
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-descricao-sistema">Descrição opcional</Label>
                  <Textarea
                    id="edit-descricao-sistema"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Ex: Sistema ERP principal"
                    rows={2}
                  />
                </div>
              </>
            )}

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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditarAutorizacaoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={atualizarAutorizacao}>Salvar</Button>
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
              Atenção: Envio Automático Ativo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Desativar este destinatário pode impedir o envio automático de XML para ele.
              <br />
              <br />
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setAlertaDesativacao({ open: false, autorizacao: null })}
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
              Tem certeza que deseja excluir a autorização para{" "}
              <strong>{confirmacaoExclusao.autorizacao?.identificacao}</strong>?
              <br />
              <br />
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmacaoExclusao({ open: false, autorizacao: null })}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={excluirAutorizacao}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AutorizacaoXML;
