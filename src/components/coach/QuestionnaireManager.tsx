import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNutriCoachQuestionnaire, CustomQuestionnaire } from '@/hooks/useNutriCoachQuestionnaire';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, MessageSquare, Brain, Send } from 'lucide-react';

export const QuestionnaireManager = () => {
  const { user } = useAuth();
  const { loading, createCustomQuestionnaire, sendDailyQuestionnaire } = useNutriCoachQuestionnaire();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [newQuestionnaire, setNewQuestionnaire] = useState<CustomQuestionnaire>({
    title: '',
    question_text: '',
    options: ['❌ Não', '⚠️ Parcialmente', '✅ Sim'],
    frequency: 'diario'
  });

  useEffect(() => {
    if (user) {
      loadQuestionnaires();
      loadPatients();
    }
  }, [user]);

  const loadQuestionnaires = async () => {
    const { data } = await supabase
      .from('coach_questionnaires')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setQuestionnaires(data);
  };

  const loadPatients = async () => {
    const { data } = await supabase
      .from('whatsapp_conversations')
      .select('contact_name, contact_phone')
      .eq('user_id', user?.id);
    
    if (data) setPatients(data);
  };

  const handleCreateQuestionnaire = async () => {
    if (!newQuestionnaire.title || !newQuestionnaire.question_text) return;

    const result = await createCustomQuestionnaire(user?.id!, [newQuestionnaire]);
    if (result) {
      setNewQuestionnaire({
        title: '',
        question_text: '',
        options: ['❌ Não', '⚠️ Parcialmente', '✅ Sim'],
        frequency: 'diario'
      });
      loadQuestionnaires();
    }
  };

  const handleSendQuestionnaire = async (patientPhone: string, patientName: string) => {
    await sendDailyQuestionnaire(patientName, patientPhone, user?.id!);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'comportamental': return <Brain className="w-4 h-4" />;
      case 'bem_estar': return <MessageSquare className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'comportamental': return 'bg-blue-100 text-blue-800';
      case 'bem_estar': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Custom Questionnaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Questionário Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Título do questionário"
              value={newQuestionnaire.title}
              onChange={(e) => setNewQuestionnaire(prev => ({ ...prev, title: e.target.value }))}
            />
            <Select
              value={newQuestionnaire.frequency}
              onValueChange={(value: 'diario' | 'semanal' | 'mensal') => 
                setNewQuestionnaire(prev => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Digite a pergunta..."
            value={newQuestionnaire.question_text}
            onChange={(e) => setNewQuestionnaire(prev => ({ ...prev, question_text: e.target.value }))}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Opções de resposta:</label>
            {newQuestionnaire.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...newQuestionnaire.options];
                  newOptions[index] = e.target.value;
                  setNewQuestionnaire(prev => ({ ...prev, options: newOptions }));
                }}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleCreateQuestionnaire} 
            disabled={loading || !newQuestionnaire.title || !newQuestionnaire.question_text}
            className="w-full"
          >
            Criar Questionário
          </Button>
        </CardContent>
      </Card>

      {/* Existing Questionnaires */}
      <Card>
        <CardHeader>
          <CardTitle>Questionários Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionnaires.map((q) => (
              <Card key={q.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(q.category)}
                      <h4 className="font-medium text-sm">{q.title}</h4>
                    </div>
                    <Badge className={getCategoryColor(q.category)}>
                      {q.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{q.question_text}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {q.frequency}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Send Questionnaires to Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Enviar Questionário do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{patient.contact_name}</h4>
                    <p className="text-sm text-muted-foreground">{patient.contact_phone}</p>
                    <Button 
                      size="sm" 
                      onClick={() => handleSendQuestionnaire(patient.contact_phone, patient.contact_name)}
                      disabled={loading}
                      className="w-full"
                    >
                      Enviar Questionário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
