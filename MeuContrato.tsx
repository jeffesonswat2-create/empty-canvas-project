import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Eye,
  Mail,
  Calendar,
  CreditCard,
  User,
  FileSignature,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Contrato {
  id: string;
  numeroContrato: string;
  dataInicio: string;
  dataFim: string;
  plano: string;
  status: "ativo" | "encerrado" | "pendente" | "cancelado";
  arquivo: string;
}

const MeuContrato = () => {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string>("");

  // Dados do contrato ativo
  const contratoAtivo = {
    numeroContrato: "#CT-2025-0001",
    dataAssinatura: "16/10/2025",
    situacao: "ativo" as const,
    plano: "Profissional",
    vencimento: "16/10/2026",
    representante: "Agnaldo Cardoso",
    arquivo: "contrato_simplix_profissional.pdf",
  };

  // Histórico de contratos
  const historicoContratos: Contrato[] = [
    {
      id: "1",
      numeroContrato: "CT-2025-0001",
      dataInicio: "16/10/2025",
      dataFim: "16/10/2026",
      plano: "Profissional",
      status: "ativo",
      arquivo: "contrato_simplix_profissional.pdf",
    },
    {
      id: "2",
      numeroContrato: "CT-2024-0003",
      dataInicio: "12/10/2024",
      dataFim: "12/10/2025",
      plano: "Básico",
      status: "encerrado",
      arquivo: "contrato_simplix_basico.pdf",
    },
    {
      id: "3",
      numeroContrato: "CT-2023-0002",
      dataInicio: "09/09/2023",
      dataFim: "09/09/2024",
      plano: "Trial",
      status: "encerrado",
      arquivo: "contrato_simplix_trial.pdf",
    },
  ];

  const handleVisualizarPDF = (arquivo: string) => {
    setSelectedContract(arquivo);
    setPdfModalOpen(true);
  };

  const handleBaixarContrato = (arquivo: string) => {
    toast.success("📥 Cópia do contrato baixada com sucesso.");
    // Simulação de download
    console.log(`Baixando: ${arquivo}`);
  };

  const handleReenviarEmail = () => {
    toast.success("📧 Cópia reenviada para o e-mail cadastrado.");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: "Ativo", icon: CheckCircle2, color: "#22C55E" },
      pendente: { label: "Pendente", icon: Clock, color: "#F59E0B" },
      cancelado: { label: "Cancelado", icon: XCircle, color: "#EF4444" },
      encerrado: { label: "Encerrado", icon: CheckCircle2, color: "#8EA0B5" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge
        className="flex items-center gap-1 px-3 py-1"
        style={{
          backgroundColor: `${config.color}15`,
          color: config.color,
          border: `1px solid ${config.color}40`,
        }}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen p-6 overflow-y-auto scrollbar-none" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: '#E7EEF6' }}>
            Meu Contrato
          </h1>
          <p className="text-base" style={{ color: '#8EA0B5' }}>
            Gerencie seus contratos, renovações e documentos assinados com a Simplix.
          </p>
        </div>

        {/* 1. Status do Contrato */}
        <Card className="border" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#3BA3FF15' }}>
                  <FileSignature className="h-6 w-6" style={{ color: '#3BA3FF' }} />
                </div>
                <div>
                  <CardTitle className="text-2xl" style={{ color: '#E7EEF6' }}>
                    Status do Contrato
                  </CardTitle>
                  <CardDescription style={{ color: '#8EA0B5' }}>
                    Informações do seu contrato atual
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVisualizarPDF(contratoAtivo.arquivo)}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: '#3BA3FF', color: '#E7EEF6' }}
                >
                  <Eye className="h-4 w-4" />
                  Visualizar Contrato
                </Button>
                <Button
                  onClick={() => handleBaixarContrato(contratoAtivo.arquivo)}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{ borderColor: '#20283A', color: '#E7EEF6', backgroundColor: 'transparent' }}
                >
                  <Download className="h-4 w-4" />
                  Baixar Cópia
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Número do Contrato
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                  {contratoAtivo.numeroContrato}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Data de Assinatura
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                  {contratoAtivo.dataAssinatura}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Situação
                  </span>
                </div>
                {getStatusBadge(contratoAtivo.situacao)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Plano Contratado
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                  {contratoAtivo.plano}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Vencimento
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                  {contratoAtivo.vencimento}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" style={{ color: '#8EA0B5' }} />
                  <span className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Representante Simplix
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                  {contratoAtivo.representante}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Histórico de Contratos */}
        <Card className="border" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#3BA3FF15' }}>
                <FileText className="h-6 w-6" style={{ color: '#3BA3FF' }} />
              </div>
              <div>
                <CardTitle className="text-2xl" style={{ color: '#E7EEF6' }}>
                  Histórico de Contratos
                </CardTitle>
                <CardDescription style={{ color: '#8EA0B5' }}>
                  Lista de contratos anteriores e renovações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: '#20283A' }}>
                    <TableHead style={{ color: '#8EA0B5' }}>Nº Contrato</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Data de Início</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Data de Fim</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Plano</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }}>Situação</TableHead>
                    <TableHead style={{ color: '#8EA0B5' }} className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoContratos.map((contrato) => (
                    <TableRow key={contrato.id} style={{ borderColor: '#20283A' }}>
                      <TableCell style={{ color: '#E7EEF6' }} className="font-medium">
                        {contrato.numeroContrato}
                      </TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{contrato.dataInicio}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{contrato.dataFim}</TableCell>
                      <TableCell style={{ color: '#E7EEF6' }}>{contrato.plano}</TableCell>
                      <TableCell>{getStatusBadge(contrato.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVisualizarPDF(contrato.arquivo)}
                            className="flex items-center gap-1"
                            style={{ color: '#3BA3FF' }}
                          >
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleBaixarContrato(contrato.arquivo)}
                            className="flex items-center gap-1"
                            style={{ color: '#3BA3FF' }}
                          >
                            <Download className="h-4 w-4" />
                            Baixar
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

        {/* 3. Cópia Digital e Assinatura */}
        <Card className="border" style={{ backgroundColor: '#151924', borderColor: '#20283A' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#3BA3FF15' }}>
                <FileSignature className="h-6 w-6" style={{ color: '#3BA3FF' }} />
              </div>
              <div>
                <CardTitle className="text-2xl" style={{ color: '#E7EEF6' }}>
                  Cópia Digital do Contrato
                </CardTitle>
                <CardDescription style={{ color: '#8EA0B5' }}>
                  Aqui você pode visualizar, baixar ou reenviar a cópia do seu contrato assinado.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg" style={{ backgroundColor: '#0F1115' }}>
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10" style={{ color: '#3BA3FF' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#8EA0B5' }}>
                    Arquivo PDF
                  </p>
                  <p className="text-lg font-semibold" style={{ color: '#E7EEF6' }}>
                    {contratoAtivo.arquivo}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleVisualizarPDF(contratoAtivo.arquivo)}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: '#3BA3FF', color: '#E7EEF6' }}
                >
                  <Eye className="h-4 w-4" />
                  Visualizar PDF
                </Button>
                <Button
                  onClick={handleReenviarEmail}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{ borderColor: '#20283A', color: '#E7EEF6', backgroundColor: 'transparent' }}
                >
                  <Mail className="h-4 w-4" />
                  Reenviar por e-mail
                </Button>
                <Button
                  onClick={() => handleBaixarContrato(contratoAtivo.arquivo)}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{ borderColor: '#20283A', color: '#E7EEF6', backgroundColor: 'transparent' }}
                >
                  <Download className="h-4 w-4" />
                  Baixar Cópia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Visualização do PDF */}
        <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
          <DialogContent 
            className="max-w-4xl h-[90vh]"
            style={{ backgroundColor: '#151924', borderColor: '#20283A' }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: '#E7EEF6' }}>
                Visualização do Contrato Assinado
              </DialogTitle>
              <DialogDescription style={{ color: '#8EA0B5' }}>
                {selectedContract}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden rounded-lg" style={{ backgroundColor: '#0F1115' }}>
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <FileText className="h-24 w-24 mx-auto" style={{ color: '#3BA3FF' }} />
                  <p style={{ color: '#8EA0B5' }}>
                    Visualização de PDF simulada
                  </p>
                  <p className="text-sm" style={{ color: '#8EA0B5' }}>
                    Arquivo: {selectedContract}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => handleBaixarContrato(selectedContract)}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#3BA3FF', color: '#E7EEF6' }}
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
              <Button
                onClick={handleReenviarEmail}
                variant="outline"
                className="flex items-center gap-2"
                style={{ borderColor: '#20283A', color: '#E7EEF6', backgroundColor: 'transparent' }}
              >
                <Mail className="h-4 w-4" />
                Enviar Cópia
              </Button>
              <Button
                onClick={() => setPdfModalOpen(false)}
                variant="outline"
                style={{ borderColor: '#20283A', color: '#E7EEF6', backgroundColor: 'transparent' }}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeuContrato;
