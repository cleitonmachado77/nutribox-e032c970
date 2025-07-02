
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Brain, 
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNutriCoachQuestionnaire } from '@/hooks/useNutriCoachQuestionnaire';

export default function NutriCoach() {
  const { user } = useAuth();
  const { loading, sendDailyQuestionnaire } = useNutriCoachQuestionnaire();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleSendQuestionnaire = async () => {
    if (!patientName || !patientPhone || !user) return;
    
    await sendDailyQuestionnaire(patientName, patientPhone, user.id);
    setPatientName('');
    setPatientPhone('');
  };

  const handleSendCustomMessage = async () => {
    if (!customMessage || !patientPhone || !user) return;
    
    // Implementar envio de mensagem personalizada
    setCustomMessage('');
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach IA" 
        description="Sistema inteligente de coaching nutricional via WhatsApp"
      />

      {/* Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enviar Questionário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Enviar Questionário Diário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome do paciente"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <Input
              placeholder="WhatsApp (com código do país)"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
            />
            <Button 
              onClick={handleSendQuestionnaire}
              disabled={loading || !patientName || !patientPhone}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar Questionário'}
            </Button>
          </CardContent>
        </Card>

        {/* Mensagem Personalizada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Mensagem Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="WhatsApp do paciente"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
            />
            <Textarea
              placeholder="Digite sua mensagem personalizada..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleSendCustomMessage}
              disabled={loading || !customMessage || !patientPhone}
              className="w-full"
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensagem
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Questionários Hoje</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engajamento</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Agendar Envios</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Bell className="w-6 h-6" />
              <span className="text-sm">Configurar Alertas</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Novo Questionário</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Painel Pacientes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
