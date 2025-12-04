import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

const NotificationDemo = () => {
  const {
    notifyCRM,
    notifyFiscal,
    notifyFinanceiro,
    notifyVendas,
    notifyAutomacoes,
    notifyConsignacao,
    notifySistema,
  } = useNotifications();

  const demoNotifications = [
    {
      label: "CRM - Nova Oportunidade",
      action: () => notifyCRM(
        "Nova oportunidade criada",
        "Oportunidade de R$ 15.000 criada para Cliente XYZ",
        "/app/crm"
      ),
    },
    {
      label: "Fiscal - NF-e Autorizada",
      action: () => notifyFiscal(
        "NF-e autorizada com sucesso",
        "Nota fiscal nº 12345 foi autorizada pela SEFAZ",
        "/app/fiscal"
      ),
    },
    {
      label: "Fiscal - Erro na Emissão",
      action: () => notifyFiscal(
        "Erro ao emitir NF-e",
        "A nota fiscal nº 12346 apresentou erro de validação. Verifique os dados.",
        "/app/fiscal"
      ),
    },
    {
      label: "Fiscal - Certificado Vencendo",
      action: () => notifyFiscal(
        "Certificado digital próximo do vencimento",
        "Seu certificado digital vence em 3 dias. Renove para evitar problemas.",
        "/app/configuracoes"
      ),
    },
    {
      label: "Financeiro - Boleto Vencido",
      action: () => notifyFinanceiro(
        "Boleto vencido",
        "O boleto de R$ 2.500,00 venceu hoje. Verifique o pagamento.",
        "/app/financeiro"
      ),
    },
    {
      label: "Financeiro - Boleto Compensado",
      action: () => notifyFinanceiro(
        "Boleto compensado",
        "Boleto de R$ 5.000,00 foi compensado com sucesso.",
        "/app/financeiro"
      ),
    },
    {
      label: "Vendas - Nova Venda",
      action: () => notifyVendas(
        "Nova venda cadastrada",
        "Venda de R$ 3.200,00 cadastrada para Cliente ABC",
        "/app/pdv"
      ),
    },
    {
      label: "Automações - Fluxo Executado",
      action: () => notifyAutomacoes(
        "Automação executada com sucesso",
        "Fluxo 'Envio de NF-e por email' foi executado para 15 clientes",
        "/app/automacao"
      ),
    },
    {
      label: "Automações - Fluxo Falhou",
      action: () => notifyAutomacoes(
        "Automação falhou",
        "Fluxo 'Importação de produtos' apresentou erro. Verifique os logs.",
        "/app/automacao"
      ),
    },
    {
      label: "Consignação - Produtos Vencendo",
      action: () => notifyConsignacao(
        "Produtos próximos do vencimento",
        "5 produtos em consignação vencem nos próximos 7 dias",
        "/app/consignacao/estoque"
      ),
    },
    {
      label: "Sistema - Login em Novo Dispositivo",
      action: () => notifySistema(
        "Novo login detectado",
        "Foi detectado um login de um novo dispositivo. Se não foi você, altere sua senha.",
        "/app/configuracoes"
      ),
    },
    {
      label: "Sistema - Atualização Disponível",
      action: () => notifySistema(
        "Nova atualização disponível",
        "Uma nova versão do Simplix está disponível com melhorias e correções.",
        "/app/ajuda"
      ),
    },
  ];

  return (
    <Card className="bg-[#151924] border-[#20283A]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#3BA3FF]" />
          <CardTitle className="text-[#E7EEF6]">Demonstração de Notificações</CardTitle>
        </div>
        <CardDescription className="text-[#E7EEF6]/70">
          Clique nos botões abaixo para gerar notificações de exemplo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoNotifications.map((demo, index) => (
            <Button
              key={index}
              onClick={demo.action}
              variant="outline"
              className="justify-start bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:border-[#3BA3FF] hover:text-[#3BA3FF]"
            >
              {demo.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
