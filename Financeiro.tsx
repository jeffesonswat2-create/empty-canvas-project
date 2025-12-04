import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import BoletosFaturasSearch from "@/components/BoletosFaturasSearch";
import { 
  Wallet, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle,
  CreditCard,
  Download,
  Eye,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  Info,
  Lightbulb,
  Smartphone,
  Building2,
  DollarSign
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const financialSummary = {
  balance: 1280.00,
  openInvoices: 2,
  confirmedPayments: 18,
  lastPayment: "16/10/2025"
};

const chartData = [
  { month: "Jun/25", paid: 189.90, pending: 0 },
  { month: "Jul/25", paid: 189.90, pending: 0 },
  { month: "Ago/25", paid: 189.90, pending: 0 },
  { month: "Set/25", paid: 189.90, pending: 0 },
  { month: "Out/25", paid: 189.90, pending: 0 },
  { month: "Nov/25", paid: 0, pending: 189.90 }
];

const invoices = [
  { 
    id: "FTR-2025-0012", 
    issue: "01/11/2025", 
    due: "10/11/2025", 
    value: 189.90, 
    status: "open",
    nfe: "NFe-4587",
    boletoUrl: "https://exemplo.com/boletos/FTR-2025-0012.pdf",
    paymentMethod: "Boleto Bancário"
  },
  { 
    id: "FTR-2025-0011", 
    issue: "01/10/2025", 
    due: "10/10/2025", 
    value: 189.90, 
    status: "pending",
    nfe: "NFe-4421",
    boletoUrl: "https://exemplo.com/boletos/FTR-2025-0011.pdf",
    paymentMethod: "Cartão de Crédito"
  },
  { 
    id: "FTR-2025-0010", 
    issue: "01/09/2025", 
    due: "10/09/2025", 
    value: 189.90, 
    status: "paid",
    nfe: "NFe-4300",
    boletoUrl: "https://exemplo.com/boletos/FTR-2025-0010.pdf",
    paymentMethod: "PIX"
  }
];

const paymentHistory = [
  { date: "16/10/2025", method: "Cartão Visa", value: 189.90, status: "paid" },
  { date: "16/09/2025", method: "PIX", value: 189.90, status: "paid" },
  { date: "16/08/2025", method: "Boleto", value: 189.90, status: "paid" }
];

const movements = [
  { date: "10/10/2025", description: "Estorno duplicidade", type: "credit", value: 189.90 },
  { date: "05/09/2025", description: "Multa por atraso", type: "debit", value: 15.00 }
];

const transactionLogs = [
  { id: "TX-8845", datetime: "16/10/2025 14:33", ip: "192.168.0.12", action: "Pagamento Confirmado", result: "Sucesso" },
  { id: "TX-8843", datetime: "12/10/2025 11:22", ip: "192.168.0.9", action: "Tentativa PIX", result: "Erro" }
];

export default function Financeiro() {
  const [period, setPeriod] = useState("6-months");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof paymentHistory[0] | null>(null);
  const [invoiceDetailsModal, setInvoiceDetailsModal] = useState(false);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<typeof invoices[0] | null>(null);

  const handlePayment = () => {
    toast({
      title: "Pagamento confirmado",
      description: "Seu pagamento foi processado com sucesso.",
    });
    setPaymentModal(false);
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Recibo gerado",
      description: "O recibo foi baixado com sucesso.",
    });
  };

  const handleExport = (type: string) => {
    toast({
      title: "Relatório exportado",
      description: `${type} foi gerado com sucesso.`,
    });
  };

  const handleBoletoClick = (invoice: typeof invoices[0]) => {
    if (!invoice.boletoUrl) {
      toast({
        title: "Boleto não disponível",
        description: "Boleto ainda não disponível para esta fatura.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      window.open(invoice.boletoUrl, '_blank');
      toast({
        title: "Boleto aberto",
        description: "O boleto foi aberto em uma nova aba.",
      });
    } catch (error) {
      toast({
        title: "Erro ao abrir boleto",
        description: "Não foi possível abrir o boleto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoiceDetails(invoice);
    setInvoiceDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-white">Pago</Badge>;
      case "open":
        return <Badge className="bg-destructive text-white">Em Aberto</Badge>;
      case "pending":
        return <Badge className="bg-warning text-white">Em Análise</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <DollarSign className="h-8 w-8 text-primary mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas movimentações, pagamentos, relatórios e histórico financeiro com segurança e praticidade.
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

      {/* Boletos and Faturas Search */}
      <BoletosFaturasSearch />

      {/* Alert */}
      {financialSummary.openInvoices > 0 && (
        <Card className="bg-warning/10 border-warning">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <p className="text-warning font-medium">
                Você possui {financialSummary.openInvoices} faturas vencendo nos próximos 5 dias.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {financialSummary.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Valor disponível na conta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturas em Aberto</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {financialSummary.openInvoices}
            </div>
            <p className="text-xs text-muted-foreground">Cobranças pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Confirmados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {financialSummary.confirmedPayments}
            </div>
            <p className="text-xs text-muted-foreground">Pagamentos concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Último Pagamento</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {financialSummary.lastPayment}
            </div>
            <p className="text-xs text-muted-foreground">Data do último pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Visão Financeira dos Últimos 6 Meses</CardTitle>
              <CardDescription>Análise de pagamentos realizados e faturas pendentes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-days">Últimos 30 dias</SelectItem>
                  <SelectItem value="3-months">3 meses</SelectItem>
                  <SelectItem value="6-months">6 meses</SelectItem>
                  <SelectItem value="1-year">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="open">Em Aberto</SelectItem>
                  <SelectItem value="pending">Em Análise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
              />
              <Legend />
              <Bar dataKey="paid" fill="hsl(var(--primary))" name="Pagamentos realizados" />
              <Bar dataKey="pending" fill="hsl(var(--muted))" name="Faturas pendentes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas e Boletos Ativos</CardTitle>
          <CardDescription>Gerencie suas faturas abertas e recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nº Fatura</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Emissão</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vencimento</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Situação</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nota Fiscal</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-sm">{invoice.id}</td>
                    <td className="p-4 text-sm">{invoice.issue}</td>
                    <td className="p-4 text-sm">{invoice.due}</td>
                    <td className="p-4 text-sm">R$ {invoice.value.toFixed(2)}</td>
                    <td className="p-4 text-sm">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4 text-sm">{invoice.nfe}</td>
                    <td className="p-4 text-sm">
                      <div className="flex gap-2">
                        {invoice.status === "open" && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setPaymentModal(true);
                              }}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pagar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleBoletoClick(invoice)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Boleto
                            </Button>
                          </>
                        )}
                        {invoice.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Button>
                        )}
                        {invoice.status === "paid" && (
                          <Button size="sm" variant="outline" onClick={handleDownloadReceipt}>
                            <Receipt className="mr-2 h-4 w-4" />
                            Recibo
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment History and Financial Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Pagamentos realizados nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Método</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Recibo</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Logs</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 text-sm">{payment.date}</td>
                      <td className="p-4 text-sm">{payment.method}</td>
                      <td className="p-4 text-sm">R$ {payment.value.toFixed(2)}</td>
                      <td className="p-4 text-sm">{getStatusBadge(payment.status)}</td>
                      <td className="p-4 text-sm">
                        <Button size="sm" variant="ghost" onClick={handleDownloadReceipt}>
                          <Receipt className="mr-2 h-4 w-4" />
                          Ver Recibo
                        </Button>
                      </td>
                      <td className="p-4 text-sm">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setDetailsModal(true);
                          }}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Financial Intelligence Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>Dica Simplix</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Seus pagamentos estão em dia! Ao migrar para o plano anual, você economiza 10% e ganha suporte prioritário 24/7.
            </p>
            <Button className="w-full" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Planos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Movements and Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentos e Ajustes Financeiros</CardTitle>
          <CardDescription>Créditos, estornos e ajustes manuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-sm">{movement.date}</td>
                    <td className="p-4 text-sm">{movement.description}</td>
                    <td className="p-4 text-sm">
                      {movement.type === "credit" ? (
                        <Badge className="bg-success text-white">Crédito</Badge>
                      ) : (
                        <Badge className="bg-destructive text-white">Débito</Badge>
                      )}
                    </td>
                    <td className={`p-4 text-sm font-medium ${movement.type === "credit" ? "text-success" : "text-destructive"}`}>
                      {movement.type === "credit" ? "+" : "-"}R$ {movement.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reports and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Financeiros</CardTitle>
            <CardDescription>Gere relatórios detalhados de pagamentos, notas fiscais e consumo mensal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => handleExport("Extrato Mensal")}>
              <Calendar className="mr-2 h-4 w-4" />
              Extrato Mensal
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => handleExport("Relatório de Vendas")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Relatório de Vendas
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => handleExport("CSV Histórico")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </CardContent>
        </Card>

        {/* Transaction Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Transações</CardTitle>
            <CardDescription>Auditoria de atividades financeiras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactionLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{log.id} - {log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.datetime} • {log.ip}</p>
                  </div>
                  <Badge variant={log.result === "Sucesso" ? "default" : "destructive"}>
                    {log.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Realizar Pagamento</DialogTitle>
            <DialogDescription>
              Fatura: {selectedInvoice?.id} • R$ {selectedInvoice?.value.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={paymentMethod === "pix" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMethod("pix")}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                PIX
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Cartão
              </Button>
              <Button
                variant={paymentMethod === "boleto" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMethod("boleto")}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Boleto
              </Button>
            </div>

            {paymentMethod === "pix" && (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    <p className="text-sm text-center">QR Code PIX</p>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Escaneie o QR Code com seu aplicativo de banco
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label>Número do Cartão</Label>
                  <Input placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Validade</Label>
                    <Input placeholder="MM/AA" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" />
                  </div>
                </div>
                <div>
                  <Label>Parcelas</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x de R$ {selectedInvoice?.value.toFixed(2)}</SelectItem>
                      <SelectItem value="2">2x de R$ {((selectedInvoice?.value || 0) / 2).toFixed(2)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {paymentMethod === "boleto" && (
              <div className="space-y-3">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Valor:</strong> R$ {selectedInvoice?.value.toFixed(2)}</p>
                  <p className="text-sm"><strong>Vencimento:</strong> {selectedInvoice?.due}</p>
                  <p className="text-sm"><strong>Código de Barras:</strong></p>
                  <p className="text-xs font-mono">23790.00123 45678.901234 56789.012345 6 78900000018990</p>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Boleto PDF
                </Button>
              </div>
            )}

            <Button className="w-full" onClick={handlePayment}>
              Confirmar Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Details Modal */}
      <Dialog open={detailsModal} onOpenChange={setDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
            <DialogDescription>Informações completas da transação</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">ID da Transação</p>
                <p className="text-sm font-medium">TX-8845</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data e Hora</p>
                <p className="text-sm font-medium">{selectedPayment?.date} 14:33</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método</p>
                <p className="text-sm font-medium">{selectedPayment?.method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-sm font-medium">R$ {selectedPayment?.value.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP de Origem</p>
                <p className="text-sm font-medium">192.168.0.12</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Bancário</p>
                <p className="text-sm font-medium text-success">Aprovado</p>
              </div>
            </div>
            <Button className="w-full" onClick={handleDownloadReceipt}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Comprovante PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Modal */}
      <Dialog open={invoiceDetailsModal} onOpenChange={setInvoiceDetailsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Fatura</DialogTitle>
            <DialogDescription>
              Informações completas da fatura {selectedInvoiceDetails?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nº Fatura</p>
                <p className="text-sm font-semibold">{selectedInvoiceDetails?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Situação</p>
                {selectedInvoiceDetails && getStatusBadge(selectedInvoiceDetails.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Emissão</p>
                <p className="text-sm font-semibold">{selectedInvoiceDetails?.issue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Vencimento</p>
                <p className="text-sm font-semibold">{selectedInvoiceDetails?.due}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-lg font-bold text-primary">
                  R$ {selectedInvoiceDetails?.value.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                <p className="text-sm font-semibold">{selectedInvoiceDetails?.paymentMethod}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Nota Fiscal Vinculada</p>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{selectedInvoiceDetails?.nfe}</p>
                    <p className="text-xs text-muted-foreground">Emitida em {selectedInvoiceDetails?.issue}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver NF-e
                </Button>
              </div>
            </div>

            {selectedInvoiceDetails?.boletoUrl && (
              <div className="border-t border-border pt-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleBoletoClick(selectedInvoiceDetails)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Abrir Boleto
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setInvoiceDetailsModal(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
