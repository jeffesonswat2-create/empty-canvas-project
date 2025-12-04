import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.jpg";

type Step = "identify" | "reset";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("identify");
  const [loading, setLoading] = useState(false);

  // Etapa 1 - Identificação
  const [identifier, setIdentifier] = useState("");

  // Etapa 2 - Código e nova senha
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validação de CPF ou e-mail
  const validateIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    return emailRegex.test(value) || cpfRegex.test(value);
  };

  // Validação de senha
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    return { minLength, hasNumber, hasUpperCase, isValid: minLength && hasNumber && hasUpperCase };
  };

  const passwordValidation = validatePassword(newPassword);

  // Etapa 1 - Enviar código
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateIdentifier(identifier)) {
      toast.error("Por favor, insira um e-mail ou CPF válido");
      return;
    }

    setLoading(true);

    // Mock: simular envio do código
    setTimeout(() => {
      // Simular usuário não encontrado (10% de chance para demo)
      if (Math.random() < 0.1) {
        toast.error("Não encontramos nenhuma conta com esse e-mail ou CPF.");
        setLoading(false);
        return;
      }

      toast.success("Enviamos um código de verificação para o e-mail cadastrado.");
      setStep("reset");
      setLoading(false);
    }, 1500);
  };

  // Reenviar código
  const handleResendCode = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Código reenviado com sucesso!");
      setLoading(false);
    }, 1000);
  };

  // Etapa 2 - Salvar nova senha
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Por favor, insira o código de verificação");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("A senha não atende aos requisitos mínimos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }

    setLoading(true);

    // Mock: validar código
    setTimeout(() => {
      // Simular código inválido (20% de chance para demo)
      if (Math.random() < 0.2) {
        toast.error("Código inválido ou expirado.");
        setLoading(false);
        return;
      }

      // Sucesso
      toast.success("Senha redefinida com sucesso! Você já pode fazer login com a nova senha.");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
      setLoading(false);
    }, 1500);
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
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
            
            {/* Etapa 1: Identificação */}
            {step === "identify" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(202 100% 62% / 0.2)' }}
                    >
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        Esqueceu sua senha?
                      </h1>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Informe seu e-mail ou CPF cadastrado para enviarmos um código de verificação.
                  </p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">E-mail ou CPF</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="seu@email.com ou 000.000.000-00"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar código de verificação"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar para o login
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Etapa 2: Código e Nova Senha */}
            {step === "reset" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(202 100% 62% / 0.2)' }}
                    >
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        Redefinir senha
                      </h1>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Digite o código que você recebeu e defina uma nova senha para sua conta.
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-6">
                  {/* Código de verificação */}
                  <div className="space-y-2">
                    <Label htmlFor="code">Código de verificação</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Código enviado por e-mail"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="bg-secondary border-border text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  {/* Nova senha */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-secondary border-border pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    {/* Requisitos de senha */}
                    {newPassword && (
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

                  {/* Confirmar senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite novamente sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-destructive mt-1">
                        As senhas não conferem
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                    disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  >
                    {loading ? "Salvando..." : "Salvar nova senha"}
                  </Button>

                  <div className="space-y-3">
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="text-sm text-primary hover:underline"
                      >
                        Reenviar código
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para o login
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
