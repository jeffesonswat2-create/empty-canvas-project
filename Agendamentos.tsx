import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agendamento {
  id: string;
  nome: string;
  relatorio: string;
  periodicidade: string;
  horario: string;
  formato: string;
  destinatarios: string;
  ativo: boolean;
}

const Agendamentos = () => {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    relatorio: "",
    periodicidade: "",
    horario: "",
    formato: "",
    destinatarios: ""
  });

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = () => {
    const saved = localStorage.getItem("relatorios_agendamentos");
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    } else {
      const mockData: Agendamento[] = [
        {
          id: "1",
          nome: "Vendas Semanais",
          relatorio: "Vendas por Período",
          periodicidade: "semanal",
          horario: "08:00",
          formato: "PDF",
          destinatarios: "financeiro@empresa.com",
          ativo: true
        },
        {
          id: "2",
          nome: "Fluxo de Caixa Mensal",
          relatorio: "Fluxo de Caixa",
          periodicidade: "mensal",
          horario: "09:00",
          formato: "XLSX",
          destinatarios: "diretoria@empresa.com, contabilidade@empresa.com",
          ativo: true
        }
      ];
      setAgendamentos(mockData);
      localStorage.setItem("relatorios_agendamentos", JSON.stringify(mockData));
    }
  };

  const handleSave = () => {
    const newAgendamento: Agendamento = {
      id: editingId || Date.now().toString(),
      ...formData,
      ativo: true
    };

    let updated;
    if (editingId) {
      updated = agendamentos.map(a => a.id === editingId ? newAgendamento : a);
    } else {
      updated = [...agendamentos, newAgendamento];
    }

    setAgendamentos(updated);
    localStorage.setItem("relatorios_agendamentos", JSON.stringify(updated));

    toast({
      title: editingId ? "Agendamento atualizado" : "Agendamento criado",
      description: "O agendamento foi salvo com sucesso."
    });

    resetForm();
  };

  const handleEdit = (agendamento: Agendamento) => {
    setEditingId(agendamento.id);
    setFormData({
      nome: agendamento.nome,
      relatorio: agendamento.relatorio,
      periodicidade: agendamento.periodicidade,
      horario: agendamento.horario,
      formato: agendamento.formato,
      destinatarios: agendamento.destinatarios
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = agendamentos.filter(a => a.id !== id);
    setAgendamentos(updated);
    localStorage.setItem("relatorios_agendamentos", JSON.stringify(updated));

    toast({
      title: "Agendamento excluído",
      description: "O agendamento foi removido com sucesso."
    });
  };

  const handleToggle = (id: string) => {
    const updated = agendamentos.map(a =>
      a.id === id ? { ...a, ativo: !a.ativo } : a
    );
    setAgendamentos(updated);
    localStorage.setItem("relatorios_agendamentos", JSON.stringify(updated));
  };

  const handleSendNow = (agendamento: Agendamento) => {
    toast({
      title: "Relatório enviado",
      description: `O relatório "${agendamento.nome}" foi enviado para ${agendamento.destinatarios}`
    });
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      relatorio: "",
      periodicidade: "",
      horario: "",
      formato: "",
      destinatarios: ""
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Agendamentos de Relatórios</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar" : "Novo"} Agendamento</DialogTitle>
                  <DialogDescription>
                    Configure a geração automática de relatórios
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Agendamento</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Vendas Semanais"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Relatório</Label>
                    <Select value={formData.relatorio} onValueChange={(v) => setFormData({ ...formData, relatorio: v })}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Selecione o relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas por Período">Vendas por Período</SelectItem>
                        <SelectItem value="Fluxo de Caixa">Fluxo de Caixa</SelectItem>
                        <SelectItem value="Notas Fiscais">Notas Fiscais</SelectItem>
                        <SelectItem value="Consignação">Consignação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Periodicidade</Label>
                      <Select value={formData.periodicidade} onValueChange={(v) => setFormData({ ...formData, periodicidade: v })}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input
                        type="time"
                        value={formData.horario}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato</Label>
                    <Select value={formData.formato} onValueChange={(v) => setFormData({ ...formData, formato: v })}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Formato de saída" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatários (separados por vírgula)</Label>
                    <Input
                      value={formData.destinatarios}
                      onChange={(e) => setFormData({ ...formData, destinatarios: e.target.value })}
                      placeholder="email1@empresa.com, email2@empresa.com"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-card hover:bg-card">
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Relatório</TableHead>
                  <TableHead className="text-muted-foreground">Periodicidade</TableHead>
                  <TableHead className="text-muted-foreground">Horário</TableHead>
                  <TableHead className="text-muted-foreground">Formato</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((agendamento) => (
                  <TableRow key={agendamento.id} className="hover:bg-card/50">
                    <TableCell className="font-medium text-foreground">{agendamento.nome}</TableCell>
                    <TableCell className="text-foreground">{agendamento.relatorio}</TableCell>
                    <TableCell className="text-foreground capitalize">{agendamento.periodicidade}</TableCell>
                    <TableCell className="text-foreground">{agendamento.horario}</TableCell>
                    <TableCell className="text-foreground">{agendamento.formato}</TableCell>
                    <TableCell>
                      <Switch
                        checked={agendamento.ativo}
                        onCheckedChange={() => handleToggle(agendamento.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendNow(agendamento)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(agendamento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(agendamento.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agendamentos;
