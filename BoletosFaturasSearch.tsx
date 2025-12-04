import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Search, Download, Eye, Mail, AlertCircle } from "lucide-react";

interface SearchResult {
  id: string;
  numero: string;
  tipo: "BOLETO" | "FATURA";
  cliente: string;
  cpfCnpj: string;
  vencimento: string;
  valor: number;
  situacao: "EM_ABERTO" | "PAGA" | "VENCIDA";
  linkBoleto?: string;
}

export default function BoletosFaturasSearch() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [situacao, setSituacao] = useState("todas");
  const [periodo, setPeriodo] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Função para formatar CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value);
    setCpfCnpj(formatted);
    setError("");
  };

  const validateCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.length === 11 || numbers.length === 14;
  };

  const handleSearch = async () => {
    if (!cpfCnpj.trim()) {
      setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }

    if (!validateCpfCnpj(cpfCnpj)) {
      setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }

    setError("");
    setIsLoading(true);
    setHasSearched(false);

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock de dados - em produção, fazer chamada real:
      // const response = await fetch(`/api/financeiro/titulos?cpfCnpj=${cpfCnpj.replace(/\D/g, '')}&tipo=${tipo}&situacao=${situacao}&periodo=${periodo}`);
      // const data = await response.json();

      const mockResults: SearchResult[] = [
        {
          id: "1",
          numero: "BOL-2025-001",
          tipo: "BOLETO",
          cliente: "João da Silva",
          cpfCnpj: "123.456.789-01",
          vencimento: "20/10/2025",
          valor: 1280.0,
          situacao: "EM_ABERTO",
          linkBoleto: "https://example.com/boleto.pdf"
        },
        {
          id: "2",
          numero: "FTR-2025-045",
          tipo: "FATURA",
          cliente: "Maria Santos",
          cpfCnpj: "12.345.678/0001-90",
          vencimento: "15/10/2025",
          valor: 2500.0,
          situacao: "PAGA"
        },
        {
          id: "3",
          numero: "BOL-2025-002",
          tipo: "BOLETO",
          cliente: "Pedro Oliveira",
          cpfCnpj: "987.654.321-00",
          vencimento: "05/09/2025",
          valor: 850.0,
          situacao: "VENCIDA",
          linkBoleto: "https://example.com/boleto2.pdf"
        }
      ];

      setResults(mockResults);
    } catch (err) {
      setError("Não foi possível carregar os boletos e faturas. Tente novamente mais tarde.");
      setResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "EM_ABERTO":
        return <Badge className="bg-primary text-white">Em aberto</Badge>;
      case "PAGA":
        return <Badge className="bg-success text-white">Paga</Badge>;
      case "VENCIDA":
        return <Badge className="bg-destructive text-white">Vencida</Badge>;
      default:
        return null;
    }
  };

  const handleDownloadBoleto = (numero: string) => {
    toast({
      title: "Boleto baixado",
      description: `Boleto ${numero} foi baixado com sucesso.`,
    });
  };

  const handleSendEmail = (numero: string) => {
    toast({
      title: "E-mail enviado",
      description: `${numero} foi enviado por e-mail com sucesso.`,
    });
  };

  const handleViewDetails = (numero: string) => {
    toast({
      title: "Detalhes",
      description: `Visualizando detalhes de ${numero}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Boletos e Faturas</CardTitle>
        <CardDescription>Pesquise boletos e faturas pelo CPF ou CNPJ do cliente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* CPF/CNPJ */}
          <div className="md:col-span-4 space-y-2">
            <Label htmlFor="cpfCnpj">CPF/CNPJ do cliente</Label>
            <Input
              id="cpfCnpj"
              placeholder="Digite o CPF ou CNPJ (apenas números)"
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              maxLength={18}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="boletos">Boletos</SelectItem>
                <SelectItem value="faturas">Faturas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Situação */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="situacao">Situação</Label>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger id="situacao">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="aberto">Em aberto</SelectItem>
                <SelectItem value="pagas">Pagas</SelectItem>
                <SelectItem value="vencidas">Vencidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="periodo">Período</Label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger id="periodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
                <SelectItem value="365">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Buscar */}
          <div className="md:col-span-2 flex items-end">
            <Button 
              className="w-full" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Buscando...</>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {!hasSearched && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Informe um CPF ou CNPJ e clique em Buscar para listar boletos e faturas.
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {hasSearched && !isLoading && results.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum boleto ou fatura encontrada para o CPF/CNPJ informado dentro dos filtros selecionados.
            </div>
          )}

          {error && hasSearched && !isLoading && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {hasSearched && !isLoading && results.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Número</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">CPF/CNPJ</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vencimento</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Situação</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 text-sm">{result.numero}</td>
                      <td className="p-4 text-sm">{result.tipo === "BOLETO" ? "Boleto" : "Fatura"}</td>
                      <td className="p-4 text-sm">{result.cliente}</td>
                      <td className="p-4 text-sm">{result.cpfCnpj}</td>
                      <td className="p-4 text-sm">{result.vencimento}</td>
                      <td className="p-4 text-sm">R$ {result.valor.toFixed(2)}</td>
                      <td className="p-4 text-sm">{getSituacaoBadge(result.situacao)}</td>
                      <td className="p-4 text-sm">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewDetails(result.numero)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {result.tipo === "BOLETO" && result.linkBoleto && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownloadBoleto(result.numero)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleSendEmail(result.numero)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
