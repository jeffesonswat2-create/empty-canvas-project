import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePdvStore } from '@/stores/usePdvStore';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const TotalsBar = () => {
  const { acrescimoTotal, descontoTotal, total, setAcrescimoTotal, setDescontoTotal } = usePdvStore();

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Card className="bg-[#151924] border-[#20283A] p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#8EA0B5] text-xs mb-1 block">Acréscimo %</Label>
            <Input
              type="text"
              value={acrescimoTotal.toFixed(2)}
              onChange={(e) => setAcrescimoTotal(parseFloat(e.target.value) || 0)}
              className="h-8"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#151924] border-[#20283A] p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#8EA0B5] text-xs mb-1 block">Desconto %</Label>
            <Input
              type="text"
              value={descontoTotal.toFixed(2)}
              onChange={(e) => setDescontoTotal(parseFloat(e.target.value) || 0)}
              className="h-8"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#151924] border-[#20283A] p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3BA3FF]/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#3BA3FF]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#8EA0B5] text-xs mb-1 block">Total da Compra</Label>
            <div className="text-2xl font-bold text-[#E7EEF6]">
              R$ {total.toFixed(2)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
