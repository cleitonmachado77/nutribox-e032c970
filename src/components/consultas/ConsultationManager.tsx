
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Eye, CheckCircle, Clock, FileText, Trash2 } from "lucide-react";
import { useConsultations, type Consultation } from "@/hooks/useConsultations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface ConsultationManagerProps {
  patientId: string;
  patientName: string;
  onNewConsultation: (consultation: Consultation) => void;
  onSelectConsultation: (consultation: Consultation) => void;
  currentConsultation?: Consultation | null;
}

export const ConsultationManager = ({
  patientId,
  patientName,
  onNewConsultation,
  onSelectConsultation,
  currentConsultation
}: ConsultationManagerProps) => {
  const { 
    consultations, 
    totalConsultations, 
    createNewConsultation, 
    completeConsultation,
    deleteConsultation,
    isLoading 
  } = useConsultations(patientId);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewConsultation = async () => {
    try {
      const newConsultation = await createNewConsultation();
      onNewConsultation(newConsultation);
      toast.success("Nova consulta criada com sucesso!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao criar nova consulta");
    }
  };

  const handleCompleteConsultation = async (consultationId: string) => {
    try {
      await completeConsultation(consultationId);
      toast.success("Consulta concluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao concluir consulta");
    }
  };

  const handleDeleteConsultation = async (consultationId: string) => {
    try {
      await deleteConsultation(consultationId);
      toast.success("Consulta excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir consulta");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Clock className="w-3 h-3" />;
      case 'concluida':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Consultas - {patientName}</span>
            <Badge className="bg-white/20 text-white">
              {totalConsultations} consulta{totalConsultations !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button
            onClick={handleNewConsultation}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Consulta
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {consultations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma consulta encontrada</p>
            <p className="text-sm">Clique em "Nova Consulta" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">Histórico de Consultas</h4>
              {currentConsultation && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Consulta Ativa:</span>
                  <Badge className={getStatusColor(currentConsultation.status)}>
                    {getStatusIcon(currentConsultation.status)}
                    <span className="ml-1">#{currentConsultation.consultation_number}</span>
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    currentConsultation?.id === consultation.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectConsultation(consultation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="font-bold text-lg text-purple-600">
                          #{consultation.consultation_number}
                        </div>
                        <div className="text-xs text-gray-500">Consulta</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(consultation.status)}>
                            {getStatusIcon(consultation.status)}
                            <span className="ml-1 capitalize">
                              {consultation.status.replace('_', ' ')}
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div>
                            Criada: {format(new Date(consultation.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </div>
                          {consultation.completed_at && (
                            <div>
                              Concluída: {format(new Date(consultation.completed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConsultation(consultation);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      {consultation.status === 'em_andamento' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteConsultation(consultation.id);
                          }}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConsultation(consultation.id);
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {consultation.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Observações:</strong> {consultation.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
