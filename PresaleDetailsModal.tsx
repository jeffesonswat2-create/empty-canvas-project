import { FileText, Calendar, User, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PresaleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  presale: any;
}

export const PresaleDetailsModal = ({ open, onClose, presale }: PresaleDetailsModalProps) => {
  if (!presale) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#151924] border-[#20283A] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E7EEF6] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes da Pré-venda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cabeçalho */}
          <div className="bg-[#0F1115] rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[#E7EEF6] text-lg font-semibold">{presale.codigo}</h3>
                {presale.nome && (
                  <p className="text-[#8EA0B5] text-sm">{presale.nome}</p>
                )}
              </div>
              <Badge className={getStatusColor(presale.status)}>
                {presale.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8EA0B5]" />
                <div>
                  <p className="text-[#8EA0B5] text-xs">Data de Criação</p>
                  <p className="text-[#E7EEF6] text-sm">{presale.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8EA0B5]" />
                <div>
                  <p className="text-[#8EA0B5] text-xs">Validade</p>
                  <p className="text-[#E7EEF6] text-sm">{presale.validade}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8EA0B5]" />
                <div>
                  <p className="text-[#8EA0B5] text-xs">Cliente</p>
                  <p className="text-[#E7EEF6] text-sm">{presale.cliente}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8EA0B5]" />
                <div>
                  <p className="text-[#8EA0B5] text-xs">Vendedor</p>
                  <p className="text-[#E7EEF6] text-sm">{presale.vendedor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itens */}
          <div>
            <h4 className="text-[#E7EEF6] font-semibold mb-2">Itens da Pré-venda</h4>
            <div className="bg-[#0F1115] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#20283A] hover:bg-transparent">
                    <TableHead className="text-[#8EA0B5]">Produto</TableHead>
                    <TableHead className="text-[#8EA0B5] text-right">Qtd</TableHead>
                    <TableHead className="text-[#8EA0B5] text-right">Preço Unit.</TableHead>
                    <TableHead className="text-[#8EA0B5] text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presale.items?.map((item: any, index: number) => (
                    <TableRow key={index} className="border-[#20283A]">
                      <TableCell className="text-[#E7EEF6]">{item.descricao}</TableCell>
                      <TableCell className="text-[#E7EEF6] text-right">{item.quantidade}</TableCell>
                      <TableCell className="text-[#E7EEF6] text-right">
                        R$ {item.precoUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[#E7EEF6] text-right">
                        R$ {item.totalLinha.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totais */}
          <div className="bg-[#0F1115] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8EA0B5]">Subtotal</span>
              <span className="text-[#E7EEF6]">R$ {presale.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            {presale.descontoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#F59E0B]">Desconto</span>
                <span className="text-[#F59E0B]">- R$ {presale.descontoTotal.toFixed(2)}</span>
              </div>
            )}
            {presale.acrescimoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#22C55E]">Acréscimo</span>
                <span className="text-[#22C55E]">+ R$ {presale.acrescimoTotal.toFixed(2)}</span>
              </div>
            )}
            <Separator className="bg-[#20283A]" />
            <div className="flex justify-between">
              <span className="text-[#E7EEF6] font-semibold">Total</span>
              <span className="text-[#E7EEF6] text-xl font-bold">R$ {presale.valor.toFixed(2)}</span>
            </div>
          </div>

          {/* Observações */}
          {presale.observacoes && (
            <div className="bg-[#0F1115] rounded-xl p-4">
              <h4 className="text-[#E7EEF6] font-semibold mb-2">Observações</h4>
              <p className="text-[#8EA0B5] text-sm">{presale.observacoes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
