import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Workflow } from "lucide-react";
import { Kpis } from "@/components/automacoes/Kpis";
import { ListaAutomacoes } from "@/components/automacoes/ListaAutomacoes";
import { Templates } from "@/components/automacoes/Templates";
import { Logs } from "@/components/automacoes/Logs";
import { Auditoria } from "@/components/automacoes/Auditoria";
import { Builder } from "@/components/automacoes/Builder";

export default function Automacoes() {
  const [activeTab, setActiveTab] = useState("lista");
  const [selectedAutomacao, setSelectedAutomacao] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState<"create" | "edit" | null>(null);

  const handleCreateAutomacao = () => {
    setBuilderMode("create");
    setSelectedAutomacao(null);
  };

  const handleEditAutomacao = (id: string) => {
    setBuilderMode("edit");
    setSelectedAutomacao(id);
  };

  const handleCloseBuilder = () => {
    setBuilderMode(null);
    setSelectedAutomacao(null);
  };

  const handleViewLogs = (id: string) => {
    setSelectedAutomacao(id);
    setActiveTab("logs");
  };

  if (builderMode) {
    return (
      <Builder
        mode={builderMode}
        automacaoId={selectedAutomacao}
        onClose={handleCloseBuilder}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Workflow className="w-8 h-8 text-primary mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Automações</h1>
            <p className="text-muted-foreground mt-1">
              Crie fluxos automáticos com disparadores, condições e ações para integrar seus processos de vendas, fiscal, financeiro, CRM e consignação.
            </p>
          </div>
        </div>

        {/* Card da empresa */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-semibold text-foreground">
                    LR Distribuidora de Livros e Revistas LTDA
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-semibold text-foreground">12.345.678/0001-90</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <Kpis />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="lista">Automações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <ListaAutomacoes
            onCreate={handleCreateAutomacao}
            onEdit={handleEditAutomacao}
            onViewLogs={handleViewLogs}
          />
        </TabsContent>

        <TabsContent value="templates">
          <Templates onCreate={handleCreateAutomacao} />
        </TabsContent>

        <TabsContent value="logs">
          <Logs automacaoId={selectedAutomacao} />
        </TabsContent>

        <TabsContent value="auditoria">
          <Auditoria />
        </TabsContent>
      </Tabs>
    </div>
  );
}
