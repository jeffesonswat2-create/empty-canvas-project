import { useEffect, useState } from 'react';
import { ShoppingCart, Activity } from 'lucide-react';
import { ItemEntryBar } from '@/components/pdv/ItemEntryBar';
import { ItemsTable } from '@/components/pdv/ItemsTable';
import { RightPanel } from '@/components/pdv/RightPanel';
import { TotalsBar } from '@/components/pdv/TotalsBar';
import { FinalizeModal } from '@/components/pdv/FinalizeModal';
import { ProductSearchModal } from '@/components/pdv/ProductSearchModal';
import { ClientSearchModal } from '@/components/pdv/ClientSearchModal';
import { PresalesModal } from '@/components/pdv/PresalesModal';
import { SavePresaleModal } from '@/components/pdv/SavePresaleModal';
import { Badge } from '@/components/ui/badge';
import { usePdvStore } from '@/stores/usePdvStore';

const Pdv = () => {
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [presalesOpen, setPresalesOpen] = useState(false);
  const [savePresaleOpen, setSavePresaleOpen] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const clearCart = usePdvStore((state) => state.clearCart);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 - Buscar produtos
      if (e.key === 'F2') {
        e.preventDefault();
        setProductSearchOpen(true);
      }
      // F4 - Sair
      if (e.key === 'F4') {
        e.preventDefault();
        if (confirm('Deseja sair do PDV?')) {
          window.location.href = '/app/perfil';
        }
      }
      // F5 - Cancelar venda
      if (e.key === 'F5') {
        e.preventDefault();
        if (confirm('Deseja cancelar a venda atual?')) {
          clearCart();
        }
      }
      // F8 - Salvar pré-venda
      if (e.key === 'F8') {
        e.preventDefault();
        setSavePresaleOpen(true);
      }
      // F9 - Finalizar venda
      if (e.key === 'F9') {
        e.preventDefault();
        setFinalizeOpen(true);
      }
      // Ctrl+K - Foco no código
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Digite ou escaneie"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearCart]);

  return (
    <div className="h-screen flex flex-col bg-[#0F1115] overflow-hidden">
      {/* Header */}
      <div className="bg-[#151924] border-b border-[#20283A] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3BA3FF]/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#3BA3FF]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E7EEF6]">PDV - Ponto de Venda</h1>
              <p className="text-sm text-[#8EA0B5]">Simplix - Sistema de Gestão</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22C55E]" />
              <Badge className="bg-[#22C55E]">CAIXA ABERTO</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-6 overflow-hidden">
        {/* Left side - Cart */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ItemEntryBar onOpenProductSearch={() => setProductSearchOpen(true)} />
          
          <div className="flex-1 overflow-auto mb-4">
            <ItemsTable />
          </div>

          <TotalsBar />
        </div>

        {/* Right side - Config */}
        <div className="w-80 flex-shrink-0 overflow-auto">
          <RightPanel
            onFinalize={() => setFinalizeOpen(true)}
            onOpenClientSearch={() => setClientSearchOpen(true)}
            onOpenPresales={() => setPresalesOpen(true)}
            onOpenSavePresale={() => setSavePresaleOpen(true)}
          />
        </div>
      </div>

      {/* Footer - Shortcuts */}
      <div className="bg-[#151924] border-t border-[#20283A] px-6 py-3">
        <div className="flex items-center justify-between text-xs text-[#8EA0B5]">
          <div className="flex gap-4">
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F2</kbd> Tabela de produtos</span>
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F4</kbd> Sair do PDV</span>
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F5</kbd> Cancelar venda</span>
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F8</kbd> Salvar pré-venda</span>
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F9</kbd> Finalizar venda</span>
            <span><kbd className="px-2 py-1 bg-[#0F1115] rounded border border-[#20283A]">F11</kbd> Tela cheia</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductSearchModal open={productSearchOpen} onClose={() => setProductSearchOpen(false)} />
      <ClientSearchModal open={clientSearchOpen} onClose={() => setClientSearchOpen(false)} />
      <PresalesModal open={presalesOpen} onClose={() => setPresalesOpen(false)} />
      <SavePresaleModal open={savePresaleOpen} onClose={() => setSavePresaleOpen(false)} />
      <FinalizeModal open={finalizeOpen} onClose={() => setFinalizeOpen(false)} />
    </div>
  );
};

export default Pdv;
