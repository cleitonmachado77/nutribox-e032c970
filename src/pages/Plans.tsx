
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Zap, Users, Crown } from "lucide-react";

const Plans = () => {
  const plans = [
    {
      name: "Starter",
      price: "R$ 47",
      period: "mês",
      description: "Perfeito para nutricionistas iniciantes",
      icon: <Zap className="w-6 h-6" />,
      color: "border-gray-600",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "Até 50 pacientes",
        "Agendamento básico",
        "Prontuários digitais",
        "WhatsApp manual",
        "Suporte por email",
        "Relatórios básicos"
      ]
    },
    {
      name: "Professional",
      price: "R$ 97",
      period: "mês",
      description: "Ideal para consultórios estabelecidos",
      icon: <Users className="w-6 h-6" />,
      color: "border-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: true,
      features: [
        "Até 200 pacientes",
        "Agendamento inteligente",
        "Prontuários completos",
        "WhatsApp automatizado",
        "IA para cardápios (100/mês)",
        "Relatórios avançados",
        "Suporte prioritário",
        "Backup automático"
      ]
    },
    {
      name: "Enterprise",
      price: "R$ 197",
      period: "mês",
      description: "Para clínicas e grandes consultórios",
      icon: <Crown className="w-6 h-6" />,
      color: "border-yellow-600",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      features: [
        "Pacientes ilimitados",
        "Múltiplos profissionais",
        "API personalizada",
        "WhatsApp Business",
        "IA ilimitada para cardápios",
        "Relatórios personalizados",
        "Suporte dedicado 24/7",
        "Treinamento personalizado",
        "Integração com laboratórios"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-white hover:bg-purple-800/20">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" alt="Nutribox Logo" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <Link to="/auth">
                Entrar
              </Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/auth">
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Escolha o plano ideal para
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> seu consultório</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Todos os planos incluem 14 dias de teste gratuito. Sem permanência, cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`bg-slate-800/50 ${plan.color} hover:border-opacity-100 transition-all relative ${plan.popular ? 'scale-105 shadow-2xl' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${plan.buttonColor.replace('hover:', '').replace('bg-', 'bg-')}`}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-300 mb-6">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    asChild 
                    className={`w-full ${plan.buttonColor} text-white font-semibold py-3`}
                  >
                    <Link to="/auth">
                      Começar Teste Gratuito
                    </Link>
                  </Button>
                  
                  <p className="text-center text-sm text-gray-400">
                    14 dias grátis • Sem cartão necessário
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Posso trocar de plano depois?</h3>
              <p className="text-gray-300">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças são aplicadas imediatamente.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Como funciona o teste gratuito?</h3>
              <p className="text-gray-300">
                Você tem 14 dias para testar todas as funcionalidades sem limitações. 
                Não é necessário cartão de crédito para começar.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Os dados dos pacientes são seguros?</h3>
              <p className="text-gray-300">
                Sim! Utilizamos criptografia de nível bancário e somos 100% compliance 
                com a LGPD para proteção de dados sensíveis.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-300">
                Claro! Não há fidelidade. Você pode cancelar sua assinatura a qualquer 
                momento e manter acesso até o final do período pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Teste gratuitamente por 14 dias e veja como o Nutribox pode transformar sua prática
          </p>
          
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
            <Link to="/auth">
              Começar Teste Gratuito
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-slate-900/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" alt="Nutribox Logo" className="h-12 w-auto object-contain" />
          </div>
          <p className="text-gray-400">
            © 2024 Nutribox. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Plans;
