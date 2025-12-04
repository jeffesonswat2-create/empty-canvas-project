import { Edit2, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePdvStore } from '@/stores/usePdvStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const ItemsTable = () => {
  const items = usePdvStore((state) => state.items);
  const removeItem = usePdvStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="bg-[#151924] border border-[#20283A] rounded-2xl p-8 text-center">
        <p className="text-[#8EA0B5]">Nenhum item no carrinho</p>
        <p className="text-sm text-[#8EA0B5] mt-2">Use F2 para buscar produtos ou escaneie o código de barras</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151924] border border-[#20283A] rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#20283A] hover:bg-transparent">
            <TableHead className="text-[#8EA0B5] w-12">#</TableHead>
            <TableHead className="text-[#8EA0B5]">Descrição</TableHead>
            <TableHead className="text-[#8EA0B5] w-24">Código</TableHead>
            <TableHead className="text-[#8EA0B5] w-16">Unid.</TableHead>
            <TableHead className="text-[#8EA0B5] w-20 text-right">Qtd.</TableHead>
            <TableHead className="text-[#8EA0B5] w-28 text-right">Vl. Unit.</TableHead>
            <TableHead className="text-[#8EA0B5] w-28 text-right">Vl. Total</TableHead>
            <TableHead className="text-[#8EA0B5] w-32 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} className="border-[#20283A]">
              <TableCell className="text-[#E7EEF6]">{index + 1}</TableCell>
              <TableCell className="text-[#E7EEF6]">{item.descricao}</TableCell>
              <TableCell className="text-[#8EA0B5]">{item.codigo}</TableCell>
              <TableCell className="text-[#8EA0B5]">{item.unidade}</TableCell>
              <TableCell className="text-[#E7EEF6] text-right">
                {item.quantidade.toFixed(2)}
              </TableCell>
              <TableCell className="text-[#E7EEF6] text-right">
                R$ {item.precoUnitario.toFixed(2)}
              </TableCell>
              <TableCell className="text-[#E7EEF6] text-right font-semibold">
                R$ {item.totalLinha.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#8EA0B5] hover:text-[#3BA3FF] hover:bg-[#20283A]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#8EA0B5] hover:text-[#3BA3FF] hover:bg-[#20283A]"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 text-[#8EA0B5] hover:text-[#EF4444] hover:bg-[#20283A]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
