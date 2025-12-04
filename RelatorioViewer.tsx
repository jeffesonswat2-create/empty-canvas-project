import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, FileText } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface RelatorioViewerProps {
  reportId: string;
  onClose: () => void;
}

// Mock data generator
const generateMockData = (reportId: string) => {
  const baseData = {
    tableData: [
      { id: 1, cliente: "Livraria Alfa", valor: 2500, quantidade: 15, status: "Pago" },
      { id: 2, cliente: "Livraria Beta", valor: 1800, quantidade: 12, status: "Pendente" },
      { id: 3, cliente: "Papelaria Delta", valor: 3200, quantidade: 20, status: "Pago" },
      { id: 4, cliente: "Livraria Central", valor: 1500, quantidade: 10, status: "Pago" },
      { id: 5, cliente: "Livraria Estação", valor: 2800, quantidade: 18, status: "Pendente" }
    ],
    chartData: [
      { name: "Jan", valor: 12400 },
      { name: "Fev", valor: 15600 },
      { name: "Mar", valor: 13800 },
      { name: "Abr", valor: 18900 },
      { name: "Mai", valor: 16700 },
      { name: "Jun", valor: 19500 }
    ],
    pieData: [
      { name: "Livros", value: 45 },
      { name: "Revistas", value: 25 },
      { name: "Papelaria", value: 20 },
      { name: "Outros", value: 10 }
    ],
    stats: {
      total: 124500,
      media: 24900,
      maximo: 35000,
      minimo: 8500
    }
  };
  return baseData;
};

const COLORS = ["#3BA3FF", "#2687E8", "#1E6FB8", "#165788"];

const RelatorioViewer = ({ reportId, onClose }: RelatorioViewerProps) => {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [reportId]);

  const loadData = async () => {
    setLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setData(generateMockData(reportId));
      setLoading(false);
    }, 800);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Relatório será exportado em formato ${format.toUpperCase()}`
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/relatorios/${reportId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "O link do relatório foi copiado para a área de transferência"
    });
  };

  if (loading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Carregando relatório...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Visualização do Relatório
          </DialogTitle>
          <DialogDescription>
            ID: {reportId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={() => handleExport("xlsx")} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar XLSX
            </Button>
            <Button onClick={() => handleExport("pdf")} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  R$ {data.stats.total.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Média</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  R$ {data.stats.media.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Máximo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  R$ {data.stats.maximo.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Mínimo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  R$ {data.stats.minimo.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="text-base">Evolução Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#20283A" />
                    <XAxis dataKey="name" stroke="#8EA0B5" />
                    <YAxis stroke="#8EA0B5" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#151924",
                        border: "1px solid #20283A",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="valor" fill="#3BA3FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#151924",
                        border: "1px solid #20283A",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela */}
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-base">Dados Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card hover:bg-card">
                      <TableHead className="text-muted-foreground">Cliente</TableHead>
                      <TableHead className="text-muted-foreground">Valor</TableHead>
                      <TableHead className="text-muted-foreground">Quantidade</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.tableData.map((row: any) => (
                      <TableRow key={row.id} className="hover:bg-card/50">
                        <TableCell className="font-medium text-foreground">{row.cliente}</TableCell>
                        <TableCell className="text-foreground">R$ {row.valor.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="text-foreground">{row.quantidade}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.status === "Pago" 
                              ? "bg-green-500/20 text-green-500" 
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}>
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatorioViewer;
