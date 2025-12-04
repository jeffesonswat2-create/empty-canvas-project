import { useState } from "react";
import { Search, Bell, HelpCircle, Activity, ArrowUpCircle, ArrowDownCircle, Users, FileText, RotateCcw, ShoppingCart, DollarSign, PieChart, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ParticipantesCadastrados from "@/components/ParticipantesCadastrados";

const Fiscal = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar busca
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Page Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto" style={{ backgroundColor: '#0F1115' }}>
          {/* Top Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Card */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <Activity className="text-success" size={24} />
                <div>
                  <p className="text-sm font-medium text-foreground">Status do Sistema</p>
                  <p className="text-xs text-muted-foreground">Sincronizado com a Sefaz</p>
                </div>
              </div>
              <Badge variant="outline" className="mt-3 bg-success/10 text-success border-success/20">
                Online
              </Badge>
            </Card>

            {/* Participantes Card */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Participantes</p>
                  <p className="text-2xl font-bold text-primary mt-1">1.234</p>
                </div>
                <Users className="text-primary" size={32} />
              </div>
            </Card>

            {/* Notas Emitidas Card */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Notas Emitidas</p>
                  <p className="text-2xl font-bold text-primary mt-1">567</p>
                </div>
                <FileText className="text-primary" size={32} />
              </div>
            </Card>

            {/* Devoluções Card */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Devoluções</p>
                  <p className="text-2xl font-bold text-accent mt-1">89</p>
                </div>
                <RotateCcw className="text-accent" size={32} />
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Card */}
            <Card className="lg:col-span-2 p-6 bg-card border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Busca rápida em Participantes
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Encontre clientes, fornecedores e transportadoras cadastradas no sistema
              </p>

              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Digite o nome, CPF/CNPJ ou código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="px-8">
                  <Search size={18} className="mr-2" />
                  Buscar
                </Button>
              </form>
            </Card>

            {/* Participantes Cadastrados - Substituindo o card de Faturamento */}
            <div className="lg:col-span-1">
              <ParticipantesCadastrados searchQuery={searchQuery} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fiscal Movement Chart */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Movimentação Fiscal - Últimos 7 dias
              </h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {[45, 62, 38, 71, 55, 68, 52].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-md transition-all hover:from-primary/90 hover:to-primary/50"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Notas Emitidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-xs text-muted-foreground">Devoluções</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Atalhos Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <ShoppingCart size={24} />
                  <span className="text-xs">PDV</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <DollarSign size={24} />
                  <span className="text-xs">Financeiro</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText size={24} />
                  <span className="text-xs">Emitir Nota</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <PieChart size={24} />
                  <span className="text-xs">Relatórios</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Últimas Atividades
            </h3>
            <div className="space-y-3">
              {[
                { action: "Nota Fiscal #4532 emitida", time: "Há 5 minutos", icon: FileText, color: "text-success" },
                { action: "Devolução #1023 processada", time: "Há 12 minutos", icon: RotateCcw, color: "text-accent" },
                { action: "Carta de Correção #8821 enviada", time: "Há 25 minutos", icon: FileEdit, color: "text-primary" },
                { action: "Relatório mensal gerado", time: "Há 1 hora", icon: PieChart, color: "text-primary" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-sidebar-accent/30 transition-colors">
                  <activity.icon className={activity.color} size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Simplix Cloud — Backup automático em nuvem (DigitalOcean)
            </p>
          </div>
        </main>
    </div>
  );
};

export default Fiscal;
