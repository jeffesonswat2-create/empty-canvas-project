import { useState } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Search,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type TipoArquivo = "produtos" | "clientes" | "precos" | "estoque" | "vendedores" | "xml-entrada" | "xml-saida";

interface ResultadoImportacao {
  arquivo: string;
  totalLinhas: number;
  linhasValidas: number;
  linhasErro: number;
  status: "sucesso" | "parcial" | "erro";
  erros: ErroImportacao[];
}

interface ErroImportacao {
  linha: number;
  conteudo: string;
  motivo: string;
  sugestao: string;
}

interface HistoricoImportacao {
  id: string;
  data: string;
  tipo: string;
  usuario: string;
  status: "concluido" | "com-erros" | "falhou";
  totalLinhas: number;
  linhasImportadas: number;
  arquivo: string;
}

const Importador = () => {
  const [tipoArquivo, setTipoArquivo] = useState<TipoArquivo>("produtos");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);
  const [modalResultadoAberto, setModalResultadoAberto] = useState(false);
  const [buscaErro, setBuscaErro] = useState("");

  // Dados mock do histórico
  const [historico] = useState<HistoricoImportacao[]>([
    {
      id: "1",
      data: "2025-01-20 14:30",
      tipo: "Produtos",
      usuario: "Admin",
      status: "concluido",
      totalLinhas: 500,
      linhasImportadas: 500,
      arquivo: "produtos_janeiro_2025.xlsx"
    },
    {
      id: "2",
      data: "2025-01-19 10:15",
      tipo: "Clientes",
      usuario: "Gerente",
      status: "com-erros",
      totalLinhas: 250,
      linhasImportadas: 245,
      arquivo: "clientes_novos.csv"
    },
    {
      id: "3",
      data: "2025-01-18 16:45",
      tipo: "XML de entrada",
      usuario: "Admin",
      status: "falhou",
      totalLinhas: 0,
      linhasImportadas: 0,
      arquivo: "nfe_compras_corrupto.xml"
    }
  ]);

  const extensoesAceitas: Record<TipoArquivo, string[]> = {
    "produtos": [".csv", ".xlsx", ".json"],
    "clientes": [".csv", ".xlsx", ".json"],
    "precos": [".csv", ".xlsx"],
    "estoque": [".csv", ".xlsx", ".json"],
    "vendedores": [".csv", ".xlsx"],
    "xml-entrada": [".xml"],
    "xml-saida": [".xml"]
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validarESetarArquivo(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validarESetarArquivo(files[0]);
    }
  };

  const validarESetarArquivo = (file: File) => {
    // Validar tamanho (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "O arquivo deve ter no máximo 20MB"
      });
      return;
    }

    // Validar extensão
    const extensao = "." + file.name.split(".").pop()?.toLowerCase();
    const extensoesPermitidas = extensoesAceitas[tipoArquivo];

    if (!extensoesPermitidas.includes(extensao)) {
      toast.error("Formato inválido", {
        description: `Para ${tipoArquivo}, são aceitos apenas: ${extensoesPermitidas.join(", ")}`
      });
      return;
    }

    setArquivo(file);
    toast.success("Arquivo carregado", {
      description: file.name
    });
  };

  const handleProcessar = async () => {
    if (!arquivo) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }

    setProcessando(true);
    setProgresso(0);

    // Simular processamento
    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simular processamento assíncrono
    setTimeout(() => {
      clearInterval(intervalo);
      setProgresso(100);

      // Resultado mock
      const resultadoMock: ResultadoImportacao = {
        arquivo: arquivo.name,
        totalLinhas: 500,
        linhasValidas: 485,
        linhasErro: 15,
        status: "parcial",
        erros: [
          {
            linha: 15,
            conteudo: "Produto A, , 19.90",
            motivo: "Código do produto vazio",
            sugestao: "Preencher coluna 'código' obrigatória"
          },
          {
            linha: 28,
            conteudo: "Produto B, 001, ABC",
            motivo: "Preço inválido (esperado número)",
            sugestao: "Corrigir valor na coluna 'preço'"
          },
          {
            linha: 42,
            conteudo: "Produto C, 002",
            motivo: "Coluna 'preço' ausente",
            sugestao: "Adicionar valor de preço"
          }
        ]
      };

      setResultado(resultadoMock);
      setProcessando(false);
      setModalResultadoAberto(true);

      if (resultadoMock.status === "sucesso") {
        toast.success("Importação concluída", {
          description: `${resultadoMock.linhasValidas} linhas importadas com sucesso`
        });
      } else if (resultadoMock.status === "parcial") {
        toast.warning("Importação parcial", {
          description: `${resultadoMock.linhasValidas} importadas, ${resultadoMock.linhasErro} com erro`
        });
      } else {
        toast.error("Falha na importação", {
          description: "Verifique os erros e tente novamente"
        });
      }
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "concluido": { className: "bg-success/20 text-success hover:bg-success/30", label: "Concluído" },
      "com-erros": { className: "bg-warning/20 text-warning hover:bg-warning/30", label: "Com erros" },
      "falhou": { className: "bg-destructive/20 text-destructive hover:bg-destructive/30", label: "Falhou" },
      "sucesso": { className: "bg-success/20 text-success hover:bg-success/30", label: "Sucesso" },
      "parcial": { className: "bg-warning/20 text-warning hover:bg-warning/30", label: "Parcial" },
      "erro": { className: "bg-destructive/20 text-destructive hover:bg-destructive/30", label: "Erro" }
    };

    const config = variants[status] || variants["falhou"];
    
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const errosFiltrados = resultado?.erros.filter(erro => 
    buscaErro === "" || 
    erro.conteudo.toLowerCase().includes(buscaErro.toLowerCase()) ||
    erro.motivo.toLowerCase().includes(buscaErro.toLowerCase()) ||
    erro.sugestao.toLowerCase().includes(buscaErro.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 flex flex-col w-full">
      <main className="flex-1 p-6 space-y-6 overflow-auto" style={{ backgroundColor: '#0F1115' }}>
        {/* Cabeçalho da Página */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3BA3FF' }}>
            Importador de Arquivos
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8EA0B5' }}>
            Envie, processe e gerencie planilhas e arquivos utilizados para alimentar o sistema Simplix.
          </p>
        </div>

        {/* Card de Informações da Empresa */}
        <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ color: '#E7EEF6' }}>
                  LR Distribuidora de Livros e Revistas LTDA
                </h3>
                <p className="text-sm" style={{ color: '#8EA0B5' }}>
                  CNPJ: 12.345.678/0001-90
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                <span className="text-sm" style={{ color: '#8EA0B5' }}>Sistema Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Arquivos */}
        <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardHeader>
            <CardTitle style={{ color: '#E7EEF6' }}>Upload de Arquivo</CardTitle>
            <CardDescription style={{ color: '#8EA0B5' }}>
              Selecione o tipo e envie o arquivo para processamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção do Tipo */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#E7EEF6' }}>
                Tipo de Arquivo
              </label>
              <Select value={tipoArquivo} onValueChange={(value) => setTipoArquivo(value as TipoArquivo)}>
                <SelectTrigger style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produtos">Produtos</SelectItem>
                  <SelectItem value="clientes">Clientes</SelectItem>
                  <SelectItem value="precos">Preços</SelectItem>
                  <SelectItem value="estoque">Estoque</SelectItem>
                  <SelectItem value="vendedores">Vendedores</SelectItem>
                  <SelectItem value="xml-entrada">XML de entrada</SelectItem>
                  <SelectItem value="xml-saida">XML de saída</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs mt-1" style={{ color: '#8EA0B5' }}>
                Extensões aceitas: {extensoesAceitas[tipoArquivo].join(", ")}
              </p>
            </div>

            {/* Área de Upload Drag & Drop */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              style={{ 
                borderColor: isDragging ? '#3BA3FF' : '#20283A',
                backgroundColor: isDragging ? 'rgba(59, 163, 255, 0.05)' : 'transparent'
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept={extensoesAceitas[tipoArquivo].join(",")}
                onChange={handleFileInput}
              />
              
              <Upload className="mx-auto h-12 w-12 mb-4" style={{ color: '#3BA3FF' }} />
              
              {arquivo ? (
                <div className="space-y-2">
                  <p className="font-medium" style={{ color: '#E7EEF6' }}>
                    {arquivo.name}
                  </p>
                  <p className="text-sm" style={{ color: '#8EA0B5' }}>
                    {(arquivo.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setArquivo(null);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-1" style={{ color: '#E7EEF6' }}>
                    Arraste um arquivo aqui ou clique para selecionar
                  </p>
                  <p className="text-sm" style={{ color: '#8EA0B5' }}>
                    Tamanho máximo: 20MB
                  </p>
                </div>
              )}
            </div>

            {/* Botão de Processar */}
            <div className="flex justify-end">
              <Button
                onClick={handleProcessar}
                disabled={!arquivo || processando}
                className="bg-primary hover:bg-primary/90"
              >
                {processando ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Processar Arquivo"
                )}
              </Button>
            </div>

            {/* Barra de Progresso */}
            {processando && (
              <div className="space-y-2">
                <Progress value={progresso} className="w-full" />
                <p className="text-sm text-center" style={{ color: '#8EA0B5' }}>
                  {progresso}% concluído
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Importações */}
        <Card style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardHeader>
            <CardTitle style={{ color: '#E7EEF6' }}>Histórico de Importações</CardTitle>
            <CardDescription style={{ color: '#8EA0B5' }}>
              Acompanhe todas as importações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: '#20283A' }}>
                    <TableHead style={{ color: '#8EA0B5' }}>Data</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Tipo de arquivo</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Usuário</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Status</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Total de linhas</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Linhas importadas</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Arquivo</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.map((item) => (
                    <TableRow key={item.id} style={{ borderColor: '#20283A' }}>
                      <TableCell style={{ color: '#E7EEF6' }}>{item.data}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{item.tipo}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{item.usuario}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{item.totalLinhas}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{item.linhasImportadas}</TableCell>
                      <TableCell style={{ color: '#8EA0B5' }} className="text-sm max-w-xs truncate">
                        {item.arquivo}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toast.info("Baixando relatório...")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toast.info("Visualizando detalhes...")}
                          >
                            <Eye className="h-4 w-4" />
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
      </main>

      {/* Modal de Resultado */}
      <Dialog open={modalResultadoAberto} onOpenChange={setModalResultadoAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E7EEF6' }}>Resultado da Importação</DialogTitle>
            <DialogDescription style={{ color: '#8EA0B5' }}>
              {resultado?.arquivo}
            </DialogDescription>
          </DialogHeader>

          {resultado && (
            <div className="space-y-6">
              {/* Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card style={{ backgroundColor: '#0F1115', borderColor: '#20283A' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4" style={{ color: '#8EA0B5' }} />
                      <span className="text-xs" style={{ color: '#8EA0B5' }}>Total de linhas</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#E7EEF6' }}>
                      {resultado.totalLinhas}
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#0F1115', borderColor: '#20283A' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4" style={{ color: '#22C55E' }} />
                      <span className="text-xs" style={{ color: '#8EA0B5' }}>Linhas válidas</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#22C55E' }}>
                      {resultado.linhasValidas}
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#0F1115', borderColor: '#20283A' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                      <span className="text-xs" style={{ color: '#8EA0B5' }}>Linhas com erro</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                      {resultado.linhasErro}
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#0F1115', borderColor: '#20283A' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4" style={{ color: '#8EA0B5' }} />
                      <span className="text-xs" style={{ color: '#8EA0B5' }}>Status final</span>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(resultado.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de Erros */}
              {resultado.erros.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                      Erros Encontrados ({resultado.erros.length})
                    </h3>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8EA0B5' }} />
                      <Input
                        placeholder="Buscar erro..."
                        value={buscaErro}
                        onChange={(e) => setBuscaErro(e.target.value)}
                        className="pl-10"
                        style={{ backgroundColor: '#0F1115', borderColor: '#20283A', color: '#E7EEF6' }}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#20283A' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderColor: '#20283A' }}>
                          <TableHead style={{ color: '#8EA0B5' }}>Linha</TableHead>
                          <TableHead style={{ color: '#8EA0B5' }}>Conteúdo</TableHead>
                          <TableHead style={{ color: '#8EA0B5' }}>Motivo do erro</TableHead>
                          <TableHead style={{ color: '#8EA0B5' }}>Correção sugerida</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errosFiltrados.map((erro, index) => (
                          <TableRow key={index} style={{ borderColor: '#20283A' }}>
                            <TableCell style={{ color: '#E7EEF6' }} className="font-mono">
                              {erro.linha}
                            </TableCell>
                            <TableCell style={{ color: '#8EA0B5' }} className="text-sm max-w-xs truncate">
                              {erro.conteudo}
                            </TableCell>
                            <TableCell style={{ color: '#EF4444' }} className="text-sm">
                              {erro.motivo}
                            </TableCell>
                            <TableCell style={{ color: '#22C55E' }} className="text-sm">
                              {erro.sugestao}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.info("Baixando relatório...")}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar relatório
                </Button>
                <Button onClick={() => setModalResultadoAberto(false)} className="bg-primary hover:bg-primary/90">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Importador;