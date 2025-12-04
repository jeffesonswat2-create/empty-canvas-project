import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, Clock, ShoppingCart, DollarSign, FileText, TrendingUp, Users, Package, BarChart3, Lock } from "lucide-react";
import RelatorioViewer from "./RelatorioViewer";

const relatorios = {
  vendas: [
    { id: "vendas-periodo", nome: "Vendas por Período", descricao: "Análise de vendas totais e por agrupamento com filtros avançados", icon: ShoppingCart },
    { id: "vendas-produto", nome: "Vendas por Produto", descricao: "Quantidade vendida, ticket médio e margens de lucro por produto", icon: Package },
    { id: "vendas-cliente", nome: "Vendas por Cliente", descricao: "Ranking de clientes, LTV e ticket médio por cliente", icon: Users },
    { id: "notas-fiscais", nome: "Notas Fiscais Emitidas", descricao: "Status SEFAZ, rejeições, cancelamentos e histórico de NFe/NFCe/NFSe", icon: FileText }
  ],
  financeiro: [
    { id: "contas-receber", nome: "Contas a Receber/Pagar", descricao: "Aging, projeções e gestão de contas por período", icon: DollarSign },
    { id: "fluxo-caixa", nome: "Fluxo de Caixa", descricao: "Entradas, saídas e saldo acumulado por período", icon: TrendingUp },
    { id: "conciliacao", nome: "Conciliação Bancária", descricao: "Recebimentos vs faturas/boletos vs extrato simulado", icon: BarChart3 }
  ],
  fiscal: [
    { id: "emissao-lote", nome: "Emissão em Lote", descricao: "Status de emissão: sucesso, rejeição e pendências", icon: FileText },
    { id: "exportacao-contador", nome: "Exportações para Contador", descricao: "Arquivos XML, CSV e PDF para envio ao contador", icon: Download },
    { id: "conformidade", nome: "Indicadores de Conformidade", descricao: "Cancelamentos, cartas de correção e rejeições frequentes", icon: BarChart3 }
  ],
  consignacao: [
    { id: "resumo-consignacao", nome: "Resumo de Consignações", descricao: "Análise por cliente e status (ativa, parcial, encerrada)", icon: TrendingUp },
    { id: "devolucoes", nome: "Devoluções e Pendências", descricao: "Itens devolvidos, saldos e prazos de retorno", icon: Package },
    { id: "financeiro-consignacao", nome: "Financeiro por Consignação", descricao: "Valor enviado, recebido e pendente por consignação", icon: DollarSign }
  ],
  crm: [
    { id: "oportunidades", nome: "Oportunidades por Etapa", descricao: "Funil de vendas e taxa de ganho/perda", icon: TrendingUp },
    { id: "atividades-vendedor", nome: "Atividades por Vendedor", descricao: "Chamadas, mensagens e reuniões realizadas", icon: Users },
    { id: "conversao", nome: "Conversão por Origem", descricao: "Análise de campanhas e canais de aquisição", icon: BarChart3 }
  ],
  estoque: [
    { id: "saldo-produto", nome: "Saldo por Produto", descricao: "Estoque atual, mínimo e reposição sugerida", icon: Package },
    { id: "curva-abc", nome: "Curva ABC", descricao: "Classificação por importância (faturamento/volume)", icon: BarChart3 },
    { id: "giro-estoque", nome: "Giro de Estoque", descricao: "Análise de rotatividade por período", icon: TrendingUp }
  ],
  desempenho: [
    { id: "kpis-desempenho", nome: "KPIs de Desempenho", descricao: "Tempo médio de emissão, aprovação e SLA de suporte", icon: BarChart3 },
    { id: "erros-rejeicoes", nome: "Erros e Rejeições", descricao: "Top causas de erros e tendências de rejeição", icon: FileText }
  ]
};

const CatalogoRelatorios = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [userRole] = useState("admin"); // Simular perfil do usuário

  const hasAccess = (reportId: string) => {
    if (userRole === "admin") return true;
    if (userRole === "financeiro") return ["vendas", "financeiro", "fiscal"].some(cat => reportId.startsWith(cat));
    if (userRole === "vendas") return ["vendas", "crm"].some(cat => reportId.startsWith(cat));
    return false;
  };

  const handleExport = (format: string, reportId: string) => {
    console.log(`Exportando relatório ${reportId} em formato ${format}`);
  };

  const handleSchedule = (reportId: string) => {
    console.log(`Agendando relatório ${reportId}`);
  };

  const renderSection = (title: string, items: any[], category: string) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((relatorio) => {
          const hasUserAccess = hasAccess(relatorio.id);
          const Icon = relatorio.icon;
          
          return (
            <Card key={relatorio.id} className={cn("bg-card border-border", !hasUserAccess && "opacity-50")}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {!hasUserAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                <CardDescription>{relatorio.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedReport(relatorio.id)}
                    disabled={!hasUserAccess}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("pdf", relatorio.id)}
                    disabled={!hasUserAccess}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSchedule(relatorio.id)}
                    disabled={!hasUserAccess}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-8">
        {renderSection("Vendas", relatorios.vendas, "vendas")}
        {renderSection("Financeiro", relatorios.financeiro, "financeiro")}
        {renderSection("Fiscal", relatorios.fiscal, "fiscal")}
        {renderSection("Consignação", relatorios.consignacao, "consignacao")}
        {renderSection("CRM", relatorios.crm, "crm")}
        {renderSection("Estoque", relatorios.estoque, "estoque")}
        {renderSection("Desempenho", relatorios.desempenho, "desempenho")}
      </div>

      {selectedReport && (
        <RelatorioViewer
          reportId={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default CatalogoRelatorios;
