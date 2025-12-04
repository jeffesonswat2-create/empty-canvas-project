import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useLayoutDensity } from "@/hooks/useLayoutDensity";
import { 
  Bell, Globe, Palette, Settings, Shield, FileText, Building2, 
  Activity, Save, Copy, Key, CheckCircle2, XCircle, AlertCircle,
  Monitor, Users, CreditCard, Eye, EyeOff, Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ConfigData {
  notificacoes: {
    sistema: boolean;
    email: boolean;
    push: boolean;
    whatsappResumoFiscal: boolean;
  };
  aparencia: {
    tema: string;
    densidade: string;
  };
  idiomaRegiao: {
    idioma: string;
    fuso: string;
    moeda: string;
    formatoData: string;
    separadorNumerico: string;
  };
  preferencias: {
    homePadrao: string;
    dicasAtivas: boolean;
    autosaveFormularios: boolean;
  };
  integracoes: {
    apiKey: string;
    whatsapp: string;
    smtp: string;
    sefaz: { uf: string; certificado: string };
    robos: string;
  };
  faturamento: {
    plano: string;
    status: string;
    proximaCobranca: string;
    pagamento: { tipo: string; final: string };
  };
  seguranca: {
    mfa: boolean;
    sessoes: Array<{ dispositivo: string; local: string; hora: string }>;
  };
  empresa: {
    nome: string;
    logoUrl: string;
    cores: { primaria: string; secundaria: string; fundoRelatorio: string };
    assinaturaFiscal: string;
    rodapeRelatorio: string;
  };
}

const defaultConfig: ConfigData = {
  notificacoes: {
    sistema: true,
    email: true,
    push: false,
    whatsappResumoFiscal: true,
  },
  aparencia: {
    tema: "escuro",
    densidade: "padrao",
  },
  idiomaRegiao: {
    idioma: "pt-BR",
    fuso: "America/Sao_Paulo",
    moeda: "BRL",
    formatoData: "DD/MM/YYYY",
    separadorNumerico: "1.234,56",
  },
  preferencias: {
    homePadrao: "dashboard",
    dicasAtivas: true,
    autosaveFormularios: true,
  },
  integracoes: {
    apiKey: "SIMPLIX_ABC123XYZ789",
    whatsapp: "conectado",
    smtp: "nao_configurado",
    sefaz: { uf: "BA", certificado: "A1-ativo" },
    robos: "ativo",
  },
  faturamento: {
    plano: "profissional",
    status: "ativo",
    proximaCobranca: "2025-11-15",
    pagamento: { tipo: "cartao", final: "2249" },
  },
  seguranca: {
    mfa: false,
    sessoes: [
      { dispositivo: "Chrome (Windows)", local: "São Paulo, BR", hora: "Agora" },
      { dispositivo: "Safari (iPhone)", local: "São Paulo, BR", hora: "2 horas atrás" },
    ],
  },
  empresa: {
    nome: "LR Distribuidora de Livros e Revistas LTDA",
    logoUrl: "",
    cores: { primaria: "#3BA3FF", secundaria: "#FF8A00", fundoRelatorio: "#0F1115" },
    assinaturaFiscal: "",
    rodapeRelatorio: "Simplix © 2025 — Todos os direitos reservados.",
  },
};

const Configuracoes = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { density, setDensity } = useLayoutDensity();
  const [config, setConfig] = useState<ConfigData>(defaultConfig);
  const [originalConfig, setOriginalConfig] = useState<ConfigData>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [mfaDialogOpen, setMfaDialogOpen] = useState(false);
  const [regenerateKeyDialog, setRegenerateKeyDialog] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  // Carregar configurações do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("simplixConfig");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConfig(parsed);
      setOriginalConfig(parsed);
    }
  }, []);

  // Sincronizar tema e densidade com config
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      aparencia: {
        tema: theme,
        densidade: density
      }
    }));
  }, [theme, density]);

  // Detectar mudanças
  useEffect(() => {
    setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
  }, [config, originalConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simular chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem("simplixConfig", JSON.stringify(config));
    setOriginalConfig(config);
    setIsSaving(false);
    
    toast({
      title: "✅ Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(config.integracoes.apiKey);
    toast({
      title: "✅ Chave copiada",
      description: "A chave API foi copiada para a área de transferência.",
    });
  };

  const handleRegenerateApiKey = () => {
    const newKey = `SIMPLIX_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    setConfig({
      ...config,
      integracoes: { ...config.integracoes, apiKey: newKey }
    });
    setRegenerateKeyDialog(false);
    toast({
      title: "✅ Nova chave gerada",
      description: "Não esqueça de atualizar suas integrações com a nova chave.",
    });
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "❌ Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setPasswordDialogOpen(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    toast({
      title: "✅ Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
  };

  const handleToggleMfa = () => {
    if (!config.seguranca.mfa) {
      setMfaDialogOpen(true);
    } else {
      setConfig({
        ...config,
        seguranca: { ...config.seguranca, mfa: false }
      });
      toast({
        title: "🔓 2FA desativado",
        description: "A autenticação em duas etapas foi desativada.",
      });
    }
  };

  const handleActivateMfa = () => {
    setConfig({
      ...config,
      seguranca: { ...config.seguranca, mfa: true }
    });
    setMfaDialogOpen(false);
    toast({
      title: "✅ 2FA ativado",
      description: "A autenticação em duas etapas foi ativada com sucesso.",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "❌ Arquivo muito grande",
          description: "O logo deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({
          ...config,
          empresa: { ...config.empresa, logoUrl: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const auditLogs = [
    { data: "28/10/2025 14:32", usuario: "Agnaldo Cardoso", acao: "Emissão de NF-e", modulo: "Fiscal" },
    { data: "28/10/2025 12:15", usuario: "Agnaldo Cardoso", acao: "Alteração de configurações", modulo: "Sistema" },
    { data: "28/10/2025 10:08", usuario: "Agnaldo Cardoso", acao: "Login no sistema", modulo: "Segurança" },
    { data: "27/10/2025 18:45", usuario: "Agnaldo Cardoso", acao: "Exportação de relatório", modulo: "Relatórios" },
  ];

  return (
    <>
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-background">
        {/* Header */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Configurações
          </h2>
          <p className="text-muted-foreground">
            Gerencie todas as configurações do sistema, integrações e preferências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A) Notificações */}
          <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Notificações</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Gerencie como você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Notificações do sistema</Label>
                  <p className="text-xs text-muted-foreground">Alertas sobre atividades importantes</p>
                </div>
                <Switch
                  checked={config.notificacoes.sistema}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, notificacoes: { ...config.notificacoes, sistema: checked } })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Notificações por e-mail</Label>
                  <p className="text-xs text-muted-foreground">Receba resumos diários por e-mail</p>
                </div>
                <Switch
                  checked={config.notificacoes.email}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, notificacoes: { ...config.notificacoes, email: checked } })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Push no navegador</Label>
                  <p className="text-xs text-muted-foreground">Notificações em tempo real no navegador</p>
                </div>
                <Switch
                  checked={config.notificacoes.push}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, notificacoes: { ...config.notificacoes, push: checked } })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Resumo fiscal diário via WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">Receba relatório automático todos os dias</p>
                </div>
                <Switch
                  checked={config.notificacoes.whatsappResumoFiscal}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, notificacoes: { ...config.notificacoes, whatsappResumoFiscal: checked } })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* B) Aparência */}
          <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Aparência</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Personalize a interface do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Tema</Label>
                <Select
                  value={theme}
                  onValueChange={(value: any) => setTheme(value)}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="escuro" className="text-foreground">Escuro</SelectItem>
                    <SelectItem value="claro" className="text-foreground">Claro</SelectItem>
                    <SelectItem value="automatico" className="text-foreground">Automático</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Mudanças aplicadas instantaneamente em todo o sistema
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Densidade do layout</Label>
                <Select
                  value={density}
                  onValueChange={(value: any) => setDensity(value)}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="compacto" className="text-foreground">Compacto</SelectItem>
                    <SelectItem value="padrao" className="text-foreground">Padrão</SelectItem>
                    <SelectItem value="amplo" className="text-foreground">Amplo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Ajusta espaçamentos, alturas e tamanhos de elementos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* C) Idioma e Região */}
          <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-[#E7EEF6]">Idioma e Região</CardTitle>
              </div>
              <CardDescription className="text-[#E7EEF6]/70">
                Configure idioma, fuso horário e formatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Idioma</Label>
                <Select
                  value={config.idiomaRegiao.idioma}
                  onValueChange={(value) => setConfig({ ...config, idiomaRegiao: { ...config.idiomaRegiao, idioma: value } })}
                >
                  <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151924] border-[#20283A]">
                    <SelectItem value="pt-BR" className="text-[#E7EEF6]">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US" className="text-[#E7EEF6]">English (US)</SelectItem>
                    <SelectItem value="es-ES" className="text-[#E7EEF6]">Español (Latam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Fuso horário</Label>
                <Select
                  value={config.idiomaRegiao.fuso}
                  onValueChange={(value) => setConfig({ ...config, idiomaRegiao: { ...config.idiomaRegiao, fuso: value } })}
                >
                  <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151924] border-[#20283A]">
                    <SelectItem value="America/Sao_Paulo" className="text-[#E7EEF6]">Brasília (GMT-3)</SelectItem>
                    <SelectItem value="America/Manaus" className="text-[#E7EEF6]">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="America/Recife" className="text-[#E7EEF6]">Recife (GMT-3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#E7EEF6]">Moeda</Label>
                  <Select
                    value={config.idiomaRegiao.moeda}
                    onValueChange={(value) => setConfig({ ...config, idiomaRegiao: { ...config.idiomaRegiao, moeda: value } })}
                  >
                    <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151924] border-[#20283A]">
                      <SelectItem value="BRL" className="text-[#E7EEF6]">BRL (R$)</SelectItem>
                      <SelectItem value="USD" className="text-[#E7EEF6]">USD ($)</SelectItem>
                      <SelectItem value="EUR" className="text-[#E7EEF6]">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#E7EEF6]">Formato de data</Label>
                  <Select
                    value={config.idiomaRegiao.formatoData}
                    onValueChange={(value) => setConfig({ ...config, idiomaRegiao: { ...config.idiomaRegiao, formatoData: value } })}
                  >
                    <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151924] border-[#20283A]">
                      <SelectItem value="DD/MM/YYYY" className="text-[#E7EEF6]">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY" className="text-[#E7EEF6]">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD" className="text-[#E7EEF6]">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Separadores numéricos</Label>
                <Select
                  value={config.idiomaRegiao.separadorNumerico}
                  onValueChange={(value) => setConfig({ ...config, idiomaRegiao: { ...config.idiomaRegiao, separadorNumerico: value } })}
                >
                  <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151924] border-[#20283A]">
                    <SelectItem value="1.234,56" className="text-[#E7EEF6]">1.234,56 (pt-BR)</SelectItem>
                    <SelectItem value="1,234.56" className="text-[#E7EEF6]">1,234.56 (en-US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* D) Preferências Gerais */}
          <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-[#E7EEF6]">Preferências Gerais</CardTitle>
              </div>
              <CardDescription className="text-[#E7EEF6]/70">
                Configure comportamentos padrão do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Página inicial padrão</Label>
                <Select
                  value={config.preferencias.homePadrao}
                  onValueChange={(value) => setConfig({ ...config, preferencias: { ...config.preferencias, homePadrao: value } })}
                >
                  <SelectTrigger className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151924] border-[#20283A]">
                    <SelectItem value="dashboard" className="text-[#E7EEF6]">Dashboard</SelectItem>
                    <SelectItem value="crm" className="text-[#E7EEF6]">CRM</SelectItem>
                    <SelectItem value="pdv" className="text-[#E7EEF6]">PDV</SelectItem>
                    <SelectItem value="financeiro" className="text-[#E7EEF6]">Financeiro</SelectItem>
                    <SelectItem value="historico" className="text-[#E7EEF6]">Histórico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#E7EEF6]">Exibir dicas e tutoriais</Label>
                  <p className="text-xs text-[#E7EEF6]/70">Mostrar dicas durante o uso</p>
                </div>
                <Switch
                  checked={config.preferencias.dicasAtivas}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, preferencias: { ...config.preferencias, dicasAtivas: checked } })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#E7EEF6]">Salvar automaticamente formulários</Label>
                  <p className="text-xs text-[#E7EEF6]/70">Evite perda de dados em formulários longos</p>
                </div>
                <Switch
                  checked={config.preferencias.autosaveFormularios}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, preferencias: { ...config.preferencias, autosaveFormularios: checked } })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* E) Integrações e API */}
        <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle className="text-[#E7EEF6]">Integrações e API</CardTitle>
            </div>
            <CardDescription className="text-[#E7EEF6]/70">
              Gerencie suas integrações e chaves de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Chave API Simplix</Label>
              <div className="flex gap-2">
                <Input
                  value={config.integracoes.apiKey}
                  readOnly
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyApiKey}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRegenerateKeyDialog(true)}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary"
                >
                  Gerar nova
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-[#E7EEF6]">Integrações conectadas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-[#0F1115] rounded-lg border border-[#20283A]">
                  <span className="text-[#E7EEF6] text-sm">WhatsApp Business API</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F1115] rounded-lg border border-[#20283A]">
                  <span className="text-[#E7EEF6] text-sm">E-mail SMTP</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Não configurado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F1115] rounded-lg border border-[#20283A]">
                  <span className="text-[#E7EEF6] text-sm">SEFAZ (BA - A1)</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F1115] rounded-lg border border-[#20283A]">
                  <span className="text-[#E7EEF6] text-sm">Robôs/Automações</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              </div>
              <Button
                variant="link"
                className="text-primary hover:text-primary/90 p-0"
                onClick={() => window.location.href = '/app/configuracoes/integracoes'}
              >
                Gerenciar integrações →
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* F) Faturamento e Plano */}
          <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="text-[#E7EEF6]">Faturamento e Plano</CardTitle>
              </div>
              <CardDescription className="text-[#E7EEF6]/70">
                Gerencie seu plano e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#E7EEF6]/70">Plano atual:</span>
                  <span className="text-[#E7EEF6] font-semibold capitalize">{config.faturamento.plano}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E7EEF6]/70">Status:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {config.faturamento.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E7EEF6]/70">Próxima cobrança:</span>
                  <span className="text-[#E7EEF6]">{config.faturamento.proximaCobranca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E7EEF6]/70">Forma de pagamento:</span>
                  <span className="text-[#E7EEF6]">
                    {config.faturamento.pagamento.tipo} •••• {config.faturamento.pagamento.final}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary">
                  Alterar plano
                </Button>
                <Button variant="outline" className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary">
                  Gerenciar pagamento
                </Button>
                <Button variant="outline" className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary">
                  Histórico de cobranças
                </Button>
                <Button variant="outline" className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary">
                  Baixar NF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* G) Segurança e Acesso */}
          <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-[#E7EEF6]">Segurança e Acesso</CardTitle>
              </div>
              <CardDescription className="text-[#E7EEF6]/70">
                Proteja sua conta e gerencie sessões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary"
                onClick={() => setPasswordDialogOpen(true)}
              >
                Alterar senha
              </Button>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#E7EEF6]">Autenticação em 2 etapas (2FA)</Label>
                  <p className="text-xs text-[#E7EEF6]/70">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={config.seguranca.mfa}
                  onCheckedChange={handleToggleMfa}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Sessões ativas</Label>
                <div className="space-y-2">
                  {config.seguranca.sessoes.map((sessao, index) => (
                    <div key={index} className="p-3 bg-[#0F1115] rounded-lg border border-[#20283A]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#E7EEF6] text-sm font-medium">{sessao.dispositivo}</p>
                          <p className="text-[#E7EEF6]/70 text-xs">{sessao.local} • {sessao.hora}</p>
                        </div>
                        <Monitor className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                >
                  Encerrar todas as sessões
                </Button>
              </div>

              <Button
                variant="link"
                className="text-primary hover:text-primary/90 p-0"
                onClick={() => window.location.href = '/app/configuracoes/usuarios'}
              >
                <Users className="h-4 w-4 mr-1" />
                Gerenciar usuários e permissões →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* H) Personalização da Empresa */}
        <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.45s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-[#E7EEF6]">Personalização da Empresa</CardTitle>
            </div>
            <CardDescription className="text-[#E7EEF6]/70">
              Configure a identidade visual da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Nome da empresa</Label>
              <Input
                value={config.empresa.nome}
                onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, nome: e.target.value } })}
                className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Logotipo</Label>
              <div className="flex items-center gap-4">
                {config.empresa.logoUrl ? (
                  <img src={config.empresa.logoUrl} alt="Logo" className="h-20 w-20 object-contain border border-[#20283A] rounded-lg p-2 bg-[#0F1115]" />
                ) : (
                  <div className="h-20 w-20 border border-[#20283A] rounded-lg flex items-center justify-center bg-[#0F1115]">
                    <Building2 className="h-8 w-8 text-[#E7EEF6]/30" />
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block">
                      Escolher logo
                    </div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-[#E7EEF6]/70 mt-1">PNG ou JPG, até 2MB. Fundo transparente recomendado.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Cor primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.empresa.cores.primaria}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, primaria: e.target.value } } })}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={config.empresa.cores.primaria}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, primaria: e.target.value } } })}
                    className="flex-1 bg-[#0F1115] border-[#20283A] text-[#E7EEF6] font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Cor secundária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.empresa.cores.secundaria}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, secundaria: e.target.value } } })}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={config.empresa.cores.secundaria}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, secundaria: e.target.value } } })}
                    className="flex-1 bg-[#0F1115] border-[#20283A] text-[#E7EEF6] font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#E7EEF6]">Fundo dos relatórios</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.empresa.cores.fundoRelatorio}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, fundoRelatorio: e.target.value } } })}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={config.empresa.cores.fundoRelatorio}
                    onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, cores: { ...config.empresa.cores, fundoRelatorio: e.target.value } } })}
                    className="flex-1 bg-[#0F1115] border-[#20283A] text-[#E7EEF6] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Assinatura eletrônica dos documentos fiscais</Label>
              <Textarea
                value={config.empresa.assinaturaFiscal}
                onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, assinaturaFiscal: e.target.value } })}
                placeholder="Texto que aparecerá nos documentos fiscais..."
                className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Rodapé dos relatórios</Label>
              <Textarea
                value={config.empresa.rodapeRelatorio}
                onChange={(e) => setConfig({ ...config, empresa: { ...config.empresa, rodapeRelatorio: e.target.value } })}
                placeholder="Texto que aparecerá no rodapé dos relatórios..."
                className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* I) Auditoria e Logs */}
        <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-[#E7EEF6]">Auditoria e Logs</CardTitle>
            </div>
            <CardDescription className="text-[#E7EEF6]/70">
              Acompanhe as atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Filtrar por usuário, ação ou módulo..."
                className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
              />
              <Button variant="outline" className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary">
                <FileText className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            <div className="border border-[#20283A] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#0F1115] border-[#20283A] hover:bg-[#0F1115]">
                    <TableHead className="text-[#E7EEF6]">Data</TableHead>
                    <TableHead className="text-[#E7EEF6]">Usuário</TableHead>
                    <TableHead className="text-[#E7EEF6]">Ação</TableHead>
                    <TableHead className="text-[#E7EEF6]">Módulo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow key={index} className="border-[#20283A] hover:bg-[#0F1115]/50">
                      <TableCell className="text-[#E7EEF6]/70">{log.data}</TableCell>
                      <TableCell className="text-[#E7EEF6]">{log.usuario}</TableCell>
                      <TableCell className="text-[#E7EEF6]">{log.acao}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-[#0F1115] text-[#E7EEF6] border-[#20283A]">
                          {log.modulo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Botão Salvar Flutuante */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar alterações
              </>
            )}
          </Button>
        </div>
      )}

      {/* Dialog: Alterar Senha */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-[#151924] border-[#20283A]">
          <DialogHeader>
            <DialogTitle className="text-[#E7EEF6]">Alterar senha</DialogTitle>
            <DialogDescription className="text-[#E7EEF6]/70">
              Crie uma nova senha segura para sua conta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Senha atual</Label>
              <div className="relative">
                <Input
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E7EEF6]/50 hover:text-[#E7EEF6]"
                >
                  {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Nova senha</Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E7EEF6]/50 hover:text-[#E7EEF6]"
                >
                  {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E7EEF6]/50 hover:text-[#E7EEF6]"
                >
                  {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setPasswordDialogOpen(false);
                setPasswordForm({ current: "", new: "", confirm: "" });
              }}
              className="text-[#E7EEF6] hover:bg-[#0F1115]"
            >
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Alterar senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ativar 2FA */}
      <Dialog open={mfaDialogOpen} onOpenChange={setMfaDialogOpen}>
        <DialogContent className="bg-[#151924] border-[#20283A]">
          <DialogHeader>
            <DialogTitle className="text-[#E7EEF6]">Ativar autenticação em 2 etapas</DialogTitle>
            <DialogDescription className="text-[#E7EEF6]/70">
              Escaneie o QR code com seu app autenticador
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-[#E7EEF6] rounded-lg flex items-center justify-center">
                <p className="text-[#0F1115] text-xs">QR Code</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#E7EEF6]">Código de verificação</Label>
              <Input
                placeholder="000000"
                maxLength={6}
                className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6] text-center text-2xl tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setMfaDialogOpen(false)}
              className="text-[#E7EEF6] hover:bg-[#0F1115]"
            >
              Cancelar
            </Button>
            <Button onClick={handleActivateMfa} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Ativar 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Regenerar API Key */}
      <AlertDialog open={regenerateKeyDialog} onOpenChange={setRegenerateKeyDialog}>
        <AlertDialogContent className="bg-[#151924] border-[#20283A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E7EEF6]">Gerar nova chave API?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#E7EEF6]/70">
              A chave atual será invalidada imediatamente. Você precisará atualizar todas as suas integrações com a nova chave.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerateApiKey}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Gerar nova chave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Configuracoes;
