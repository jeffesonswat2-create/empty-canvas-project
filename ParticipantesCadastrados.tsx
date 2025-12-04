import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface Participante {
  id: string;
  nome: string;
  tipo: "Cliente" | "Fornecedor" | "Transportadora" | "Outros";
  documento: string;
  cidade: string;
  uf: string;
  qtdeNotas: number;
  ultimaNota: string;
}

// Mock data
const mockParticipantes: Participante[] = [
  { id: "1", nome: "João Silva & Cia", tipo: "Cliente", documento: "12.345.678/0001-90", cidade: "São Paulo", uf: "SP", qtdeNotas: 15, ultimaNota: "15/11/2025" },
  { id: "2", nome: "Maria Santos Distribuidora", tipo: "Fornecedor", documento: "98.765.432/0001-10", cidade: "Rio de Janeiro", uf: "RJ", qtdeNotas: 8, ultimaNota: "14/11/2025" },
  { id: "3", nome: "Transportes Rápidos Ltda", tipo: "Transportadora", documento: "11.222.333/0001-44", cidade: "Belo Horizonte", uf: "MG", qtdeNotas: 22, ultimaNota: "14/11/2025" },
  { id: "4", nome: "Pedro Costa Comércio", tipo: "Cliente", documento: "55.666.777/0001-88", cidade: "Curitiba", uf: "PR", qtdeNotas: 12, ultimaNota: "13/11/2025" },
  { id: "5", nome: "Ana Oliveira ME", tipo: "Cliente", documento: "22.333.444/0001-99", cidade: "Porto Alegre", uf: "RS", qtdeNotas: 5, ultimaNota: "13/11/2025" },
  { id: "6", nome: "Fornecedora Central Ltda", tipo: "Fornecedor", documento: "33.444.555/0001-11", cidade: "Brasília", uf: "DF", qtdeNotas: 18, ultimaNota: "12/11/2025" },
  { id: "7", nome: "Carlos Transportes", tipo: "Transportadora", documento: "44.555.666/0001-22", cidade: "Salvador", uf: "BA", qtdeNotas: 10, ultimaNota: "12/11/2025" },
  { id: "8", nome: "Lúcia Ferreira", tipo: "Cliente", documento: "123.456.789-00", cidade: "Fortaleza", uf: "CE", qtdeNotas: 3, ultimaNota: "11/11/2025" },
  { id: "9", nome: "Roberto Mendes e Filhos", tipo: "Fornecedor", documento: "77.888.999/0001-33", cidade: "Recife", uf: "PE", qtdeNotas: 14, ultimaNota: "11/11/2025" },
  { id: "10", nome: "Indústria Silva", tipo: "Outros", documento: "88.999.000/0001-44", cidade: "Manaus", uf: "AM", qtdeNotas: 7, ultimaNota: "10/11/2025" }
];

interface ParticipantesCadastradosProps {
  searchQuery?: string;
}

export default function ParticipantesCadastrados({ searchQuery = "" }: ParticipantesCadastradosProps) {
  const [filtroTipo, setFiltroTipo] = useState("todos");

  // Filtra por tipo e por busca
  const participantesFiltrados = mockParticipantes.filter(p => {
    const matchTipo = filtroTipo === "todos" || 
      (filtroTipo === "clientes" && p.tipo === "Cliente") ||
      (filtroTipo === "fornecedores" && p.tipo === "Fornecedor") ||
      (filtroTipo === "transportadoras" && p.tipo === "Transportadora");

    const matchSearch = !searchQuery || 
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.documento.includes(searchQuery);

    return matchTipo && matchSearch;
  });

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Cliente":
        return "bg-primary/10 text-primary border-primary/20";
      case "Fornecedor":
        return "bg-success/10 text-success border-success/20";
      case "Transportadora":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Participantes Cadastrados
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral dos participantes do seu cadastro fiscal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Exibir:</span>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="clientes">Clientes</SelectItem>
              <SelectItem value="fornecedores">Fornecedores</SelectItem>
              <SelectItem value="transportadoras">Transportadoras</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Nome / Razão Social</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Tipo</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Documento</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Cidade / UF</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Qtde de Notas</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Última Nota</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {participantesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">
                  Nenhum participante encontrado.
                </td>
              </tr>
            ) : (
              participantesFiltrados.map((participante) => (
                <tr key={participante.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3 text-sm">
                    <span className="font-semibold text-foreground">{participante.nome}</span>
                  </td>
                  <td className="p-3 text-sm">
                    <Badge variant="outline" className={getTipoBadgeVariant(participante.tipo)}>
                      {participante.tipo}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{participante.documento}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {participante.cidade} / {participante.uf}
                  </td>
                  <td className="p-3 text-sm text-center text-foreground">{participante.qtdeNotas}</td>
                  <td className="p-3 text-sm text-muted-foreground">{participante.ultimaNota}</td>
                  <td className="p-3 text-sm">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
