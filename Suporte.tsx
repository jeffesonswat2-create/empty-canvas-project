import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Headphones, Briefcase, Wallet, Send, Mail, MessageSquare, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

const Suporte = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: "",
    assunto: "",
    mensagem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.tipo || !formData.assunto || !formData.mensagem) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    toast.success("✅ Sua mensagem foi enviada para o suporte.");
    setFormData({ nome: "", email: "", tipo: "", assunto: "", mensagem: "" });
  };

  const openWhatsApp = (phone: string) => {
    window.open(`https://api.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}`, '_blank');
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const contactCards = [
    {
      icon: Headphones,
      title: "Suporte Técnico",
      description: "Precisando de ajuda com o sistema Simplix? Fale com nossa equipe técnica.",
      email: "suporte@simplix.com.br",
      whatsapp: "(71) 99999-9999",
      horario: "Segunda a Sexta, 8h às 18h",
      buttons: [
        { label: "Abrir Chat de Suporte", icon: MessageSquare, action: () => toast.info("Em breve: suporte via chat integrado") },
        { label: "Enviar e-mail", icon: Mail, action: () => sendEmail("suporte@simplix.com.br") }
      ],
      color: "#3BA3FF"
    },
    {
      icon: Briefcase,
      title: "Suporte Comercial",
      description: "Dúvidas sobre planos, licenças ou upgrade? Fale com nosso time comercial.",
      email: "comercial@simplix.com.br",
      whatsapp: "(71) 98888-8888",
      horario: "Segunda a Sexta, 9h às 17h",
      buttons: [
        { label: "Falar com Vendas", icon: Phone, action: () => openWhatsApp("71988888888") },
        { label: "Solicitar Proposta", icon: Mail, action: () => sendEmail("comercial@simplix.com.br") }
      ],
      color: "#22C55E"
    },
    {
      icon: Wallet,
      title: "Suporte Financeiro",
      description: "Questões de cobrança, notas fiscais e pagamentos.",
      email: "financeiro@simplix.com.br",
      whatsapp: "(71) 97777-7777",
      horario: "Segunda a Sexta, 8h às 17h",
      buttons: [
        { label: "Enviar Comprovante", icon: Send, action: () => sendEmail("financeiro@simplix.com.br") },
        { label: "Solicitar Nota Fiscal", icon: Mail, action: () => sendEmail("financeiro@simplix.com.br") }
      ],
      color: "#F59E0B"
    }
  ];

  return (
    <div className="min-h-screen p-6 overflow-y-auto scrollbar-none" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: '#E7EEF6' }}>
            Suporte
          </h1>
          <p className="text-base" style={{ color: '#8EA0B5' }}>
            Encontre aqui todos os canais para falar com nossa equipe de suporte, comercial e financeiro.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactCards.map((card, index) => (
            <Card key={index} className="border transition-all duration-300 hover:shadow-lg" style={{ 
              backgroundColor: '#151924', 
              borderColor: '#20283A',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${card.color}15` }}>
                    <card.icon className="h-6 w-6" style={{ color: card.color }} />
                  </div>
                  <CardTitle className="text-xl" style={{ color: '#E7EEF6' }}>
                    {card.title}
                  </CardTitle>
                </div>
                <CardDescription style={{ color: '#8EA0B5' }}>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: '#0F1115' }}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: '#8EA0B5' }} />
                    <span className="text-sm" style={{ color: '#E7EEF6' }}>{card.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" style={{ color: '#8EA0B5' }} />
                    <span className="text-sm" style={{ color: '#E7EEF6' }}>{card.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: '#8EA0B5' }} />
                    <span className="text-sm" style={{ color: '#8EA0B5' }}>{card.horario}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {card.buttons.map((button, btnIndex) => (
                    <Button
                      key={btnIndex}
                      onClick={button.action}
                      className="w-full flex items-center justify-center gap-2 transition-all duration-200"
                      style={{
                        backgroundColor: '#3BA3FF',
                        color: '#E7EEF6'
                      }}
                    >
                      <button.icon className="h-4 w-4" />
                      {button.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Contact Form */}
        <Card className="border" style={{ 
          backgroundColor: '#151924', 
          borderColor: '#20283A' 
        }}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#E7EEF6' }}>
              <Send className="h-6 w-6" style={{ color: '#3BA3FF' }} />
              Formulário de Contato Rápido
            </CardTitle>
            <CardDescription style={{ color: '#8EA0B5' }}>
              Envie uma mensagem direta ao suporte Simplix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" style={{ color: '#E7EEF6' }}>Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="border"
                    style={{ 
                      backgroundColor: '#0F1115', 
                      borderColor: '#20283A',
                      color: '#E7EEF6'
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#E7EEF6' }}>E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border"
                    style={{ 
                      backgroundColor: '#0F1115', 
                      borderColor: '#20283A',
                      color: '#E7EEF6'
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" style={{ color: '#E7EEF6' }}>Tipo de Suporte</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger 
                    className="border"
                    style={{ 
                      backgroundColor: '#0F1115', 
                      borderColor: '#20283A',
                      color: '#E7EEF6'
                    }}
                  >
                    <SelectValue placeholder="Selecione o tipo de suporte" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#151924', borderColor: '#20283A', zIndex: 9999 }}>
                    <SelectItem value="tecnico" style={{ color: '#E7EEF6' }}>Técnico</SelectItem>
                    <SelectItem value="comercial" style={{ color: '#E7EEF6' }}>Comercial</SelectItem>
                    <SelectItem value="financeiro" style={{ color: '#E7EEF6' }}>Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto" style={{ color: '#E7EEF6' }}>Assunto</Label>
                <Input
                  id="assunto"
                  placeholder="Assunto da sua mensagem"
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  className="border"
                  style={{ 
                    backgroundColor: '#0F1115', 
                    borderColor: '#20283A',
                    color: '#E7EEF6'
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem" style={{ color: '#E7EEF6' }}>
                  Mensagem
                  <span className="text-xs ml-2" style={{ color: '#8EA0B5' }}>
                    ({formData.mensagem.length}/500 caracteres)
                  </span>
                </Label>
                <Textarea
                  id="mensagem"
                  placeholder="Descreva sua solicitação ou dúvida..."
                  value={formData.mensagem}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setFormData({ ...formData, mensagem: e.target.value });
                    }
                  }}
                  className="border min-h-[120px]"
                  style={{ 
                    backgroundColor: '#0F1115', 
                    borderColor: '#20283A',
                    color: '#E7EEF6'
                  }}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full md:w-auto flex items-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: '#3BA3FF',
                  color: '#E7EEF6'
                }}
              >
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Suporte;
