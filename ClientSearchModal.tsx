import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
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

interface ClientSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const mockClientes = [
  { id: '1', nome: 'João Silva', documento: '123.456.789-00', telefone: '(11) 98765-4321' },
  { id: '2', nome: 'Maria Santos', documento: '987.654.321-00', telefone: '(11) 91234-5678' },
  { id: '3', nome: 'Empresa XYZ Ltda', documento: '12.345.678/0001-90', telefone: '(11) 3333-4444' },
];

export const ClientSearchModal = ({ open, onClose }: ClientSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState(mockClientes);
  const setCliente = usePdvStore((state) => state.setCliente);
  const setCpfCnpjNota = usePdvStore((state) => state.setCpfCnpjNota);

  const handleSearch = () => {
    if (!searchTerm) {
      setClientes(mockClientes);
      return;
    }

    const filtered = mockClientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documento.includes(searchTerm)
    );
    setClientes(filtered);
  };

  const handleSelectClient = (cliente: typeof mockClientes[0]) => {
    setCliente(cliente);
    setCpfCnpjNota(cliente.documento);

    toast({
      title: 'Cliente selecionado',
      description: `${cliente.nome} foi adicionado à venda.`,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#151924] border-[#20283A]">
        <DialogHeader>
          <DialogTitle className="text-[#E7EEF6]">Buscar Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Digite o nome ou CPF/CNPJ..."
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
            <Button
              variant="outline"
              className="border-[#20283A] hover:bg-[#20283A]"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </div>

          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#20283A] hover:bg-transparent">
                  <TableHead className="text-[#8EA0B5]">Nome</TableHead>
                  <TableHead className="text-[#8EA0B5]">CPF/CNPJ</TableHead>
                  <TableHead className="text-[#8EA0B5]">Telefone</TableHead>
                  <TableHead className="text-[#8EA0B5] text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="border-[#20283A]">
                    <TableCell className="text-[#E7EEF6]">{cliente.nome}</TableCell>
                    <TableCell className="text-[#8EA0B5]">{cliente.documento}</TableCell>
                    <TableCell className="text-[#8EA0B5]">{cliente.telefone}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={() => handleSelectClient(cliente)}
                        className="bg-[#3BA3FF] hover:bg-[#2687E8]"
                      >
                        Selecionar
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
