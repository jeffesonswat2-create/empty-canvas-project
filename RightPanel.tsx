import { Receipt, Save, LogOut, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePdvStore } from '@/stores/usePdvStore';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RightPanelProps {
  onFinalize: () => void;
  onOpenClientSearch: () => void;
  onOpenPresales: () => void;
  onOpenSavePresale: () => void;
}

export const RightPanel = ({ onFinalize, onOpenClientSearch, onOpenPresales, onOpenSavePresale }: RightPanelProps) => {
  const navigate = useNavigate();
  const {
    modeloEmissor,
    cliente,
    cpfCnpjNota,
    vendedor,
    items,
    setModeloEmissor,
    setCpfCnpjNota,
    setVendedor,
    clearCart,
  } = usePdvStore();

  const handleSavePresale = () => {
    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Não há itens no carrinho para salvar como pré-venda.',
        variant: 'destructive',
      });
      return;
    }

    onOpenSavePresale();
  };

  const handleExit = () => {
    if (items.length > 0) {
      if (confirm('Existem itens no carrinho. Deseja realmente sair?')) {
        clearCart();
        navigate('/app/perfil');
      }
    } else {
      navigate('/app/perfil');
    }
  };

  return (
    <div className="space-y-4">
      {/* Modelo Emissor */}
      <Card className="bg-[#151924] border-[#20283A] p-4">
        <Label className="text-[#8EA0B5] text-xs mb-2 block">Modelo Emissor</Label>
        <div className="flex gap-2">
          <Button
            variant={modeloEmissor === 'NFCe' ? 'default' : 'outline'}
            className={modeloEmissor === 'NFCe' 
              ? 'flex-1 bg-[#3BA3FF] hover:bg-[#2687E8]' 
              : 'flex-1 border-[#20283A] hover:bg-[#20283A]'
            }
            onClick={() => setModeloEmissor('NFCe')}
          >
            NFC-e
          </Button>
          <Button
            variant={modeloEmissor === 'NFe' ? 'default' : 'outline'}
            className={modeloEmissor === 'NFe' 
              ? 'flex-1 bg-[#3BA3FF] hover:bg-[#2687E8]' 
              : 'flex-1 border-[#20283A] hover:bg-[#20283A]'
            }
            onClick={() => setModeloEmissor('NFe')}
          >
            NF-e
          </Button>
        </div>
      </Card>

      {/* Cliente */}
      <Card className="bg-[#151924] border-[#20283A] p-4">
        <Label className="text-[#8EA0B5] text-xs mb-2 block">Cliente</Label>
        <Button
          variant="outline"
          className="w-full justify-start border-[#20283A] hover:bg-[#20283A] mb-2"
          onClick={onOpenClientSearch}
        >
          <Users className="w-4 h-4 mr-2" />
          {cliente ? cliente.nome : 'Selecionar cliente'}
        </Button>
        <Input
          placeholder="CPF/CNPJ na nota"
          value={cpfCnpjNota}
          onChange={(e) => setCpfCnpjNota(e.target.value)}
          className="mt-2"
        />
      </Card>

      {/* Pré-vendas */}
      <Card className="bg-[#151924] border-[#20283A] p-4">
        <Button
          variant="outline"
          className="w-full justify-start border-[#20283A] hover:bg-[#20283A]"
          onClick={onOpenPresales}
        >
          <FileText className="w-4 h-4 mr-2" />
          Visualizar pré-vendas
        </Button>
      </Card>

      {/* Vendedor */}
      <Card className="bg-[#151924] border-[#20283A] p-4">
        <Label className="text-[#8EA0B5] text-xs mb-2 block">Vendedor</Label>
        <Select value={vendedor} onValueChange={setVendedor}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Vendedor 1">Vendedor 1</SelectItem>
            <SelectItem value="Vendedor 2">Vendedor 2</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Botões de ação */}
      <div className="space-y-2">
        <Button
          onClick={onFinalize}
          data-finalize-btn
          className="w-full h-14 bg-[#3BA3FF] hover:bg-[#2687E8] text-lg font-semibold"
          disabled={items.length === 0}
        >
          <Receipt className="w-5 h-5 mr-2" />
          Finalizar Venda (F9)
        </Button>

        <Button
          onClick={handleSavePresale}
          variant="outline"
          className="w-full border-[#20283A] hover:bg-[#20283A]"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Pré-venda (F8)
        </Button>

        <Button
          onClick={handleExit}
          variant="outline"
          className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair (F4)
        </Button>
      </div>
    </div>
  );
};
