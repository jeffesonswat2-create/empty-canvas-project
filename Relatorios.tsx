import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, TrendingUp, TrendingDown, Receipt, Users as UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltrosGlobais from "@/components/relatorios/FiltrosGlobais";
import CatalogoRelatorios from "@/components/relatorios/CatalogoRelatorios";
import Agendamentos from "@/components/relatorios/Agendamentos";
import Auditoria from "@/components/relatorios/Auditoria";

// Mock API
const fetchKPIs = async () => {
  return {
    receita: { valor: 124500, variacao: 12.5 },
    notasEmitidas: { valor: 156, variacao: -3.2 },
    devolucoes: { valor: 89, variacao: -8.1 },
    clientesAtivos: { valor: 1234, variacao: 5.3 }
  };
};

const Relatorios = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("catalogo");

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const data = await fetchKPIs();
      setKpis(data);
    } catch (error) {
      console.error("Erro ao carregar KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-primary mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Explore e gere relatórios gerenciais, fiscais e financeiros com filtros avançados, exportação e agendamento.
            </p>
          </div>
        </div>

        {/* Company Info Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Empresa</p>
                  <p className="font-semibold text-white">LR Distribuidora de Livros e Revistas LTDA</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <p className="text-xs text-muted-foreground">CNPJ:</p>
                <p className="font-semibold text-white">12.345.678/0001-90</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita (30 dias)</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : formatCurrency(kpis?.receita?.valor || 0)}
                </p>
                {!loading && kpis?.receita?.variacao && (
                  <div className="flex items-center gap-1 mt-2">
                    {kpis.receita.variacao > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${kpis.receita.variacao > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(kpis.receita.variacao)}%
                    </span>
                  </div>
                )}
              </div>
              <Receipt className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notas Emitidas</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : kpis?.notasEmitidas?.valor || 0}
                </p>
                {!loading && kpis?.notasEmitidas?.variacao && (
                  <div className="flex items-center gap-1 mt-2">
                    {kpis.notasEmitidas.variacao > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${kpis.notasEmitidas.variacao > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(kpis.notasEmitidas.variacao)}%
                    </span>
                  </div>
                )}
              </div>
              <FileText className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Devoluções</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : kpis?.devolucoes?.valor || 0}
                </p>
                {!loading && kpis?.devolucoes?.variacao && (
                  <div className="flex items-center gap-1 mt-2">
                    {kpis.devolucoes.variacao > 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`text-sm ${kpis.devolucoes.variacao > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(kpis.devolucoes.variacao)}%
                    </span>
                  </div>
                )}
              </div>
              <TrendingDown className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : kpis?.clientesAtivos?.valor || 0}
                </p>
                {!loading && kpis?.clientesAtivos?.variacao && (
                  <div className="flex items-center gap-1 mt-2">
                    {kpis.clientesAtivos.variacao > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${kpis.clientesAtivos.variacao > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(kpis.clientesAtivos.variacao)}%
                    </span>
                  </div>
                )}
              </div>
              <UsersIcon className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="space-y-6">
          <FiltrosGlobais />
          <CatalogoRelatorios />
        </TabsContent>

        <TabsContent value="agendamentos">
          <Agendamentos />
        </TabsContent>

        <TabsContent value="auditoria">
          <Auditoria />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
