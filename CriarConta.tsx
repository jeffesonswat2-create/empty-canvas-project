import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Building, User, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.jpg";

const CriarConta = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados da empresa
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [segmento, setSegmento] = useState("");

  // Dados do responsável
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  // Acesso
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Termos e opções
  const [confirmoResponsavel, setConfirmoResponsavel] = useState(false);
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [receberNovidades, setReceberNovidades] = useState(false);

  // Máscaras
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2");
    }
    return value;
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  // Validações
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, "");
    return numbers.length === 14;
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    return { minLength, hasNumber, hasUpperCase, isValid: minLength && hasNumber && hasUpperCase };
  };

  const passwordValidation = validatePassword(senha);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!razaoSocial.trim() || !nomeFantasia.trim()) {
      toast.error("Por favor, preencha os dados da empresa");
      return;
    }

    if (!validateCNPJ(cnpj)) {
      toast.error("CNPJ inválido");
      return;
    }

    if (!segmento) {
      toast.error("Por favor, selecione o segmento de atuação");
      return;
    }

    if (!nomeCompleto.trim() || !email.trim() || !telefone.trim()) {
      toast.error("Por favor, preencha todos os dados do responsável");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("E-mail inválido");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("A senha não atende aos requisitos mínimos");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não conferem");
      return;
    }

    if (!confirmoResponsavel) {
      toast.error("Você precisa confirmar que é responsável pelos dados informados");
      return;
    }

    if (!aceitoTermos) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade");
      return;
    }

    setLoading(true);

    // Mock: simular criação de conta
    setTimeout(() => {
      toast.success("Conta criada com sucesso! Enviamos um e-mail com as instruções de acesso.");
      
      // Auto-login ou redirecionar para login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${loginHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
            
            {/* Header */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-semibold mb-3" style={{ color: '#3BA3FF' }}>
                  Simplix
                </h2>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Crie sua conta
              </h1>
              <p className="text-muted-foreground">
                Preencha os dados abaixo para começar a usar o Simplix.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Dados da empresa */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(202 100% 62% / 0.2)' }}
                  >
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Dados da empresa</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão social *</Label>
                    <Input
                      id="razaoSocial"
                      type="text"
                      placeholder="Empresa LTDA"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome fantasia *</Label>
                    <Input
                      id="nomeFantasia"
                      type="text"
                      placeholder="Nome comercial"
                      value={nomeFantasia}
                      onChange={(e) => setNomeFantasia(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                      className="bg-secondary border-border"
                      maxLength={18}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inscricaoEstadual">Inscrição estadual</Label>
                    <Input
                      id="inscricaoEstadual"
                      type="text"
                      placeholder="000.000.000.000"
                      value={inscricaoEstadual}
                      onChange={(e) => setInscricaoEstadual(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segmento">Segmento de atuação *</Label>
                  <Select value={segmento} onValueChange={setSegmento} required>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="distribuidora">Distribuidora</SelectItem>
                      <SelectItem value="comercio">Comércio</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="atacado">Atacado</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dados do responsável */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(32 100% 51% / 0.2)' }}
                  >
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Dados do responsável</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome completo *</Label>
                  <Input
                    id="nomeCompleto"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    className="bg-secondary border-border"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                    <Input
                      id="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                      className="bg-secondary border-border"
                      maxLength={15}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    className="bg-secondary border-border"
                    maxLength={14}
                  />
                </div>
              </div>

              {/* Acesso ao sistema */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(142 71% 45% / 0.2)' }}
                  >
                    <Lock className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Acesso ao sistema</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="bg-secondary border-border pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Requisitos de senha */}
                  {senha && (
                    <div className="space-y-1 mt-3 text-xs">
                      <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="h-3 w-3" />
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="h-3 w-3" />
                        <span>Pelo menos 1 número</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="h-3 w-3" />
                        <span>Pelo menos 1 letra maiúscula</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite novamente sua senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="bg-secondary border-border pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmarSenha && confirmarSenha !== senha && (
                    <p className="text-xs text-destructive mt-1">
                      As senhas não conferem
                    </p>
                  )}
                </div>
              </div>

              {/* Termos e opções */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="confirmoResponsavel"
                    checked={confirmoResponsavel}
                    onCheckedChange={(checked) => setConfirmoResponsavel(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="confirmoResponsavel" 
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Confirmo que sou responsável pelos dados informados
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="aceitoTermos"
                    checked={aceitoTermos}
                    onCheckedChange={(checked) => setAceitoTermos(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="aceitoTermos" 
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Li e aceito os{" "}
                    <a href="#" className="text-primary hover:underline">
                      Termos de Uso
                    </a>
                    {" "}e a{" "}
                    <a href="#" className="text-primary hover:underline">
                      Política de Privacidade
                    </a>
                    {" "}*
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="receberNovidades"
                    checked={receberNovidades}
                    onCheckedChange={(checked) => setReceberNovidades(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="receberNovidades" 
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Desejo receber novidades e atualizações por e-mail
                  </Label>
                </div>
              </div>

              {/* Botões */}
              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Já tem uma conta? Entrar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;
