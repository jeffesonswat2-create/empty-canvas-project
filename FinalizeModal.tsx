import { useState } from 'react';
import { CreditCard, Banknote, QrCode, FileText, Mail, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePdvStore } from '@/stores/usePdvStore';
import { toast } from '@/hooks/use-toast';

interface FinalizeModalProps {
  open: boolean;
  onClose: () => void;
}

export const FinalizeModal = ({ open, onClose }: FinalizeModalProps) => {
  const { total, subtotal, descontoTotal, acrescimoTotal, modeloEmissor, preVendaId, clearCart } = usePdvStore();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [valorPago, setValorPago] = useState('');
  const [emitting, setEmitting] = useState(false);

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro', icon: Banknote },
    { id: 'cartao', name: 'Cartão', icon: CreditCard },
    { id: 'pix', name: 'PIX', icon: QrCode },
    { id: 'boleto', name: 'Boleto', icon: FileText },
  ];

  const handleEmitir = async () => {
    if (!selectedPayment) {
      toast({
        title: 'Forma de pagamento obrigatória',
        description: 'Selecione uma forma de pagamento.',
        variant: 'destructive',
      });
      return;
    }

    setEmitting(true);

    // Se a venda veio de uma pré-venda, atualizar o status
    if (preVendaId) {
      const presales = JSON.parse(localStorage.getItem('presales') || '[]');
      const updated = presales.map((p: any) =>
        p.id === preVendaId
          ? {
              ...p,
              status: 'Convertida',
              dataConversao: new Date().toLocaleString('pt-BR'),
            }
          : p
      );
      localStorage.setItem('presales', JSON.stringify(updated));
    }

    // Simular emissão fiscal
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: `${modeloEmissor} Autorizada`,
      description: preVendaId 
        ? 'Nota fiscal emitida com sucesso. Pré-venda convertida em venda.'
        : 'Nota fiscal emitida com sucesso.',
    });

    setEmitting(false);
    clearCart();
    onClose();
  };

  const troco = valorPago ? (parseFloat(valorPago.replace(',', '.')) - total) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#151924] border-[#20283A]">
        <DialogHeader>
          <DialogTitle className="text-[#E7EEF6]">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-[#0F1115] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8EA0B5]">Subtotal</span>
              <span className="text-[#E7EEF6]">R$ {subtotal.toFixed(2)}</span>
            </div>
            {descontoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#F59E0B]">Desconto</span>
                <span className="text-[#F59E0B]">- R$ {descontoTotal.toFixed(2)}</span>
              </div>
            )}
            {acrescimoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#22C55E]">Acréscimo</span>
                <span className="text-[#22C55E]">+ R$ {acrescimoTotal.toFixed(2)}</span>
              </div>
            )}
            <Separator className="bg-[#20283A]" />
            <div className="flex justify-between">
              <span className="text-[#E7EEF6] font-semibold">Total</span>
              <span className="text-[#E7EEF6] text-xl font-bold">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Formas de pagamento */}
          <div>
            <Label className="text-[#8EA0B5] text-xs mb-2 block">Forma de Pagamento</Label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={selectedPayment === method.id ? 'default' : 'outline'}
                    className={selectedPayment === method.id 
                      ? 'bg-[#3BA3FF] hover:bg-[#2687E8] flex-col h-20'
                      : 'border-[#20283A] hover:bg-[#20283A] flex-col h-20'
                    }
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Valor pago e troco */}
          {selectedPayment === 'dinheiro' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#8EA0B5] text-xs mb-1 block">Valor Pago</Label>
                <Input
                  value={valorPago}
                  onChange={(e) => setValorPago(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label className="text-[#8EA0B5] text-xs mb-1 block">Troco</Label>
                <div className="h-10 px-3 py-2 bg-[#0F1115] border border-[#20283A] rounded-md flex items-center">
                  <span className={troco >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                    R$ {Math.abs(troco).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modelo emissor */}
          <div className="flex items-center gap-2">
            <Label className="text-[#8EA0B5] text-sm">Modelo:</Label>
            <Badge className="bg-[#3BA3FF]">{modeloEmissor}</Badge>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#20283A] hover:bg-[#20283A]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEmitir}
            disabled={emitting}
            className="bg-[#3BA3FF] hover:bg-[#2687E8]"
          >
            {emitting ? 'Emitindo...' : `Emitir ${modeloEmissor}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
