import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePdvStore } from '@/stores/usePdvStore';
import { toast } from '@/hooks/use-toast';

interface SavePresaleModalProps {
  open: boolean;
  onClose: () => void;
}

export const SavePresaleModal = ({ open, onClose }: SavePresaleModalProps) => {
  const { items, cliente, vendedor, modeloEmissor, descontoTotal, acrescimoTotal, total, clearCart } = usePdvStore();
  const [nome, setNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Validade padrão: +7 dias
  const defaultValidade = new Date();
  defaultValidade.setDate(defaultValidade.getDate() + 7);
  const [validade, setValidade] = useState(defaultValidade.toISOString().split('T')[0]);

  const handleSave = async () => {
    setSaving(true);

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const preVenda = {
      id: `PV-${Date.now()}`,
      nome: nome || `Pré-venda ${new Date().toLocaleDateString()}`,
      items,
      cliente: cliente || { nome: 'Consumidor final' },
      vendedor,
      modeloEmissor,
      descontoTotal,
      acrescimoTotal,
      total,
      validade,
      observacoes,
      dataCriacao: new Date().toISOString(),
      status: 'Aberta',
    };

    // Salvar no localStorage (mock)
    const presales = JSON.parse(localStorage.getItem('presales') || '[]');
    presales.push(preVenda);
    localStorage.setItem('presales', JSON.stringify(presales));

    toast({
      title: 'Pré-venda salva com sucesso!',
      description: 'Você pode visualizá-la em "Visualizar pré-vendas".',
    });

    setSaving(false);
    clearCart();
    setNome('');
    setObservacoes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#151924] border-[#20283A]">
        <DialogHeader>
          <DialogTitle className="text-[#E7EEF6] flex items-center gap-2">
            <Save className="w-5 h-5" />
            Salvar Pré-venda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cliente */}
          <div>
            <Label className="text-[#8EA0B5] text-xs mb-2 block">Cliente</Label>
            <div className="bg-[#0F1115] border border-[#20283A] rounded-md px-3 py-2">
              <span className="text-[#E7EEF6]">
                {cliente ? cliente.nome : 'Consumidor final'}
              </span>
            </div>
            {!cliente && (
              <Alert className="mt-2 bg-[#F59E0B]/10 border-[#F59E0B]/20">
                <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                <AlertDescription className="text-[#F59E0B] text-xs">
                  É recomendado vincular um cliente à pré-venda.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Nome/Identificação */}
          <div>
            <Label className="text-[#8EA0B5] text-xs mb-2 block">
              Nome/Identificação (opcional)
            </Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Pré-venda João - Orçamento 1"
              className="bg-[#0F1115] border-[#20283A]"
            />
          </div>

          {/* Validade */}
          <div>
            <Label className="text-[#8EA0B5] text-xs mb-2 block">Validade</Label>
            <Input
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="bg-[#0F1115] border-[#20283A]"
            />
          </div>

          {/* Observações */}
          <div>
            <Label className="text-[#8EA0B5] text-xs mb-2 block">
              Observações (opcional)
            </Label>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre esta pré-venda..."
              className="bg-[#0F1115] border-[#20283A] min-h-[80px]"
            />
          </div>

          {/* Resumo */}
          <div className="bg-[#0F1115] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8EA0B5]">Itens no carrinho</span>
              <span className="text-[#E7EEF6]">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8EA0B5]">Vendedor</span>
              <span className="text-[#E7EEF6]">{vendedor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8EA0B5]">Modelo</span>
              <span className="text-[#E7EEF6]">{modeloEmissor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E7EEF6] font-semibold">Total</span>
              <span className="text-[#E7EEF6] text-xl font-bold">R$ {total.toFixed(2)}</span>
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="bg-[#3BA3FF] hover:bg-[#2687E8]"
          >
            {saving ? 'Salvando...' : 'Salvar Pré-venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
