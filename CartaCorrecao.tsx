import { useState } from "react";
import { Bell, HelpCircle, FileText, Filter, Search, Eye, FileEdit, History, CheckCircle, XCircle, Clock, AlertTriangle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NotaFiscal = {
  id: string;
  dataEmissao: string;
  numero: string;
  serie: string;
  modelo: "NF-e" | "NFC-e";
  cliente: string;
  cpfCnpj: string;
  valor: number;
  statusSefaz: "Autorizada" | "Cancelada" | "Denegada";
  statusCarta: "Nenhuma" | "Rascunho" | "Enviada" | "Autorizada" | "Rejeitada" | "Cancelada";
  chaveAcesso: string;
};

type CartaCorrecao = {
  id: string;
  dataHora: string;
  usuario: string;
  correcao: string;
  protocolo: string;
  status: "Rascunho" | "Enviada" | "Autorizada" | "Rejeitada" | "Cancelada";
};

const CartaCorrecao = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroUf, setFiltroUf] = useState("todas");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [numeroNf, setNumeroNf] = useState("");
  const [serieNf, setSerieNf] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  
  const [modalEmissaoOpen, setModalEmissaoOpen] = useState(false);
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState<NotaFiscal | null>(null);
  const [tipoAlteracao, setTipoAlteracao] = useState("");
  const [textoCorrecao, setTextoCorrecao] = useState("");
  const [concordoRegras, setConcordoRegras] = useState(false);
  const [resultadoSefaz, setResultadoSefaz] = useState<any>(null);

  // Mock data
  const notas: NotaFiscal[] = [
    {
      id: "1",
      dataEmissao: "15/01/2025",
      numero: "4532",
      serie: "1",
      modelo: "NF-e",
      cliente: "João Silva",
      cpfCnpj: "123.456.789-00",
      valor: 1250.00,
      statusSefaz: "Autorizada",
      statusCarta: "Nenhuma",
      chaveAcesso: "35250112345678901234550010000453210000453211"
    },
    {
      id: "2",
      dataEmissao: "14/01/2025",
      numero: "4531",
      serie: "1",
      modelo: "NFC-e",
      cliente: "Maria Santos",
      cpfCnpj: "987.654.321-00",
      valor: 850.50,
      statusSefaz: "Autorizada",
      statusCarta: "Autorizada",
      chaveAcesso: "35250112345678901234550010000453110000453111"
    },
    {
      id: "3",
      dataEmissao: "13/01/2025",
      numero: "4530",
      serie: "1",
      modelo: "NF-e",
      cliente: "Pedro Costa",
      cpfCnpj: "456.789.123-00",
      valor: 2100.00,
      statusSefaz: "Autorizada",
      statusCarta: "Rascunho",
      chaveAcesso: "35250112345678901234550010000453010000453011"
    },
    {
      id: "4",
      dataEmissao: "12/01/2025",
      numero: "4529",
      serie: "1",
      modelo: "NF-e",
      cliente: "Ana Oliveira",
      cpfCnpj: "321.654.987-00",
      valor: 3500.00,
      statusSefaz: "Autorizada",
      statusCarta: "Rejeitada",
      chaveAcesso: "35250112345678901234550010000452910000452911"
    },
    {
      id: "5",
      dataEmissao: "11/01/2025",
      numero: "4528",
      serie: "1",
      modelo: "NFC-e",
      cliente: "Carlos Lima",
      cpfCnpj: "789.123.456-00",
      valor: 450.00,
      statusSefaz: "Cancelada",
      statusCarta: "Nenhuma",
      chaveAcesso: "35250112345678901234550010000452810000452811"
    }
  ];

  const historicoCartas: CartaCorrecao[] = [
    {
      id: "1",
      dataHora: "15/01/2025 14:30",
      usuario: "Admin",
      correcao: "Correção no endereço de entrega: Rua das Flores, 123 - Centro - São Paulo/SP",
      protocolo: "135250000123456",
      status: "Autorizada"
    },
    {
      id: "2",
      dataHora: "14/01/2025 10:15",
      usuario: "Admin",
      correcao: "Correção no CFOP: de 5102 para 5405",
      protocolo: "135250000123455",
      status: "Rejeitada"
    }
  ];

  const stats = {
    autorizadas: { quantidade: 45, valor: 125430.00 },
    rejeitadas: { quantidade: 3, valor: 8920.00 },
    semCarta: { quantidade: 189, valor: 456780.00 }
  };

  const handleLimparFiltros = () => {
    setSearchQuery("");
    setFiltroModelo("todos");
    setFiltroStatus("todos");
    setFiltroUf("todas");
    setDataInicial("");
    setDataFinal("");
    setNumeroNf("");
    setSerieNf("");
    setChaveAcesso("");
  };

  const handleAbrirModalEmissao = (nota: NotaFiscal) => {
    setNotaSelecionada(nota);
    setTextoCorrecao("");
    setTipoAlteracao("");
    setConcordoRegras(false);
    setResultadoSefaz(null);
    setModalEmissaoOpen(true);
  };

  const handleAbrirModalHistorico = (nota: NotaFiscal) => {
    setNotaSelecionada(nota);
    setModalHistoricoOpen(true);
  };

  const handleEnviarSefaz = () => {
    // Simulação de envio para SEFAZ
    setTimeout(() => {
      setResultadoSefaz({
        situacao: "Autorizada",
        protocolo: "135250000" + Math.floor(Math.random() * 1000000),
        dataHora: new Date().toLocaleString(),
        mensagem: "Carta de Correção autorizada com sucesso pela SEFAZ."
      });
    }, 1500);
  };

  const handleSalvarRascunho = () => {
    // Implementar salvamento de rascunho
    setModalEmissaoOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon?: any }> = {
      "Nenhuma": { className: "bg-muted text-muted-foreground border-border" },
      "Rascunho": { className: "bg-warning/10 text-warning border-warning/20" },
      "Enviada": { className: "bg-primary/10 text-primary border-primary/20" },
      "Autorizada": { className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
      "Rejeitada": { className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
      "Cancelada": { className: "bg-muted text-muted-foreground border-border", icon: XCircle }
    };

    const variant = variants[status] || variants["Nenhuma"];
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={variant.className}>
        {Icon && <Icon size={12} className="mr-1" />}
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Page Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-background">
        {/* Page Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Carta de Correção</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie cartas de correção eletrônicas (CC-e) vinculadas às suas notas fiscais.
            </p>
          </div>
          <Card className="p-4 bg-card border-border max-w-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Válido para NF-e e NFC-e, conforme legislação SEFAZ.
                </p>
                <a 
                  href="https://www.nfe.fazenda.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                >
                  Ver orientações oficiais
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">NF com Carta Autorizada</p>
                <p className="text-2xl font-bold text-success mt-1">{stats.autorizadas.quantidade}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {stats.autorizadas.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <CheckCircle className="text-success" size={32} />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">NF com Carta Rejeitada</p>
                <p className="text-2xl font-bold text-destructive mt-1">{stats.rejeitadas.quantidade}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {stats.rejeitadas.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <XCircle className="text-destructive" size={32} />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">NF sem Carta Emitida</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.semCarta.quantidade}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {stats.semCarta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <FileText className="text-primary" size={32} />
            </div>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter size={20} />
                  Filtros de Busca
                </CardTitle>
                <CardDescription>
                  Utilize os filtros para encontrar notas fiscais específicas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Data Inicial */}
              <div className="space-y-2">
                <Label htmlFor="dataInicial">Data Inicial</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                />
              </div>

              {/* Data Final */}
              <div className="space-y-2">
                <Label htmlFor="dataFinal">Data Final</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo do Documento</Label>
                <Select value={filtroModelo} onValueChange={setFiltroModelo}>
                  <SelectTrigger id="modelo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="nfe">NF-e</SelectItem>
                    <SelectItem value="nfce">NFC-e</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status da Carta</Label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="nenhuma">Sem carta</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="autorizada">Autorizada</SelectItem>
                    <SelectItem value="rejeitada">Rejeitada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Número NF */}
              <div className="space-y-2">
                <Label htmlFor="numeroNf">Número da NF</Label>
                <Input
                  id="numeroNf"
                  type="text"
                  placeholder="Ex: 4532"
                  value={numeroNf}
                  onChange={(e) => setNumeroNf(e.target.value)}
                />
              </div>

              {/* Série */}
              <div className="space-y-2">
                <Label htmlFor="serie">Série</Label>
                <Input
                  id="serie"
                  type="text"
                  placeholder="Ex: 1"
                  value={serieNf}
                  onChange={(e) => setSerieNf(e.target.value)}
                />
              </div>

              {/* Chave de Acesso */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="chaveAcesso">Chave de Acesso</Label>
                <Input
                  id="chaveAcesso"
                  type="text"
                  placeholder="44 dígitos"
                  maxLength={44}
                  value={chaveAcesso}
                  onChange={(e) => setChaveAcesso(e.target.value)}
                />
              </div>

              {/* UF */}
              <div className="space-y-2">
                <Label htmlFor="uf">UF / SEFAZ</Label>
                <Select value={filtroUf} onValueChange={setFiltroUf}>
                  <SelectTrigger id="uf">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Minas Gerais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleLimparFiltros}>
                Limpar filtros
              </Button>
              <Button>
                <Search size={16} className="mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notas Fiscais</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Busca rápida por chave ou cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Número / Série</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status SEFAZ</TableHead>
                    <TableHead>Status Carta</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.map((nota) => (
                    <TableRow 
                      key={nota.id}
                      className={nota.statusSefaz === "Cancelada" ? "opacity-50" : ""}
                    >
                      <TableCell>{nota.dataEmissao}</TableCell>
                      <TableCell className="font-medium">
                        {nota.numero} / {nota.serie}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {nota.modelo}
                        </Badge>
                      </TableCell>
                      <TableCell>{nota.cliente}</TableCell>
                      <TableCell className="font-mono text-xs">{nota.cpfCnpj}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {nota.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(nota.statusSefaz)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(nota.statusCarta)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Eye size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visualizar NF</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleAbrirModalEmissao(nota)}
                                  disabled={nota.statusSefaz === "Cancelada"}
                                >
                                  <FileEdit size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {nota.statusSefaz === "Cancelada" 
                                    ? "Nota cancelada - não permite carta" 
                                    : "Emitir Carta de Correção"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleAbrirModalHistorico(nota)}
                                >
                                  <History size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver Histórico de Cartas</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando 5 de 237 registros
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modal de Emissão */}
      <Dialog open={modalEmissaoOpen} onOpenChange={setModalEmissaoOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nova Carta de Correção - NF nº {notaSelecionada?.numero}, Série {notaSelecionada?.serie}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para emitir a carta de correção eletrônica
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Resumo da Nota */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Resumo da Nota Fiscal</h3>
              <Card className="bg-muted/30 border-border">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data de Emissão:</span>
                      <span className="ml-2 font-medium">{notaSelecionada?.dataEmissao}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Modelo:</span>
                      <span className="ml-2 font-medium">{notaSelecionada?.modelo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="ml-2 font-medium">{notaSelecionada?.cliente}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPF/CNPJ:</span>
                      <span className="ml-2 font-medium font-mono text-xs">{notaSelecionada?.cpfCnpj}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Total:</span>
                      <span className="ml-2 font-medium">
                        R$ {notaSelecionada?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Chave de Acesso:</span>
                      <span className="ml-2 font-medium font-mono text-xs">{notaSelecionada?.chaveAcesso}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tipo de Alteração */}
            <div className="space-y-2">
              <Label htmlFor="tipoAlteracao">Tipo de Alteração (opcional)</Label>
              <Select value={tipoAlteracao} onValueChange={setTipoAlteracao}>
                <SelectTrigger id="tipoAlteracao">
                  <SelectValue placeholder="Selecione o tipo de correção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endereco">Dados do destinatário (endereço, bairro, complemento)</SelectItem>
                  <SelectItem value="transporte">Dados de transporte</SelectItem>
                  <SelectItem value="info-adicionais">Informações adicionais</SelectItem>
                  <SelectItem value="tributacao">CFOP / CST / tributação (quando permitido)</SelectItem>
                  <SelectItem value="outros">Outros (texto livre)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo de Correção */}
            <div className="space-y-2">
              <Label htmlFor="textoCorrecao">Descrição da Correção *</Label>
              <Textarea
                id="textoCorrecao"
                placeholder="Descreva de forma clara a correção, sem alterar valores, impostos ou dados proibidos pela SEFAZ."
                value={textoCorrecao}
                onChange={(e) => setTextoCorrecao(e.target.value)}
                rows={6}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Mínimo 15 caracteres</span>
                <span>{textoCorrecao.length} / 1000 caracteres</span>
              </div>
            </div>

            {/* Regras e Avisos */}
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning" />
                  Regras e Orientações
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Não é permitido alterar valores de produtos, impostos ou CFOP fora das regras da SEFAZ.</li>
                  <li>A carta será vinculada à NF-e escolhida e registrada com protocolo SEFAZ.</li>
                  <li>Limite de 20 cartas de correção por nota fiscal.</li>
                  <li>Prazo de até 30 dias após a autorização da NF para emissão da carta.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Checkbox de Concordância */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="concordo"
                checked={concordoRegras}
                onCheckedChange={(checked) => setConcordoRegras(checked as boolean)}
              />
              <Label
                htmlFor="concordo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e estou de acordo com as regras de emissão de Carta de Correção.
              </Label>
            </div>

            {/* Resultado SEFAZ */}
            {resultadoSefaz && (
              <Card className={`border-2 ${
                resultadoSefaz.situacao === "Autorizada" 
                  ? "bg-success/5 border-success" 
                  : "bg-destructive/5 border-destructive"
              }`}>
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    {resultadoSefaz.situacao === "Autorizada" ? (
                      <CheckCircle className="text-success" size={20} />
                    ) : (
                      <XCircle className="text-destructive" size={20} />
                    )}
                    Retorno da SEFAZ
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Situação:</span>
                      <span className="ml-2 font-medium">{resultadoSefaz.situacao}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Protocolo:</span>
                      <span className="ml-2 font-medium font-mono">{resultadoSefaz.protocolo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data/Hora:</span>
                      <span className="ml-2 font-medium">{resultadoSefaz.dataHora}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mensagem:</span>
                      <p className="mt-1 text-foreground">{resultadoSefaz.mensagem}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setModalEmissaoOpen(false)}
              >
                {resultadoSefaz ? "Fechar" : "Cancelar"}
              </Button>
              
              {!resultadoSefaz && (
                <>
                  <Button 
                    variant="secondary"
                    onClick={handleSalvarRascunho}
                    disabled={textoCorrecao.length < 15}
                  >
                    Salvar como rascunho
                  </Button>
                  <Button
                    onClick={handleEnviarSefaz}
                    disabled={textoCorrecao.length < 15 || !concordoRegras}
                  >
                    <Clock size={16} className="mr-2" />
                    Enviar para SEFAZ
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico */}
      <Dialog open={modalHistoricoOpen} onOpenChange={setModalHistoricoOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Histórico de Cartas - NF nº {notaSelecionada?.numero}, Série {notaSelecionada?.serie}
            </DialogTitle>
            <DialogDescription>
              Visualize todas as cartas de correção emitidas para esta nota fiscal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {historicoCartas.length > 0 ? (
              historicoCartas.map((carta) => (
                <Card key={carta.id} className="bg-card border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-foreground">{carta.dataHora}</span>
                          <span className="text-xs text-muted-foreground">por {carta.usuario}</span>
                          {getStatusBadge(carta.status)}
                        </div>
                        <p className="text-sm text-foreground mb-2">{carta.correcao}</p>
                        <p className="text-xs text-muted-foreground">
                          Protocolo: <span className="font-mono">{carta.protocolo}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalhes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Baixar XML</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/30 border-border">
                <CardContent className="pt-6 text-center">
                  <FileText className="mx-auto text-muted-foreground mb-3" size={48} />
                  <p className="text-muted-foreground">
                    Nenhuma carta de correção foi emitida para esta nota fiscal.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setModalHistoricoOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartaCorrecao;
