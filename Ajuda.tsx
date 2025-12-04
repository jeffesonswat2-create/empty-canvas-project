import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, MessageCircle, Mail, Phone, Search, FileQuestion } from "lucide-react";
import { useState } from "react";

const Ajuda = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "✅ Mensagem enviada",
      description: "Nossa equipe entrará em contato em breve.",
    });
  };

  const faqs = [
    {
      question: "Como alterar minha senha?",
      answer: "Acesse Configurações > Segurança > Alterar senha. Insira sua senha atual e a nova senha duas vezes para confirmar."
    },
    {
      question: "Como emitir uma nota fiscal?",
      answer: "Acesse o menu Vendas > PDV, adicione os produtos, insira os dados do cliente e clique em 'Emitir NF-e'. O sistema irá processar e autorizar a nota automaticamente."
    },
    {
      question: "Como fazer uma devolução?",
      answer: "Acesse Vendas > Devolução, busque a nota fiscal original, selecione os itens a devolver e confirme. O sistema gerará a nota de devolução automaticamente."
    },
    {
      question: "Como visualizar o histórico de vendas?",
      answer: "Acesse o menu lateral > Histórico. Você pode filtrar por período, tipo de documento, status e cliente. Use os filtros avançados para refinar sua busca."
    },
    {
      question: "Como exportar relatórios?",
      answer: "Em qualquer tela com tabelas, clique no botão 'Exportar' no canto superior direito. Escolha entre CSV ou Excel e confirme. O arquivo será baixado automaticamente."
    },
    {
      question: "Como cancelar uma nota fiscal?",
      answer: "Acesse Histórico, localize a nota, clique no menu '...' e selecione 'Cancelar nota'. Informe o motivo do cancelamento e confirme. O cancelamento será enviado à SEFAZ imediatamente."
    },
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-6 space-y-6 overflow-auto bg-[#0F1115]">
      {/* Header */}
      <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-[#E7EEF6] mb-2">
            Central de Ajuda
          </h2>
          <p className="text-[#E7EEF6]/70">
            Encontre respostas, tutoriais e entre em contato com nosso suporte
          </p>
        </div>

        {/* Busca */}
        <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#E7EEF6]/50" />
              <Input
                placeholder="Buscar na central de ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <Card className="lg:col-span-2 bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                <CardTitle className="text-[#E7EEF6]">Perguntas Frequentes</CardTitle>
              </div>
              <CardDescription className="text-[#E7EEF6]/70">
                Respostas rápidas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-[#20283A]">
                    <AccordionTrigger className="text-[#E7EEF6] hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#E7EEF6]/70">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <p className="text-center text-[#E7EEF6]/50 py-8">
                  Nenhuma pergunta encontrada. Tente outros termos.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recursos Rápidos */}
          <div className="space-y-6">
            <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-[#E7EEF6]">Recursos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentação completa
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0F1115] border-[#20283A] text-[#E7EEF6] hover:bg-[#0F1115] hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Tutoriais em vídeo
                </Button>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="text-[#E7EEF6]">Contato</CardTitle>
                </div>
                <CardDescription className="text-[#E7EEF6]/70">
                  Fale com nosso suporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-[#E7EEF6]">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">suporte@simplix.com.br</span>
                </div>
                <div className="flex items-center gap-2 text-[#E7EEF6]">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">(11) 4002-8922</span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-[#E7EEF6]/70">
                    Atendimento: Segunda a Sexta, 8h às 18h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Formulário de Contato */}
        <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="text-[#E7EEF6]">Envie uma mensagem</CardTitle>
            <CardDescription className="text-[#E7EEF6]/70">
              Não encontrou o que procurava? Envie sua dúvida para nossa equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#E7EEF6]">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#E7EEF6]">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[#E7EEF6]">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Resumo da sua dúvida"
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#E7EEF6]">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva sua dúvida ou problema em detalhes..."
                  rows={5}
                  className="bg-[#0F1115] border-[#20283A] text-[#E7EEF6]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar mensagem
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
  );
};

export default Ajuda;
