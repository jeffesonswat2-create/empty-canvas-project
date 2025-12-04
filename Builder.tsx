import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  Trash2,
  Zap,
  GitBranch,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface BuilderProps {
  mode: "create" | "edit";
  automacaoId: string | null;
  onClose: () => void;
}

interface Step {
  id: string;
  type: "trigger" | "condition" | "action";
  config: Record<string, any>;
}

export function Builder({ mode, automacaoId, onClose }: BuilderProps) {
  const [nome, setNome] = useState(
    mode === "edit" ? "Cobrança automática de boletos" : ""
  );
  const [descricao, setDescricao] = useState(
    mode === "edit"
      ? "Envia e-mail de lembrete 3, 7 e 14 dias antes do vencimento"
      : ""
  );
  const [steps, setSteps] = useState<Step[]>(
    mode === "edit"
      ? [
          {
            id: "1",
            type: "trigger",
            config: { tipo: "financeiro", evento: "boleto_em_aberto" },
          },
          {
            id: "2",
            type: "condition",
            config: {
              tipo: "comparacao",
              campo: "dias_vencimento",
              operador: "<=",
              valor: "14",
            },
          },
          {
            id: "3",
            type: "action",
            config: {
              tipo: "enviar_email",
              destinatario: "{{cliente.email}}",
              assunto: "Lembrete de boleto",
            },
          },
        ]
      : []
  );
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const handleAddStep = (type: "trigger" | "condition" | "action") => {
    const newStep: Step = {
      id: Date.now().toString(),
      type,
      config: {},
    };
    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    if (selectedStep === id) setSelectedStep(null);
  };

  const handleSave = () => {
    if (!nome) {
      toast.error("Nome da automação é obrigatório");
      return;
    }
    if (steps.length === 0) {
      toast.error("Adicione pelo menos um disparador");
      return;
    }
    toast.success(
      mode === "create"
        ? "Automação criada com sucesso"
        : "Automação atualizada com sucesso"
    );
    onClose();
  };

  const handleTest = () => {
    toast.info("Executando teste da automação...");
    setTimeout(() => {
      toast.success("Teste concluído com sucesso");
    }, 2000);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "trigger":
        return Zap;
      case "condition":
        return GitBranch;
      case "action":
        return Send;
      default:
        return Zap;
    }
  };

  const getStepLabel = (step: Step) => {
    switch (step.type) {
      case "trigger":
        return step.config.evento || "Disparador";
      case "condition":
        return step.config.tipo || "Condição";
      case "action":
        return step.config.tipo || "Ação";
      default:
        return "Etapa";
    }
  };

  const currentStep = steps.find((s) => s.id === selectedStep);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === "create" ? "Nova Automação" : "Editar Automação"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure disparadores, condições e ações
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest} className="gap-2">
              <Play className="w-4 h-4" />
              Testar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Configurações básicas */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Configurações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da automação</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Cobrança automática de boletos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o que esta automação faz..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flow canvas */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fluxo de Automação</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddStep("trigger")}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Disparador
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddStep("condition")}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Condição
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddStep("action")}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ação
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Adicione um disparador para começar
                    </div>
                  ) : (
                    steps.map((step, index) => {
                      const Icon = getStepIcon(step.type);
                      return (
                        <div key={step.id}>
                          <Card
                            className={`cursor-pointer transition-colors ${
                              selectedStep === step.id
                                ? "border-primary bg-card/80"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedStep(step.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-5 h-5 text-primary" />
                                  <div>
                                    <Badge variant="outline" className="mb-1">
                                      {step.type === "trigger" && "Disparador"}
                                      {step.type === "condition" && "Condição"}
                                      {step.type === "action" && "Ação"}
                                    </Badge>
                                    <p className="font-medium">
                                      {getStepLabel(step)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveStep(step.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          {index < steps.length - 1 && (
                            <div className="flex justify-center py-2">
                              <div className="w-0.5 h-6 bg-border" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties panel */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Propriedades</CardTitle>
              </CardHeader>
              <CardContent>
                {!currentStep ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Selecione uma etapa para configurar
                  </div>
                ) : (
                  <Tabs defaultValue="config">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="config">Config</TabsTrigger>
                      <TabsTrigger value="help">Ajuda</TabsTrigger>
                    </TabsList>
                    <TabsContent value="config" className="space-y-4 mt-4">
                      {currentStep.type === "trigger" && (
                        <>
                          <div className="space-y-2">
                            <Label>Tipo de disparador</Label>
                            <Select defaultValue={currentStep.config.tipo || ""}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vendas">Vendas</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="fiscal">Fiscal</SelectItem>
                                <SelectItem value="crm">CRM</SelectItem>
                                <SelectItem value="consignacao">
                                  Consignação
                                </SelectItem>
                                <SelectItem value="webhook">Webhook</SelectItem>
                                <SelectItem value="agendamento">
                                  Agendamento
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Evento</Label>
                            <Input placeholder="Ex: pedido_criado" />
                          </div>
                        </>
                      )}
                      {currentStep.type === "condition" && (
                        <>
                          <div className="space-y-2">
                            <Label>Tipo de condição</Label>
                            <Select defaultValue={currentStep.config.tipo || ""}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="comparacao">Comparação</SelectItem>
                                <SelectItem value="intervalo">Intervalo</SelectItem>
                                <SelectItem value="lista">Em lista</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Campo</Label>
                            <Input placeholder="Ex: valor_total" />
                          </div>
                          <div className="space-y-2">
                            <Label>Operador</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="=">=</SelectItem>
                                <SelectItem value="!=">!=</SelectItem>
                                <SelectItem value=">">{'>'}</SelectItem>
                                <SelectItem value="<">{'<'}</SelectItem>
                                <SelectItem value=">=">{'>='}</SelectItem>
                                <SelectItem value="<=">{'<='}</SelectItem>
                                <SelectItem value="contem">Contém</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Valor</Label>
                            <Input placeholder="Ex: 1000" />
                          </div>
                        </>
                      )}
                      {currentStep.type === "action" && (
                        <>
                          <div className="space-y-2">
                            <Label>Tipo de ação</Label>
                            <Select defaultValue={currentStep.config.tipo || ""}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enviar_email">
                                  Enviar e-mail
                                </SelectItem>
                                <SelectItem value="enviar_whatsapp">
                                  Enviar WhatsApp
                                </SelectItem>
                                <SelectItem value="criar_tarefa">
                                  Criar tarefa CRM
                                </SelectItem>
                                <SelectItem value="gerar_boleto">
                                  Gerar boleto
                                </SelectItem>
                                <SelectItem value="emitir_nfe">Emitir NFe</SelectItem>
                                <SelectItem value="webhook">
                                  Chamar webhook
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Destinatário</Label>
                            <Input
                              placeholder="Ex: {{cliente.email}}"
                              defaultValue={currentStep.config.destinatario}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Conteúdo</Label>
                            <Textarea
                              placeholder="Use variáveis como {{cliente.nome}}"
                              rows={4}
                            />
                          </div>
                        </>
                      )}
                    </TabsContent>
                    <TabsContent value="help" className="mt-4">
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p className="font-medium text-foreground">
                          Variáveis disponíveis:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>{'{{cliente.nome}}'}</li>
                          <li>{'{{cliente.email}}'}</li>
                          <li>{'{{pedido.id}}'}</li>
                          <li>{'{{pedido.valor}}'}</li>
                          <li>{'{{nf.chave}}'}</li>
                          <li>{'{{data}}'}</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
