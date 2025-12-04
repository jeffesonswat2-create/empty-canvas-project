import { useState, useRef, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePdvStore } from '@/stores/usePdvStore';
import { toast } from '@/hooks/use-toast';

interface ItemEntryBarProps {
  onOpenProductSearch: () => void;
}

export const ItemEntryBar = ({ onOpenProductSearch }: ItemEntryBarProps) => {
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [valorTotal, setValorTotal] = useState('0,00');
  
  const codigoRef = useRef<HTMLInputElement>(null);
  const quantidadeRef = useRef<HTMLInputElement>(null);
  const addItem = usePdvStore((state) => state.addItem);

  useEffect(() => {
    const qtd = parseFloat(quantidade.replace(',', '.')) || 0;
    const preco = parseFloat(precoUnitario.replace(',', '.')) || 0;
    const total = qtd * preco;
    setValorTotal(total.toFixed(2).replace('.', ','));
  }, [quantidade, precoUnitario]);

  const handleCodigoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && codigo) {
      // Simular busca de produto
      const produto = mockBuscarProduto(codigo);
      if (produto) {
        setDescricao(produto.descricao);
        setPrecoUnitario(produto.preco.toFixed(2).replace('.', ','));
        quantidadeRef.current?.focus();
      } else {
        onOpenProductSearch();
      }
    }
  };

  const handleAddItem = () => {
    if (!codigo || !descricao || !quantidade || !precoUnitario) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha código, descrição, quantidade e preço.',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      codigo,
      descricao,
      unidade: 'UN',
      fator: 1,
      quantidade: parseFloat(quantidade.replace(',', '.')),
      precoUnitario: parseFloat(precoUnitario.replace(',', '.')),
      descontoLinha: 0,
      acrescimoLinha: 0,
    });

    // Limpar campos
    setCodigo('');
    setDescricao('');
    setQuantidade('1');
    setPrecoUnitario('');
    setValorTotal('0,00');
    codigoRef.current?.focus();

    toast({
      title: 'Item adicionado',
      description: 'Produto incluído no carrinho.',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="bg-[#151924] border border-[#20283A] rounded-2xl p-4 mb-4">
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-2">
          <label className="text-xs text-[#8EA0B5] mb-1 block">Código</label>
          <div className="relative">
            <Input
              ref={codigoRef}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={handleCodigoKeyDown}
              placeholder="Digite ou escaneie"
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA0B5]" />
          </div>
        </div>

        <div className="col-span-4">
          <label className="text-xs text-[#8EA0B5] mb-1 block">Descrição</label>
          <Input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição do produto"
            readOnly
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-[#8EA0B5] mb-1 block">Quantidade</label>
          <Input
            ref={quantidadeRef}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1"
            type="text"
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-[#8EA0B5] mb-1 block">Preço Unit.</label>
          <Input
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0,00"
            type="text"
          />
        </div>

        <div className="col-span-1">
          <label className="text-xs text-[#8EA0B5] mb-1 block">Total</label>
          <Input
            value={valorTotal}
            readOnly
            className="bg-[#0F1115]"
          />
        </div>

        <div className="col-span-1">
          <Button
            onClick={handleAddItem}
            className="w-full h-10 bg-[#3BA3FF] hover:bg-[#2687E8]"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mock de busca
const mockBuscarProduto = (codigo: string) => {
  const produtos: Record<string, any> = {
    '001': { descricao: 'Livro - Clean Code', preco: 89.90 },
    '002': { descricao: 'Revista Veja', preco: 12.50 },
    '003': { descricao: 'Caneta Azul', preco: 2.50 },
  };
  return produtos[codigo];
};
