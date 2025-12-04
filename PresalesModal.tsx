import { useState, useEffect } from 'react';
import { FileText, Download, Ban, Eye, Search, Filter, DollarSign, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { usePdvStore } from '@/stores/usePdvStore';
import { PresaleDetailsModal } from './PresaleDetailsModal';

interface PresalesModalProps {
  open: boolean;
  onClose: () => void;
}

export const PresalesModal = ({ open, onClose }: PresalesModalProps) => {
  const loadPresale = usePdvStore((state) => state.loadPresale);
  const [presales, setPresales] = useState<any[]>([]);
  const [filteredPresales, setFilteredPresales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Aberta');
  const [periodFilter, setPeriodFilter] = useState('30');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPresale, setSelectedPresale] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Carregar pré-vendas do localStorage
  useEffect(() => {
    if (open) {
      const stored = JSON.parse(localStorage.getItem('presales') || '[]');
      
      // Adicionar mock data se não houver pré-vendas
      if (stored.length === 0) {
        const mockData = [
          {
            id: 'PV-2025-001',
            codigo: 'PV-2025-001',
            nome: 'Pré-venda Cliente VIP',
            data: '20/11/2025 14:30',
            dataCriacao: new Date('2025-11-20T14:30:00').toISOString(),
            cliente: 'João Silva',
            cpfCnpj: '123.456.789-00',
            vendedor: 'Admin',
            valor: 2450.00,
            subtotal: 2450.00,
            descontoTotal: 0,
            acrescimoTotal: 0,
            status: 'Aberta',
            validade: '27/11/2025',
            modeloEmissor: 'NFCe',
            items: [
              { id: '1', codigo: '001', descricao: 'Produto A', quantidade: 2, precoUnitario: 500, totalLinha: 1000, unidade: 'UN', fator: 1, descontoLinha: 0, acrescimoLinha: 0 },
              { id: '2', codigo: '002', descricao: 'Produto B', quantidade: 3, precoUnitario: 483.33, totalLinha: 1450, unidade: 'UN', fator: 1, descontoLinha: 0, acrescimoLinha: 0 },
            ],
          },
          {
            id: 'PV-2025-002',
            codigo: 'PV-2025-002',
            nome: 'Orçamento Empresa XYZ',
            data: '19/11/2025 10:15',
            dataCriacao: new Date('2025-11-19T10:15:00').toISOString(),
            cliente: 'Empresa XYZ Ltda',
            cpfCnpj: '12.345.678/0001-00',
            vendedor: 'Vendedor 1',
            valor: 8900.00,
            subtotal: 8900.00,
            descontoTotal: 0,
            acrescimoTotal: 0,
            status: 'Aberta',
            validade: '26/11/2025',
            modeloEmissor: 'NFe',
            items: [
              { id: '1', codigo: '003', descricao: 'Serviço Premium', quantidade: 1, precoUnitario: 8900, totalLinha: 8900, unidade: 'UN', fator: 1, descontoLinha: 0, acrescimoLinha: 0 },
            ],
          },
          {
            id: 'PV-2025-003',
            codigo: 'PV-2025-003',
            data: '15/11/2025 16:45',
            dataCriacao: new Date('2025-11-15T16:45:00').toISOString(),
            cliente: 'Maria Santos',
            cpfCnpj: '987.654.321-00',
            vendedor: 'Admin',
            valor: 1250.00,
            subtotal: 1250.00,
            descontoTotal: 0,
            acrescimoTotal: 0,
            status: 'Convertida',
            validade: '22/11/2025',
            modeloEmissor: 'NFCe',
            dataConversao: '18/11/2025 09:30',
            items: [
              { id: '1', codigo: '004', descricao: 'Produto C', quantidade: 5, precoUnitario: 250, totalLinha: 1250, unidade: 'UN', fator: 1, descontoLinha: 0, acrescimoLinha: 0 },
            ],
          },
          {
            id: 'PV-2025-004',
            codigo: 'PV-2025-004',
            data: '10/11/2025 11:20',
            dataCriacao: new Date('2025-11-10T11:20:00').toISOString(),
            cliente: 'Pedro Oliveira',
            cpfCnpj: '111.222.333-44',
            vendedor: 'Vendedor 2',
            valor: 599.90,
            subtotal: 599.90,
            descontoTotal: 0,
            acrescimoTotal: 0,
            status: 'Expirada',
            validade: '17/11/2025',
            modeloEmissor: 'NFCe',
            items: [
              { id: '1', codigo: '005', descricao: 'Produto D', quantidade: 1, precoUnitario: 599.90, totalLinha: 599.90, unidade: 'UN', fator: 1, descontoLinha: 0, acrescimoLinha: 0 },
            ],
          },
        ];
        setPresales(mockData);
        setFilteredPresales(mockData.filter(p => p.status === 'Aberta'));
      } else {
        setPresales(stored);
        setFilteredPresales(stored.filter((p: any) => p.status === 'Aberta'));
      }
    }
  }, [open]);

  // Filtrar pré-vendas
  useEffect(() => {
    let filtered = [...presales];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpfCnpj?.includes(searchTerm) ||
        p.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFilter !== 'Todas') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filtro de período
    const now = new Date();
    const daysAgo = parseInt(periodFilter);
    filtered = filtered.filter((p) => {
      const date = new Date(p.dataCriacao);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= daysAgo;
    });

    setFilteredPresales(filtered);
  }, [searchTerm, statusFilter, periodFilter, presales]);

  const handleLoadPresale = (presale: any) => {
    if (presale.status === 'Expirada') {
      toast({
        title: 'Pré-venda expirada',
        description: 'Esta pré-venda está expirada. Você pode duplicá-la para criar uma nova.',
        variant: 'destructive',
      });
      return;
    }

    if (presale.status === 'Cancelada') {
      toast({
        title: 'Pré-venda cancelada',
        description: 'Esta pré-venda foi cancelada e não pode ser carregada.',
        variant: 'destructive',
      });
      return;
    }

    loadPresale(presale);
    toast({
      title: 'Pré-venda carregada',
      description: `Pré-venda ${presale.codigo} carregada no carrinho.`,
    });
    onClose();
  };

  const handleConvertPresale = (presale: any) => {
    if (presale.status === 'Expirada') {
      toast({
        title: 'Pré-venda expirada',
        description: 'Esta pré-venda está expirada e não pode ser convertida.',
        variant: 'destructive',
      });
      return;
    }

    loadPresale(presale);
    onClose();
    // O modal de finalização será aberto automaticamente via props
    setTimeout(() => {
      const finalizarBtn = document.querySelector('[data-finalize-btn]') as HTMLButtonElement;
      finalizarBtn?.click();
    }, 100);
  };

  const handleCancelPresale = (presale: any) => {
    setSelectedPresale(presale);
    setCancelDialogOpen(true);
  };

  const confirmCancelPresale = () => {
    const updated = presales.map((p) =>
      p.id === selectedPresale.id ? { ...p, status: 'Cancelada' } : p
    );
    setPresales(updated);
    localStorage.setItem('presales', JSON.stringify(updated));
    
    toast({
      title: 'Pré-venda cancelada',
      description: `Pré-venda ${selectedPresale.codigo} foi cancelada.`,
    });
    
    setCancelDialogOpen(false);
    setSelectedPresale(null);
  };

  const handleViewDetails = (presale: any) => {
    setSelectedPresale(presale);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'bg-[#3BA3FF]';
      case 'Convertida':
        return 'bg-[#22C55E]';
      case 'Expirada':
        return 'bg-[#F59E0B]';
      case 'Cancelada':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#8EA0B5]';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl bg-[#151924] border-[#20283A] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#E7EEF6] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pré-vendas Salvas
            </DialogTitle>
          </DialogHeader>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8EA0B5]" />
                <Input
                  placeholder="Buscar por cliente, CPF/CNPJ ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[#0F1115] border-[#20283A]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-[#0F1115] border-[#20283A]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberta">Abertas</SelectItem>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Convertida">Convertidas</SelectItem>
                <SelectItem value="Expirada">Expiradas</SelectItem>
                <SelectItem value="Cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px] bg-[#0F1115] border-[#20283A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Hoje</SelectItem>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#20283A] hover:bg-transparent">
                  <TableHead className="text-[#8EA0B5]">Código</TableHead>
                  <TableHead className="text-[#8EA0B5]">Data</TableHead>
                  <TableHead className="text-[#8EA0B5]">Cliente</TableHead>
                  <TableHead className="text-[#8EA0B5]">CPF/CNPJ</TableHead>
                  <TableHead className="text-[#8EA0B5]">Vendedor</TableHead>
                  <TableHead className="text-[#8EA0B5] text-right">Valor</TableHead>
                  <TableHead className="text-[#8EA0B5]">Status</TableHead>
                  <TableHead className="text-[#8EA0B5]">Validade</TableHead>
                  <TableHead className="text-[#8EA0B5] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-[#8EA0B5] py-8">
                      Nenhum boleto ou fatura encontrada para o CPF/CNPJ informado dentro dos filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPresales.map((presale) => (
                    <TableRow key={presale.id} className="border-[#20283A]">
                      <TableCell className="text-[#E7EEF6] font-mono">{presale.codigo}</TableCell>
                      <TableCell className="text-[#8EA0B5]">{presale.data}</TableCell>
                      <TableCell className="text-[#E7EEF6]">{presale.cliente}</TableCell>
                      <TableCell className="text-[#8EA0B5]">{presale.cpfCnpj}</TableCell>
                      <TableCell className="text-[#8EA0B5]">{presale.vendedor}</TableCell>
                      <TableCell className="text-[#E7EEF6] text-right">
                        R$ {presale.valor.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(presale.status)}>
                          {presale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#8EA0B5]">{presale.validade}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(presale)}
                            className="border-[#20283A] hover:bg-[#20283A]"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {presale.status === 'Aberta' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleLoadPresale(presale)}
                                className="bg-[#3BA3FF] hover:bg-[#2687E8]"
                                title="Carregar no PDV"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleConvertPresale(presale)}
                                className="bg-[#22C55E] hover:bg-[#16A34A]"
                                title="Converter em venda"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelPresale(presale)}
                                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                                title="Cancelar"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de cancelamento */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-[#151924] border-[#20283A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E7EEF6]">Cancelar Pré-venda</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8EA0B5]">
              Tem certeza que deseja cancelar esta pré-venda? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#20283A] hover:bg-[#20283A]">
              Não, manter
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelPresale}
              className="bg-[#EF4444] hover:bg-[#DC2626]"
            >
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de detalhes */}
      <PresaleDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        presale={selectedPresale}
      />
    </>
  );
};
