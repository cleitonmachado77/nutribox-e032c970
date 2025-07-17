
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCoachQuestions, CoachQuestion, CoachQuestionInsert } from '@/hooks/useCoachQuestions';
import { usePacientes } from '@/hooks/usePacientes';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

export function QuestionnairesTab() {
  const { data: pacientes = [] } = usePacientes();
  const { questions, loading, error, addQuestion, updateQuestion, deleteQuestion } = useCoachQuestions();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CoachQuestionInsert & {
    envio_frequencia?: string;
    envio_horario?: string;
    envio_dia_semana?: string;
    envio_dia_mes?: number;
  }>>({
    title: '',
    category: 'comportamental',
    question_text: '',
    options: '',
    frequency: 'diario',
    is_active: true,
    envio_frequencia: 'diario',
    envio_horario: '09:00',
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    // Lógica especial para frequência e horário
    if (field === 'frequency') {
      if (value === 'diario') {
        // Mantém o horário atual se for 09:00 ou 20:00, senão define 09:00
        setForm((prev) => ({
          ...prev,
          frequency: value,
          envio_frequencia: 'diario',
          envio_horario: prev.envio_horario === '20:00' ? '20:00' : '09:00',
          envio_dia_semana: undefined,
          envio_dia_mes: undefined
        }));
      } else if (value === 'semanal') {
        setForm((prev) => ({
          ...prev,
          frequency: value,
          envio_frequencia: 'semanal',
          envio_horario: '13:00',
          envio_dia_semana: 'domingo',
          envio_dia_mes: undefined
        }));
      } else if (value === 'mensal') {
        setForm((prev) => ({
          ...prev,
          frequency: value,
          envio_frequencia: 'mensal',
          envio_horario: '13:00',
          envio_dia_semana: undefined,
          envio_dia_mes: 1
        }));
      }
      return;
    }
    if (field === 'envio_horario') {
      // Se mudar o horário do diário, também muda o envio_frequencia
      setForm((prev) => ({
        ...prev,
        envio_horario: value,
        envio_frequencia: value === '09:00' ? 'diario' : 'final_do_dia'
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (q: CoachQuestion) => {
    setEditing(q.id);
    setForm({
      title: q.title,
      category: q.category,
      question_text: q.question_text,
      options: Array.isArray(q.options)
        ? q.options.join('\n')
        : (typeof q.options === 'string' ? q.options : ''),
      frequency: q.frequency,
      is_active: q.is_active ?? true,
      envio_frequencia: q.envio_frequencia,
      envio_horario: q.envio_horario,
      envio_dia_semana: q.envio_dia_semana,
      envio_dia_mes: q.envio_dia_mes,
    });
    setShowForm(true);
    setSelectedPatients(q.patient_id ? [q.patient_id] : []);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: '', category: 'comportamental', question_text: '', options: '', frequency: 'diario', is_active: true, envio_frequencia: 'diario', envio_horario: '09:00' });
    setShowForm(false);
    setSelectedPatients([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Garantir que envio_horario está correto antes de salvar
    let envio_horario = form.envio_horario;
    if (form.frequency === 'diario') {
      envio_horario = form.envio_horario === '20:00' ? '20:00' : '09:00';
    } else if (form.frequency === 'semanal' || form.frequency === 'mensal') {
      envio_horario = '13:00';
    }
    const payload: Partial<CoachQuestionInsert> = {
      ...form,
      options: form.options ? (typeof form.options === 'string' ? form.options.split('\n').map((o) => o.trim()).filter(Boolean) : []) : [],
      is_active: form.is_active ?? true,
      title: form.title || '',
      category: form.category || 'comportamental',
      question_text: form.question_text || '',
      frequency: form.frequency || 'diario',
      envio_frequencia: form.envio_frequencia,
      envio_horario,
      envio_dia_semana: form.envio_dia_semana,
      envio_dia_mes: form.envio_dia_mes,
    };
    if (editing && selectedPatients.length === 1) {
      await updateQuestion(editing, { ...payload, patient_id: selectedPatients[0] });
    } else {
      await addQuestion(payload, selectedPatients);
    }
    handleCancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gerenciar Questionários</h2>
        <Button onClick={() => { setShowForm((v) => !v); setEditing(null); setForm({ title: '', category: 'comportamental', question_text: '', options: '', frequency: 'diario', is_active: true, envio_frequencia: 'diario', envio_horario: '09:00' }); setSelectedPatients([]); }}>
          <Plus className="w-4 h-4 mr-2" /> Nova Pergunta
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <Input value={form.title} onChange={e => handleChange('title', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <Select value={form.category} onValueChange={v => handleChange('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comportamental">Comportamental</SelectItem>
                  <SelectItem value="bem_estar">Bem-estar</SelectItem>
                  <SelectItem value="personalizada">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequência</label>
              <Select value={form.frequency} onValueChange={v => handleChange('frequency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Campo de horário dinâmico */}
            {form.frequency === 'diario' && (
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <Select value={form.envio_horario} onValueChange={v => handleChange('envio_horario', v)}>
                  <SelectTrigger><SelectValue /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">Início do dia (09:00)</SelectItem>
                    <SelectItem value="20:00">Final do dia (20:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.frequency === 'semanal' && (
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <div className="p-2 border rounded bg-gray-50">Domingo às 13:00</div>
              </div>
            )}
            {form.frequency === 'mensal' && (
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <div className="p-2 border rounded bg-gray-50">Dia 01 às 13:00</div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-6">
              <Checkbox checked={!!form.is_active} onCheckedChange={v => handleChange('is_active', v as boolean)} id="is_active" />
              <label htmlFor="is_active" className="text-sm select-none cursor-pointer">Ativo</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pergunta</label>
            <Textarea value={form.question_text} onChange={e => handleChange('question_text', e.target.value)} required rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opções de Resposta (uma por linha, opcional)</label>
            <Textarea value={typeof form.options === 'string' ? form.options : Array.isArray(form.options) ? (form.options as string[]).join('\n') : ''} onChange={e => handleChange('options', e.target.value)} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Selecione os Pacientes</label>
            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
              {pacientes.length === 0 && <div className="text-muted-foreground text-sm">Nenhum paciente cadastrado.</div>}
              {pacientes.map(p => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer py-1">
                  <Checkbox checked={selectedPatients.includes(p.id)} onCheckedChange={v => {
                    setSelectedPatients(sel => v ? [...sel, p.id] : sel.filter(id => id !== p.id));
                  }} />
                  <span>{p.lead?.nome || p.id}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" />Salvar</Button>
            <Button type="button" variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancelar</Button>
          </div>
        </form>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map(q => (
          <Card key={q.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {q.title} <span className="text-xs text-muted-foreground">[{q.category}]</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm font-medium">{q.question_text}</div>
              {Array.isArray(q.options) && q.options.length > 0 && (
                <ul className="list-disc ml-5 text-xs text-muted-foreground">
                  {Array.isArray(q.options)
                    ? q.options.map((opt: string, i: number) => <li key={i}>{opt}</li>)
                    : null}
                </ul>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">Frequência: <b>{q.frequency}</b></span>
                <span className="text-xs">Status: {q.is_active ? 'Ativo' : 'Inativo'}</span>
                <span className="text-xs">Paciente: <b>{pacientes.find(p => p.id === q.patient_id)?.lead?.nome || q.patient_id || '-'}</b></span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(q)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {loading && <div className="text-center text-muted-foreground">Carregando...</div>}
    </div>
  );
}
