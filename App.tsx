import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Perfil from "./pages/Perfil";
import UserProfile from "./pages/UserProfile";
import Fiscal from "./pages/Fiscal";
import Historico from "./pages/Historico";
import Configuracoes from "./pages/Configuracoes";
import Ajuda from "./pages/Ajuda";
import NotFound from "./pages/NotFound";
import Crm from "./pages/Crm";
import Suporte from "./pages/Suporte";
import MeuContrato from "./pages/MeuContrato";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Automacoes from "./pages/Automacoes";
import Pdv from "./pages/Pdv";
import CartaCorrecao from "./pages/CartaCorrecao";
import Devolucao from "./pages/Devolucao";
import Exportacao from "./pages/Exportacao";
import Etiquetas from "./pages/Etiquetas";
import Importador from "./pages/Importador";
import VisaoGeral from "./pages/consignacao/VisaoGeral";
import EstoqueConsignado from "./pages/consignacao/EstoqueConsignado";
import Envios from "./pages/consignacao/Envios";
import DevolucoesConsignacao from "./pages/consignacao/DevolucoesConsignacao";
import Acertos from "./pages/consignacao/Acertos";
import HistoricoConsignacao from "./pages/consignacao/HistoricoConsignacao";
import RelatoriosConsignacao from "./pages/consignacao/RelatoriosConsignacao";
import RelatorioVendas from "./pages/relatorios/RelatorioVendas";
import RelatorioEstoque from "./pages/relatorios/RelatorioEstoque";
import RelatorioFiscal from "./pages/relatorios/RelatorioFiscal";
import RelatorioClientes from "./pages/relatorios/RelatorioClientes";
import RelatorioUsuarios from "./pages/relatorios/RelatorioUsuarios";
import Parametrizacao from "./pages/Parametrizacao";
import FigurasTributarias from "./pages/FigurasTributarias";
import AutorizacaoXML from "./pages/AutorizacaoXML";
import Transportadora from "./pages/Transportadora";
import CentralNotificacoes from "./pages/CentralNotificacoes";
import RecuperarSenha from "./pages/RecuperarSenha";
import CriarConta from "./pages/CriarConta";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/criar-conta" element={<CriarConta />} />
          {/* PDV route without sidebar */}
          <Route path="/app/pdv" element={<Pdv />} />
          <Route path="/pdv" element={<Pdv />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/perfil" replace />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="crm" element={<Crm />} />
            <Route path="meu-contrato" element={<MeuContrato />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="fiscal" element={<Fiscal />} />
            <Route path="gerenciamento/parametrizacao" element={<Parametrizacao />} />
            <Route path="gerenciamento/figuras-tributarias" element={<FigurasTributarias />} />
            <Route path="gerenciamento/autorizacao-xml" element={<AutorizacaoXML />} />
            <Route path="gerenciamento/transportadora" element={<Transportadora />} />
            <Route path="consignacao/visao-geral" element={<VisaoGeral />} />
            <Route path="consignacao/estoque" element={<EstoqueConsignado />} />
            <Route path="consignacao/envios" element={<Envios />} />
            <Route path="consignacao/devolucoes" element={<DevolucoesConsignacao />} />
            <Route path="consignacao/acertos" element={<Acertos />} />
            <Route path="consignacao/historico" element={<HistoricoConsignacao />} />
            <Route path="consignacao/relatorios" element={<RelatoriosConsignacao />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="relatorios/vendas" element={<RelatorioVendas />} />
            <Route path="relatorios/estoque" element={<RelatorioEstoque />} />
            <Route path="relatorios/fiscal" element={<RelatorioFiscal />} />
            <Route path="relatorios/clientes" element={<RelatorioClientes />} />
            <Route path="relatorios/usuarios" element={<RelatorioUsuarios />} />
            <Route path="automacao" element={<Automacoes />} />
            <Route path="carta-correcao" element={<CartaCorrecao />} />
            <Route path="devolucao" element={<Devolucao />} />
            <Route path="historico" element={<Historico />} />
            <Route path="exportacao" element={<Exportacao />} />
            <Route path="etiquetas" element={<Etiquetas />} />
            <Route path="importador" element={<Importador />} />
            <Route path="suporte" element={<Suporte />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="ajuda" element={<Ajuda />} />
            <Route path="notificacoes" element={<CentralNotificacoes />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
