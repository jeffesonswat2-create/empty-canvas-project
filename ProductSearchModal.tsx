import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePdvStore } from '@/stores/usePdvStore';
import { toast } from '@/hooks/use-toast';

interface ProductSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const mockProducts = [
  { codigo: '001', descricao: 'Livro - Clean Code', preco: 89.90, estoque: 15 },
  { codigo: '002', descricao: 'Revista Veja', preco: 12.50, estoque: 50 },
  { codigo: '003', descricao: 'Caneta Azul', preco: 2.50, estoque: 200 },
  { codigo: '004', descricao: 'Caderno 100 folhas', preco: 15.90, estoque: 80 },
  { codigo: '005', descricao: 'Livro - The Pragmatic Programmer', preco: 95.00, estoque: 10 },
];

export const ProductSearchModal = ({ open, onClose }: ProductSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const addItem = usePdvStore((state) => state.addItem);

  const handleSearch = () => {
    if (!searchTerm) {
      setProducts(mockProducts);
      return;
    }

    const filtered = mockProducts.filter(
      (p) =>
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo.includes(searchTerm)
    );
    setProducts(filtered);
  };

  const handleSelectProduct = (product: typeof mockProducts[0]) => {
    addItem({
      codigo: product.codigo,
      descricao: product.descricao,
      unidade: 'UN',
      fator: 1,
      quantidade: 1,
      precoUnitario: product.preco,
      descontoLinha: 0,
      acrescimoLinha: 0,
    });

    toast({
      title: 'Produto adicionado',
      description: `${product.descricao} foi adicionado ao carrinho.`,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#151924] border-[#20283A]">
        <DialogHeader>
          <DialogTitle className="text-[#E7EEF6]">Buscar Produtos (F2)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Digite o código ou nome do produto..."
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA0B5]" />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-[#3BA3FF] hover:bg-[#2687E8]"
            >
              Buscar
            </Button>
          </div>

          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#20283A] hover:bg-transparent">
                  <TableHead className="text-[#8EA0B5]">Código</TableHead>
                  <TableHead className="text-[#8EA0B5]">Descrição</TableHead>
                  <TableHead className="text-[#8EA0B5] text-right">Preço</TableHead>
                  <TableHead className="text-[#8EA0B5] text-right">Estoque</TableHead>
                  <TableHead className="text-[#8EA0B5] text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.codigo} className="border-[#20283A]">
                    <TableCell className="text-[#E7EEF6]">{product.codigo}</TableCell>
                    <TableCell className="text-[#E7EEF6]">{product.descricao}</TableCell>
                    <TableCell className="text-[#E7EEF6] text-right">
                      R$ {product.preco.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[#8EA0B5] text-right">
                      {product.estoque}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={() => handleSelectProduct(product)}
                        className="bg-[#3BA3FF] hover:bg-[#2687E8]"
                      >
                        Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
