import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const FiltrosGlobais = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [periodo, setPeriodo] = useState("30dias");
  const [agrupamento, setAgrupamento] = useState("dia");
  const [status, setStatus] = useState("todos");

  useEffect(() => {
    // Carregar filtros salvos do localStorage
    const savedFilters = localStorage.getItem("relatorios_filtros");
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setPeriodo(filters.periodo || "30dias");
        setAgrupamento(filters.agrupamento || "dia");
        setStatus(filters.status || "todos");
      } catch (error) {
        console.error("Erro ao carregar filtros salvos:", error);
      }
    }
  }, []);

  const aplicarFiltros = () => {
    const filtros = {
      periodo,
      agrupamento,
      status,
      dateRange
    };
    
    // Salvar no localStorage
    localStorage.setItem("relatorios_filtros", JSON.stringify(filtros));
    
    toast({
      title: "Filtros aplicados",
      description: "Os relatórios serão atualizados com os filtros selecionados."
    });
  };

  const limparFiltros = () => {
    setPeriodo("30dias");
    setAgrupamento("dia");
    setStatus("todos");
    setDateRange({ from: undefined, to: undefined });
    localStorage.removeItem("relatorios_filtros");
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos."
    });
  };

  const salvarPreDefinicao = () => {
    const filtros = {
      periodo,
      agrupamento,
      status,
      dateRange
    };
    
    localStorage.setItem("relatorios_filtros_predefinido", JSON.stringify(filtros));
    
    toast({
      title: "Predefinição salva",
      description: "Esta configuração de filtros foi salva como padrão."
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtros Globais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Período */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data personalizada */}
          {periodo === "personalizado" && (
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-border",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange as any}
                    onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Agrupamento */}
          <div className="space-y-2">
            <Label>Agrupamento</Label>
            <Select value={agrupamento} onValueChange={setAgrupamento}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Agrupar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Dia</SelectItem>
                <SelectItem value="semana">Semana</SelectItem>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="aberto">Em aberto</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button onClick={aplicarFiltros} className="bg-primary hover:bg-primary/90">
            <Filter className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
          <Button onClick={limparFiltros} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={salvarPreDefinicao} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Salvar como Predefinição
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltrosGlobais;
