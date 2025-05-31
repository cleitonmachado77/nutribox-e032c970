
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Calendar, TrendingUp, MessageSquare, Brain, Star, ArrowRight, Zap, Shield, Target, BarChart3, FileText, Clock } from "lucide-react";

const Home = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between my-0 px-[16px] py-[15px] mx-0">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" alt="Nutribox Logo" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <Link to="/auth">
                Entrar
              </Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/plans">
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
            🚀 Sistema #1 para Gestão de Pacientes
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gerencie seus
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Pacientes </span>
            com Inteligência
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa para nutricionistas que querem organizar consultas, acompanhar evolução dos pacientes 
            e criar planos alimentares personalizados com tecnologia de IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              <Link to="/plans">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-6">
              <Link to="/plans">
                Ver Planos
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">2500+</div>
              <div className="text-gray-400">Nutricionistas Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">150k+</div>
              <div className="text-gray-400">Pacientes Gerenciados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-gray-400">Satisfação dos Usuários</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para gerenciar seus pacientes
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ferramentas profissionais desenvolvidas especificamente para nutricionistas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Gestão de Pacientes</CardTitle>
                <CardDescription className="text-gray-300">
                  Organize fichas, histórico médico e dados antropométricos em um só lugar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Calendar className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Agendamento Inteligente</CardTitle>
                <CardDescription className="text-gray-300">
                  Calendário integrado com lembretes automáticos via WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Brain className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">IA para Cardápios</CardTitle>
                <CardDescription className="text-gray-300">
                  Crie planos alimentares personalizados em segundos com nossa IA
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Relatórios de Evolução</CardTitle>
                <CardDescription className="text-gray-300">
                  Acompanhe o progresso dos pacientes com gráficos e métricas detalhadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">WhatsApp Integrado</CardTitle>
                <CardDescription className="text-gray-300">
                  Comunique-se diretamente com pacientes e envie lembretes automáticos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <FileText className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Prontuários Digitais</CardTitle>
                <CardDescription className="text-gray-300">
                  Mantenha todos os dados dos pacientes seguros e organizados
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simples, rápido e eficiente - organize sua prática em 3 passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cadastre Pacientes</h3>
              <p className="text-gray-300">
                Importe ou adicione seus pacientes com fichas completas e histórico médico
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Agende Consultas</h3>
              <p className="text-gray-300">
                Use nosso calendário inteligente para organizar atendimentos e enviar lembretes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Acompanhe Resultados</h3>
              <p className="text-gray-300">
                Monitore a evolução dos pacientes e ajuste os planos com base nos resultados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              O que dizem nossos nutricionistas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "Consegui organizar todos meus pacientes e aumentei minha produtividade em 60%. O sistema é intuitivo e completo."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <div className="text-white font-semibold">Dra. Maria Silva</div>
                    <div className="text-gray-400 text-sm">Nutricionista Clínica</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "A IA para criação de cardápios é revolucionária. Meus pacientes adoram a personalização dos planos."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    C
                  </div>
                  <div>
                    <div className="text-white font-semibold">Dr. Carlos Santos</div>
                    <div className="text-gray-400 text-sm">Nutricionista Esportivo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4">
                  "Desde que uso o Nutribox, consigo atender mais pacientes sem perder a qualidade do atendimento."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <div className="text-white font-semibold">Dra. Ana Costa</div>
                    <div className="text-gray-400 text-sm">Nutricionista Funcional</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para organizar sua prática?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 2500 nutricionistas que já organizam seus pacientes com o Nutribox
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              <Link to="/plans">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-6">
              <Link to="/plans">
                Ver Planos e Preços
              </Link>
            </Button>
          </div>

          <p className="text-gray-400 mt-6 text-sm">
            ✅ Teste grátis por 14 dias • ✅ Configuração em 2 minutos • ✅ Suporte especializado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-slate-900/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" alt="Nutribox Logo" className="h-12 w-auto object-contain" />
          </div>
          <p className="text-gray-400">
            © 2024 Nutribox. Todos os direitos reservados. Desenvolvido para nutricionistas de sucesso.
          </p>
        </div>
      </footer>
    </div>;
};

export default Home;
