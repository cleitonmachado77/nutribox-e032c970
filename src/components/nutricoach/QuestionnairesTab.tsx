
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Send } from 'lucide-react';
import { QuestionnaireType, PatientData } from '@/hooks/useNutriCoachOperations';

interface QuestionnairesTabProps {
  patients: PatientData[];
  loading: boolean;
  sendQuestionnaire: (type: QuestionnaireType) => Promise<void>;
}

export function QuestionnairesTab({ patients, loading, sendQuestionnaire }: QuestionnairesTabProps) {
  const DAILY_QUESTIONNAIRE = `🌟 Olá! Como foi seu dia nutricional hoje?

1. Como você avalia sua alimentação hoje?
❌ Não segui o plano
⚠️ Segui parcialmente
✅ Segui completamente

2. Como está se sentindo em relação aos seus objetivos?
❌ Desmotivado(a)
⚠️ Neutro
✅ Motivado(a)

3. Consumiu a quantidade de água recomendada?
❌ Menos que o necessário
⚠️ Quase o suficiente
✅ Quantidade ideal

Responda com os números e suas escolhas. Ex: "1-✅, 2-✅, 3-⚠️"`;

  const WEEKLY_QUESTIONNAIRE = `📊 Avaliação Semanal - Como foi sua semana?

1. No geral, como avalia sua semana nutricional?
❌ Muito difícil, não consegui seguir
⚠️ Alguns dias bons, outros difíceis
✅ Consegui manter o foco na maioria dos dias

2. Seu nível de energia durante a semana:
❌ Muito baixo
⚠️ Variável
✅ Consistentemente bom

3. Como está sua motivação para continuar?
❌ Preciso de mais apoio
⚠️ Algumas dúvidas
✅ Confiante e motivado(a)

4. Algum desafio específico esta semana?
(Responda livremente)

Responda com os números e suas escolhas + sua resposta da pergunta 4.`;

  const selectedCount = patients.filter(p => p.isSelected).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Questionário Diário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{DAILY_QUESTIONNAIRE}</pre>
            </div>
            <Button 
              onClick={() => sendQuestionnaire('daily')} 
              disabled={loading || selectedCount === 0}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Questionário Diário
            </Button>
            <p className="text-xs text-muted-foreground">
              Enviado automaticamente em dias úteis para pacientes selecionados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Questionário Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{WEEKLY_QUESTIONNAIRE}</pre>
            </div>
            <Button 
              onClick={() => sendQuestionnaire('weekly')} 
              disabled={loading || selectedCount === 0}
              className="w-full"
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Questionário Semanal
            </Button>
            <p className="text-xs text-muted-foreground">
              Enviado semanalmente (segundas-feiras) para pacientes selecionados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
