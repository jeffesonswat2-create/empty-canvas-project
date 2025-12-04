import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, TrendingUp, FileText, AlertCircle, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface TemplatesProps {
  onCreate: () => void;
}

export function Templates({ onCreate }: TemplatesProps) {
  const templates = [
    {
      id: "tpl-001",
      nome: "Cobrança automática de boletos",
      descricao:
        "Envia lembretes ao cliente 3, 7 e 14 dias antes do vencimento do boleto",
      categoria: "Financeiro",
      icon: Clock,
      popular: true,
    },
    {
      id: "tpl-002",
      nome: "Follow-up pós-venda",
      descricao:
        "Envia e-mail de agradecimento e pesquisa de satisfação 7 dias após a compra",
      categoria: "Vendas",
      icon: Mail,
      popular: true,
    },
    {
      id: "tpl-003",
      nome: "Reprocessar rejeições fiscais",
      descricao:
        "Tenta corrigir e reenviar automaticamente notas fiscais rejeitadas pela SEFAZ",
      categoria: "Fiscal",
      icon: FileText,
      popular: false,
    },
    {
      id: "tpl-004",
      nome: "Qualificar lead",
      descricao:
        "Cria tarefa no CRM e envia e-mail de boas-vindas quando lead entra via formulário",
      categoria: "CRM",
      icon: TrendingUp,
      popular: true,
    },
    {
      id: "tpl-005",
      nome: "Alerta de expiração de consignação",
      descricao:
        "Notifica cliente 5 dias antes da data limite de retorno e envia resumo financeiro",
      categoria: "Consignação",
      icon: AlertCircle,
      popular: false,
    },
    {
      id: "tpl-006",
      nome: "Relatório diário de KPIs",
      descricao:
        "Exporta indicadores de vendas, fiscal e financeiro para planilha e envia por e-mail",
      categoria: "BI",
      icon: BarChart3,
      popular: false,
    },
  ];

  const handleUseTemplate = (templateId: string) => {
    toast.success("Template aplicado! Configure os detalhes específicos.");
    onCreate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Templates Populares</h3>
        <p className="text-sm text-muted-foreground">
          Comece rapidamente com modelos prontos e personalize conforme necessário
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                  {template.popular && (
                    <Badge variant="default" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base">{template.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground min-h-[60px]">
                  {template.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.categoria}</Badge>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Usar template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
