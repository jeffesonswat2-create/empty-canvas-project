import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelChart as RechartsFunnel, Funnel, Cell, LabelList, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Prospecção", value: 42, amount: 150000 },
  { name: "Contato Inicial", value: 30, amount: 120000 },
  { name: "Proposta", value: 18, amount: 90000 },
  { name: "Negociação", value: 10, amount: 60000 },
  { name: "Fechado (Ganho)", value: 6, amount: 45000 },
];

const COLORS = ["#3BA3FF", "#2E96E8", "#2687E8", "#1E78D1", "#1669BA"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="p-3 rounded-lg border"
        style={{
          backgroundColor: "#151924",
          borderColor: "#20283A",
        }}
      >
        <p className="font-medium mb-1" style={{ color: "#E7EEF6" }}>
          {data.name}
        </p>
        <p className="text-sm" style={{ color: "#8EA0B5" }}>
          Quantidade: {data.value} oportunidades
        </p>
        <p className="text-sm" style={{ color: "#8EA0B5" }}>
          Valor: R$ {data.amount.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelChart = () => {
  return (
    <Card
      className="border"
      style={{
        backgroundColor: "#151924",
        borderColor: "#20283A",
      }}
    >
      <CardHeader>
        <CardTitle style={{ color: "#E7EEF6" }}>Funil de Vendas</CardTitle>
        <CardDescription style={{ color: "#8EA0B5" }}>
          Visualize o pipeline de oportunidades por etapa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsFunnel>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                position="right"
                fill="#E7EEF6"
                stroke="none"
                dataKey="name"
                style={{ fontSize: "14px" }}
              />
            </Funnel>
          </RechartsFunnel>
        </ResponsiveContainer>
        
        {/* Legenda personalizada */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center gap-2 p-2 rounded"
              style={{ backgroundColor: "#0F1115" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <div>
                <p className="text-xs font-medium" style={{ color: "#E7EEF6" }}>
                  {entry.value}
                </p>
                <p className="text-xs" style={{ color: "#8EA0B5" }}>
                  {entry.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};