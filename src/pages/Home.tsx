
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Brain,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Target
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">Nutribox</span>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/auth">
              Começar Agora
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
            🚀 Plataforma #1 para Nutricionistas
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transforme sua
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Carreira </span>
            em Nutrição
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema completo de gestão para nutricionistas que querem crescer profissionalmente. 
            Gerencie pacientes, crie planos alimentares personalizados e aumente sua receita com IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              <Link to="/auth">
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-6">
              Ver Demonstração
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-gray-400">Nutricionistas Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50k+</div>
              <div className="text-gray-400">Pacientes Atendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">95%</div>
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
              Por que escolher o Nutribox?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Desenvolvido especificamente para profissionais da nutrição que buscam excelência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Zap className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">IA Avançada</CardTitle>
                <CardDescription className="text-gray-300">
                  Crie planos alimentares personalizados em segundos com nossa IA especializada em nutrição
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Gestão Completa</CardTitle>
                <CardDescription className="text-gray-300">
                  Organize todos seus pacientes, consultas e históricos em um só lugar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Aumente sua Receita</CardTitle>
                <CardDescription className="text-gray-300">
                  Ferramentas de marketing e automação para escalar seu consultório
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">WhatsApp Integrado</CardTitle>
                <CardDescription className="text-gray-300">
                  Comunique-se diretamente com pacientes via WhatsApp automatizado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">100% Seguro</CardTitle>
                <CardDescription className="text-gray-300">
                  Dados protegidos com criptografia de nível bancário e LGPD compliant
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-800/20 hover:border-purple-600/50 transition-all">
              <CardHeader>
                <Target className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Resultados Comprovados</CardTitle>
                <CardDescription className="text-gray-300">
                  Nutricionistas aumentam em média 40% seus resultados em 3 meses
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
              Simples, rápido e eficiente - comece em 3 passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cadastre-se</h3>
              <p className="text-gray-300">
                Crie sua conta em menos de 2 minutos e configure seu perfil profissional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Adicione Pacientes</h3>
              <p className="text-gray-300">
                Importe ou cadastre seus pacientes e organize todas as informações importantes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Utilize a IA</h3>
              <p className="text-gray-300">
                Crie planos alimentares personalizados e automatize seu atendimento
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "O Nutribox revolucionou minha prática. Consigo atender 3x mais pacientes com a mesma qualidade."
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "A IA para criação de cardápios é impressionante. Meus pacientes adoram a personalização."
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Minha receita aumentou 50% desde que comecei a usar. Recomendo para todos os colegas!"
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
            Pronto para transformar sua carreira?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 1000 nutricionistas que já estão crescendo com o Nutribox
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              <Link to="/auth">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-gray-400 mt-6 text-sm">
            ✅ Sem cartão de crédito necessário • ✅ Configuração em 2 minutos • ✅ Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-slate-900/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            <span className="text-xl font-bold text-white">Nutribox</span>
          </div>
          <p className="text-gray-400">
            © 2024 Nutribox. Todos os direitos reservados. Desenvolvido para nutricionistas de sucesso.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
