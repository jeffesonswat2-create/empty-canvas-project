import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Perfil from "./pages/Perfil";
import Crm from "./pages/Crm";
import MeuContrato from "./pages/MeuContrato";
import Financeiro from "./pages/Financeiro";
import Fiscal from "./pages/Fiscal";
import Configuracoes from "./pages/Configuracoes";
import Ajuda from "./pages/Ajuda";
import Suporte from "./pages/Suporte";
import Automacoes from "./pages/Automacoes";
import Historico from "./pages/Historico";
import NotFound from "./pages/NotFound";

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
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/perfil" replace />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="crm" element={<Crm />} />
            <Route path="meu-contrato" element={<MeuContrato />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="fiscal" element={<Fiscal />} />
            <Route path="automacao" element={<Automacoes />} />
            <Route path="historico" element={<Historico />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="ajuda" element={<Ajuda />} />
            <Route path="suporte" element={<Suporte />} />
            <Route path="gerenciamento/*" element={<Perfil />} />
            <Route path="consignacao/*" element={<Perfil />} />
            <Route path="relatorios/*" element={<Perfil />} />
            <Route path="*" element={<Perfil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
