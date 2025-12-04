import { useState } from "react";
import {
  Settings,
  Package,
  FileText,
  Plus,
  Pencil,
  FileCheck,
  DollarSign,
  CheckCircle2,
  Circle,
  Building2,
  MapPin,
  Phone,
  Shield,
  Clock,
  ShoppingCart,
  Percent,
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

interface RegraPadrao {
  id: number;
  tipo: string;
  descricao: string;
  situacao: "Ativo" | "Inativo";
  ultimaAtualizacao: string;
}

interface RegraProduto {
  id: number;
  ncm: string;
  cest: string;
  exTipi: string;
  descricao: string;
  situacao: "Ativo" | "Inativo";
  regraPadraoId?: number;
}

interface ChecklistItem {
  id: string;
  nome: string;
  concluido: boolean;
  categoria: "empresa" | "endereco" | "fiscal" | "cadastros";
  icone: React.ReactNode;
  valor?: string;
}

const Parametrizacao = () => {
  const { toast } = useToast();

  // Estados - Regras Padrão
  const [regrasPadrao, setRegrasPadrao] = useState<RegraPadrao[]>([
    {
      id: 1,
      tipo: "ICMS Padrão",
      descricao: "Alíquota padrão para operações internas/interestaduais",
      situacao: "Ativo",
      ultimaAtualizacao: "15/03/2025",
    },
    {
      id: 2,
      tipo: "IPI Industrial",
      descricao: "Imposto sobre produtos industrializados",
      situacao: "Ativo",
      ultimaAtualizacao: "10/03/2025",
    },
    {
      id: 3,
      tipo: "PIS/COFINS",
      descricao: "Recolhimento federal",
      situacao: "Ativo",
      ultimaAtualizacao: "08/03/2025",
    },
    {
      id: 4,
      tipo: "ISS Prestação de Serviços",
      descricao: "Regras municipais",
      situacao: "Ativo",
      ultimaAtualizacao: "05/03/2025",
    },
    {
      id: 5,
      tipo: "Simples Nacional",
      descricao: "Tabelas por anexo",
      situacao: "Ativo",
      ultimaAtualizacao: "02/03/2025",
    },
    {
      id: 6,
      tipo: "Substituição Tributária",
      descricao: "MVA, retenção",
      situacao: "Ativo",
      ultimaAtualizacao: "28/02/2025",
    },
  ]);

  // Estados - Regras de Produto
  const [regrasProduto, setRegrasProduto] = useState<RegraProduto[]>([
    {
      id: 1,
      ncm: "8471.30.12",
      cest: "21.001.00",
      exTipi: "01",
      descricao: "Produto monofásico - PIS/COFINS",
      situacao: "Ativo",
      regraPadraoId: 3,
    },
    {
      id: 2,
      ncm: "2203.00.00",
      cest: "03.002.00",
      exTipi: "",
      descricao: "Substituição tributária - Bebidas",
      situacao: "Ativo",
      regraPadraoId: 6,
    },
    {
      id: 3,
      ncm: "8504.40.90",
      cest: "21.045.00",
      exTipi: "",
      descricao: "Isenção ICMS zona franca",
      situacao: "Inativo",
      regraPadraoId: 1,
    },
  ]);

  // Estados dos modais
  const [isNovaRegraModalOpen, setIsNovaRegraModalOpen] = useState(false);
  const [isEditarRegraModalOpen, setIsEditarRegraModalOpen] = useState(false);
  const [regraEditando, setRegraEditando] = useState<RegraPadrao | null>(null);

  const [isNovoProdutoModalOpen, setIsNovoProdutoModalOpen] = useState(false);
  const [isEditarProdutoModalOpen, setIsEditarProdutoModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<RegraProduto | null>(null);

  // Form states
  const [formRegra, setFormRegra] = useState({
    tipo: "",
    descricao: "",
    situacao: "Ativo" as "Ativo" | "Inativo",
  });

  const [formProduto, setFormProduto] = useState({
    ncm: "",
    cest: "",
    exTipi: "",
    descricao: "",
    situacao: "Ativo" as "Ativo" | "Inativo",
    regraPadraoId: "",
  });

  // Funções - Regras Padrão
  const abrirNovaRegra = () => {
    setFormRegra({
      tipo: "",
      descricao: "",
      situacao: "Ativo",
    });
    setIsNovaRegraModalOpen(true);
  };

  const abrirEditarRegra = (regra: RegraPadrao) => {
    setRegraEditando(regra);
    setFormRegra({
      tipo: regra.tipo,
      descricao: regra.descricao,
      situacao: regra.situacao,
    });
    setIsEditarRegraModalOpen(true);
  };

  const salvarNovaRegra = () => {
    if (!formRegra.tipo || !formRegra.descricao) {
      toast({
        title: "Erro",
        description: "Tipo e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novaRegra: RegraPadrao = {
      id: regrasPadrao.length + 1,
      tipo: formRegra.tipo,
      descricao: formRegra.descricao,
      situacao: formRegra.situacao,
      ultimaAtualizacao: new Date().toLocaleDateString("pt-BR"),
    };

    setRegrasPadrao([...regrasPadrao, novaRegra]);
    setIsNovaRegraModalOpen(false);
    toast({
      title: "Sucesso",
      description: "Regra padrão cadastrada com sucesso",
    });
  };

  const atualizarRegra = () => {
    if (!regraEditando) return;

    if (!formRegra.tipo || !formRegra.descricao) {
      toast({
        title: "Erro",
        description: "Tipo e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setRegrasPadrao(
      regrasPadrao.map((r) =>
        r.id === regraEditando.id
          ? {
              ...r,
              tipo: formRegra.tipo,
              descricao: formRegra.descricao,
              situacao: formRegra.situacao,
              ultimaAtualizacao: new Date().toLocaleDateString("pt-BR"),
            }
          : r
      )
    );

    setIsEditarRegraModalOpen(false);
    setRegraEditando(null);
    toast({
      title: "Sucesso",
      description: "Regra padrão atualizada",
    });
  };

  // Funções - Regras de Produto
  const abrirNovoProduto = () => {
    setFormProduto({
      ncm: "",
      cest: "",
      exTipi: "",
      descricao: "",
      situacao: "Ativo",
      regraPadraoId: "",
    });
    setIsNovoProdutoModalOpen(true);
  };

  const abrirEditarProduto = (produto: RegraProduto) => {
    setProdutoEditando(produto);
    setFormProduto({
      ncm: produto.ncm,
      cest: produto.cest,
      exTipi: produto.exTipi,
      descricao: produto.descricao,
      situacao: produto.situacao,
      regraPadraoId: produto.regraPadraoId?.toString() || "",
    });
    setIsEditarProdutoModalOpen(true);
  };

  const salvarNovoProduto = () => {
    if (!formProduto.ncm || !formProduto.descricao) {
      toast({
        title: "Erro",
        description: "NCM e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novoProduto: RegraProduto = {
      id: regrasProduto.length + 1,
      ncm: formProduto.ncm,
      cest: formProduto.cest,
      exTipi: formProduto.exTipi,
      descricao: formProduto.descricao,
      situacao: formProduto.situacao,
      regraPadraoId: formProduto.regraPadraoId ? parseInt(formProduto.regraPadraoId) : undefined,
    };

    setRegrasProduto([...regrasProduto, novoProduto]);
    setIsNovoProdutoModalOpen(false);
    toast({
      title: "Sucesso",
      description: "Regra de produto cadastrada com sucesso",
    });
  };

  const atualizarProduto = () => {
    if (!produtoEditando) return;

    if (!formProduto.ncm || !formProduto.descricao) {
      toast({
        title: "Erro",
        description: "NCM e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setRegrasProduto(
      regrasProduto.map((p) =>
        p.id === produtoEditando.id
          ? {
              ...p,
              ncm: formProduto.ncm,
              cest: formProduto.cest,
              exTipi: formProduto.exTipi,
              descricao: formProduto.descricao,
              situacao: formProduto.situacao,
              regraPadraoId: formProduto.regraPadraoId ? parseInt(formProduto.regraPadraoId) : undefined,
            }
          : p
      )
    );

    setIsEditarProdutoModalOpen(false);
    setProdutoEditando(null);
    toast({
      title: "Sucesso",
      description: "Regra de produto atualizada",
    });
  };

  // Outras Parametrizações
  const outrasParametrizacoes = [
    {
      nome: "Séries de Documentos Fiscais",
      descricao: "Configure série e numeração de NF-e, NFC-e, NFS-e",
      icone: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      nome: "CFOP Padrão",
      descricao: "Defina CFOP padrão por tipo de operação",
      icone: <FileCheck className="h-5 w-5 text-primary" />,
    },
    {
      nome: "Códigos de Situação Tributária",
      descricao: "Mapeie CST/CSOSN utilizados no sistema",
      icone: <DollarSign className="h-5 w-5 text-primary" />,
    },
  ];

  // Estados - Checklist de Configurações
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Dados da Empresa
    { id: "razao_social", nome: "Razão Social", concluido: true, categoria: "empresa", icone: <Building2 className="h-4 w-4" />, valor: "Simplix Tecnologia LTDA" },
    { id: "nome_fantasia", nome: "Nome Fantasia", concluido: true, categoria: "empresa", icone: <Building2 className="h-4 w-4" />, valor: "Simplix" },
    { id: "cnpj", nome: "CNPJ", concluido: true, categoria: "empresa", icone: <FileText className="h-4 w-4" />, valor: "12.345.678/0001-90" },
    { id: "inscricao_estadual", nome: "Inscrição Estadual", concluido: false, categoria: "empresa", icone: <FileText className="h-4 w-4" /> },
    { id: "regime_federal", nome: "Regime de Tributação Federal", concluido: true, categoria: "empresa", icone: <DollarSign className="h-4 w-4" />, valor: "Simples Nacional" },
    { id: "regime_estadual", nome: "Regime de Tributação Estadual", concluido: false, categoria: "empresa", icone: <DollarSign className="h-4 w-4" /> },
    
    // Endereço
    { id: "logradouro", nome: "Tipo e Nome do Logradouro", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "Rua das Flores" },
    { id: "numero", nome: "Número", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "123" },
    { id: "bairro", nome: "Bairro", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "Centro" },
    { id: "cep", nome: "CEP", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "12345-678" },
    { id: "municipio", nome: "Município", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "São Paulo" },
    { id: "estado", nome: "Estado", concluido: true, categoria: "endereco", icone: <MapPin className="h-4 w-4" />, valor: "SP" },
    { id: "telefone", nome: "Contato Telefônico", concluido: false, categoria: "endereco", icone: <Phone className="h-4 w-4" /> },
    
    // Fiscal
    { id: "certificado_digital", nome: "Certificado Digital A1 (ICP-Brasil)", concluido: true, categoria: "fiscal", icone: <Shield className="h-4 w-4" />, valor: "Instalado" },
    { id: "status_certificado", nome: "Status do Certificado", concluido: true, categoria: "fiscal", icone: <Clock className="h-4 w-4" />, valor: "Válido até 20/12/2025" },
    { id: "csc", nome: "Código de Segurança do Contribuinte (CSC)", concluido: false, categoria: "fiscal", icone: <Shield className="h-4 w-4" /> },
    { id: "cscid", nome: "CSCid", concluido: false, categoria: "fiscal", icone: <Shield className="h-4 w-4" /> },
    
    // Cadastros
    { id: "catalogo_produtos", nome: "Catálogo de Produtos", concluido: true, categoria: "cadastros", icone: <ShoppingCart className="h-4 w-4" />, valor: "45 produtos cadastrados" },
    { id: "figuras_tributarias", nome: "Cadastro de Figuras Tributárias", concluido: true, categoria: "cadastros", icone: <FileCheck className="h-4 w-4" />, valor: "6 figuras cadastradas" },
    { id: "cadastro_produtos", nome: "Cadastro de Produtos", concluido: true, categoria: "cadastros", icone: <Package className="h-4 w-4" />, valor: "45 produtos" },
    { id: "aliquota_icms", nome: "Alíquota de ICMS para Simples Nacional", concluido: false, categoria: "cadastros", icone: <Percent className="h-4 w-4" /> },
  ]);

  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [checklistItemEditando, setChecklistItemEditando] = useState<ChecklistItem | null>(null);
  const [checklistFormValue, setChecklistFormValue] = useState("");

  const abrirChecklistModal = (item: ChecklistItem) => {
    setChecklistItemEditando(item);
    setChecklistFormValue(item.valor || "");
    setChecklistModalOpen(true);
  };

  const salvarChecklistItem = () => {
    if (!checklistItemEditando) return;

    if (!checklistFormValue.trim()) {
      toast({
        title: "Erro",
        description: "Campo obrigatório",
        variant: "destructive",
      });
      return;
    }

    setChecklist(
      checklist.map((item) =>
        item.id === checklistItemEditando.id
          ? { ...item, concluido: true, valor: checklistFormValue }
          : item
      )
    );

    setChecklistModalOpen(false);
    setChecklistItemEditando(null);
    setChecklistFormValue("");
    toast({
      title: "Sucesso",
      description: "Configuração atualizada com sucesso",
    });
  };

  const categoriasChecklist = [
    { id: "empresa", nome: "Dados da Empresa", icone: <Building2 className="h-5 w-5" /> },
    { id: "endereco", nome: "Endereço", icone: <MapPin className="h-5 w-5" /> },
    { id: "fiscal", nome: "Configurações Fiscais", icone: <Shield className="h-5 w-5" /> },
    { id: "cadastros", nome: "Cadastros", icone: <ShoppingCart className="h-5 w-5" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Parametrização Geral
        </h1>
        <p className="text-muted-foreground">
          Configure regras padrão de impostos, documentos e integrações fiscais do sistema Simplix.
        </p>
      </div>

      {/* BLOCO A: Regras Padrão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Regras Padrão
            </CardTitle>
            <CardDescription>
              Configure regras fiscais e tributárias gerais aplicadas ao sistema
            </CardDescription>
          </div>
          <Button onClick={abrirNovaRegra}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra Padrão
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Regra</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regrasPadrao.map((regra) => (
                <TableRow key={regra.id}>
                  <TableCell className="font-medium">{regra.tipo}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {regra.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={regra.situacao === "Ativo" ? "default" : "secondary"}
                    >
                      {regra.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell>{regra.ultimaAtualizacao}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirEditarRegra(regra)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BLOCO B: Regras Específicas por Produto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Regras Específicas por Produto
            </CardTitle>
            <CardDescription>
              Configure regras tributárias específicas para NCM/CEST/EX TIPI de produtos individuais
            </CardDescription>
          </div>
          <Button onClick={abrirNovoProduto}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra de Produto
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NCM</TableHead>
                <TableHead>CEST</TableHead>
                <TableHead>EX TIPI</TableHead>
                <TableHead>Descrição da Regra</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regrasProduto.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.ncm}</TableCell>
                  <TableCell>{produto.cest}</TableCell>
                  <TableCell>{produto.exTipi || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {produto.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={produto.situacao === "Ativo" ? "default" : "secondary"}
                    >
                      {produto.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirEditarProduto(produto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BLOCO C: Outras Parametrizações Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Outras Parametrizações Fiscais
          </CardTitle>
          <CardDescription>
            Acesse configurações fiscais complementares do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {outrasParametrizacoes.map((param, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {param.icone}
                  <div>
                    <p className="font-medium text-foreground">{param.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {param.descricao}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO CHECKLIST: Checklist de Configurações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Checklist de Configurações da Empresa
          </CardTitle>
          <CardDescription>
            Acompanhe o status das configurações obrigatórias para o funcionamento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoriasChecklist.map((categoria) => {
            const itensCategoria = checklist.filter((item) => item.categoria === categoria.id);
            const concluidos = itensCategoria.filter((item) => item.concluido).length;
            const total = itensCategoria.length;
            
            return (
              <div key={categoria.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    {categoria.icone}
                    {categoria.nome}
                  </h3>
                  <Badge variant="outline">
                    {concluidos}/{total} concluídos
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {itensCategoria.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        p-4 border border-border rounded-lg transition-all cursor-pointer
                        ${item.concluido ? 'hover:bg-muted/30' : 'hover:bg-muted/50 border-primary/30'}
                      `}
                      onClick={() => abrirChecklistModal(item)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-0.5 ${item.concluido ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {item.concluido ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">
                              {item.nome}
                            </p>
                            {item.valor && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.valor}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          {item.concluido ? (
                            <Badge variant="default" className="text-xs">
                              Concluído
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Resumo Geral */}
          <div className="mt-6 p-4 border border-border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Progresso Geral</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {checklist.filter((i) => i.concluido).length} de {checklist.length} configurações concluídas
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {Math.round((checklist.filter((i) => i.concluido).length / checklist.length) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Completo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Nova Regra Padrão */}
      <Dialog open={isNovaRegraModalOpen} onOpenChange={setIsNovaRegraModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Regra Padrão</DialogTitle>
            <DialogDescription>
              Cadastre uma nova regra fiscal/tributária geral no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-regra">
                Tipo de Regra <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tipo-regra"
                value={formRegra.tipo}
                onChange={(e) =>
                  setFormRegra({ ...formRegra, tipo: e.target.value })
                }
                placeholder="Ex: ICMS Padrão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao-regra">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descricao-regra"
                value={formRegra.descricao}
                onChange={(e) =>
                  setFormRegra({ ...formRegra, descricao: e.target.value })
                }
                placeholder="Descreva a aplicação da regra"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="situacao-regra">Situação</Label>
              <Select
                value={formRegra.situacao}
                onValueChange={(value: "Ativo" | "Inativo") =>
                  setFormRegra({ ...formRegra, situacao: value })
                }
              >
                <SelectTrigger id="situacao-regra">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNovaRegraModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={salvarNovaRegra}>Salvar Regra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Regra Padrão */}
      <Dialog open={isEditarRegraModalOpen} onOpenChange={setIsEditarRegraModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Regra Padrão</DialogTitle>
            <DialogDescription>
              Atualize os dados da regra fiscal/tributária
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tipo-regra">
                Tipo de Regra <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-tipo-regra"
                value={formRegra.tipo}
                onChange={(e) =>
                  setFormRegra({ ...formRegra, tipo: e.target.value })
                }
                placeholder="Ex: ICMS Padrão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descricao-regra">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-descricao-regra"
                value={formRegra.descricao}
                onChange={(e) =>
                  setFormRegra({ ...formRegra, descricao: e.target.value })
                }
                placeholder="Descreva a aplicação da regra"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-situacao-regra">Situação</Label>
              <Select
                value={formRegra.situacao}
                onValueChange={(value: "Ativo" | "Inativo") =>
                  setFormRegra({ ...formRegra, situacao: value })
                }
              >
                <SelectTrigger id="edit-situacao-regra">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditarRegraModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={atualizarRegra}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Nova Regra de Produto */}
      <Dialog open={isNovoProdutoModalOpen} onOpenChange={setIsNovoProdutoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Regra de Produto</DialogTitle>
            <DialogDescription>
              Cadastre uma regra tributária específica para um produto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ncm">
                  NCM <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ncm"
                  value={formProduto.ncm}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, ncm: e.target.value })
                  }
                  placeholder="0000.00.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cest">CEST</Label>
                <Input
                  id="cest"
                  value={formProduto.cest}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, cest: e.target.value })
                  }
                  placeholder="00.000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ex-tipi">EX TIPI</Label>
                <Input
                  id="ex-tipi"
                  value={formProduto.exTipi}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, exTipi: e.target.value })
                  }
                  placeholder="00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="regra-vinculada">Regra Padrão Vinculada</Label>
              <Select
                value={formProduto.regraPadraoId}
                onValueChange={(value) =>
                  setFormProduto({ ...formProduto, regraPadraoId: value })
                }
              >
                <SelectTrigger id="regra-vinculada">
                  <SelectValue placeholder="Selecione uma regra" />
                </SelectTrigger>
                <SelectContent>
                  {regrasPadrao.map((regra) => (
                    <SelectItem key={regra.id} value={regra.id.toString()}>
                      {regra.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao-produto">
                Descrição da Regra <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descricao-produto"
                value={formProduto.descricao}
                onChange={(e) =>
                  setFormProduto({ ...formProduto, descricao: e.target.value })
                }
                placeholder="Ex: Produto monofásico"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="situacao-produto">Situação</Label>
              <Select
                value={formProduto.situacao}
                onValueChange={(value: "Ativo" | "Inativo") =>
                  setFormProduto({ ...formProduto, situacao: value })
                }
              >
                <SelectTrigger id="situacao-produto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNovoProdutoModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={salvarNovoProduto}>Salvar Regra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Regra de Produto */}
      <Dialog open={isEditarProdutoModalOpen} onOpenChange={setIsEditarProdutoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Regra de Produto</DialogTitle>
            <DialogDescription>
              Atualize os dados da regra tributária do produto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ncm">
                  NCM <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-ncm"
                  value={formProduto.ncm}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, ncm: e.target.value })
                  }
                  placeholder="0000.00.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cest">CEST</Label>
                <Input
                  id="edit-cest"
                  value={formProduto.cest}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, cest: e.target.value })
                  }
                  placeholder="00.000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ex-tipi">EX TIPI</Label>
                <Input
                  id="edit-ex-tipi"
                  value={formProduto.exTipi}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, exTipi: e.target.value })
                  }
                  placeholder="00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-regra-vinculada">Regra Padrão Vinculada</Label>
              <Select
                value={formProduto.regraPadraoId}
                onValueChange={(value) =>
                  setFormProduto({ ...formProduto, regraPadraoId: value })
                }
              >
                <SelectTrigger id="edit-regra-vinculada">
                  <SelectValue placeholder="Selecione uma regra" />
                </SelectTrigger>
                <SelectContent>
                  {regrasPadrao.map((regra) => (
                    <SelectItem key={regra.id} value={regra.id.toString()}>
                      {regra.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descricao-produto">
                Descrição da Regra <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-descricao-produto"
                value={formProduto.descricao}
                onChange={(e) =>
                  setFormProduto({ ...formProduto, descricao: e.target.value })
                }
                placeholder="Ex: Produto monofásico"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-situacao-produto">Situação</Label>
              <Select
                value={formProduto.situacao}
                onValueChange={(value: "Ativo" | "Inativo") =>
                  setFormProduto({ ...formProduto, situacao: value })
                }
              >
                <SelectTrigger id="edit-situacao-produto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditarProdutoModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={atualizarProduto}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Item do Checklist */}
      <Dialog open={checklistModalOpen} onOpenChange={setChecklistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {checklistItemEditando?.concluido ? "Editar" : "Preencher"} Configuração
            </DialogTitle>
            <DialogDescription>
              {checklistItemEditando?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checklist-valor">
                Valor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checklist-valor"
                value={checklistFormValue}
                onChange={(e) => setChecklistFormValue(e.target.value)}
                placeholder={`Digite ${checklistItemEditando?.nome.toLowerCase()}`}
              />
              <p className="text-xs text-muted-foreground">
                Preencha este campo para marcar a configuração como concluída
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setChecklistModalOpen(false);
                setChecklistItemEditando(null);
                setChecklistFormValue("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={salvarChecklistItem}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parametrizacao;
