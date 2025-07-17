
import { useState, useEffect } from 'react';
import { useConsultationData } from './useConsultationData';

export interface Prescription {
  id: string;
  type: 'medicamento' | 'suplemento' | 'orientacao';
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  createdAt: Date;
}

export interface PrescriptionData {
  prescriptions: Prescription[];
  generatedFrom: string;
  generatedAt: Date;
}

export const usePrescriptions = (patientId: string, consultationId?: string) => {
  const { getSavedClinicalHistory } = useConsultationData(patientId, consultationId);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePrescriptions = async () => {
    if (!consultationId) return null;
    
    setIsLoading(true);
    try {
      const clinicalHistory = await getSavedClinicalHistory();
      if (!clinicalHistory) return null;

      const generatedPrescriptions = extractPrescriptionsFromHistory(clinicalHistory);
      
      const prescriptionData: PrescriptionData = {
        prescriptions: generatedPrescriptions,
        generatedFrom: `Histórico Clínico - Consulta ${consultationId}`,
        generatedAt: new Date()
      };

      setPrescriptions(prescriptionData);
      return prescriptionData;
    } catch (error) {
      console.error('Error generating prescriptions:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const extractPrescriptionsFromHistory = (clinicalData: any): Prescription[] => {
    const prescriptions: Prescription[] = [];
    
    // Extrair medicamentos
    if (clinicalData.medications) {
      const medications = clinicalData.medications.split(',').map((med: string) => med.trim());
      medications.forEach((med: string, index: number) => {
        if (med) {
          prescriptions.push({
            id: `med-${index}`,
            type: 'medicamento',
            name: med,
            frequency: 'Conforme prescrição médica',
            instructions: 'Tomar conforme orientação médica',
            createdAt: new Date()
          });
        }
      });
    }

    // Extrair suplementos
    if (clinicalData.supplements) {
      const supplements = clinicalData.supplements.split(',').map((sup: string) => sup.trim());
      supplements.forEach((sup: string, index: number) => {
        if (sup) {
          prescriptions.push({
            id: `sup-${index}`,
            type: 'suplemento',
            name: sup,
            frequency: 'Conforme orientação nutricional',
            instructions: 'Seguir dosagem recomendada',
            createdAt: new Date()
          });
        }
      });
    }

    // Adicionar orientações gerais
    prescriptions.push({
      id: 'orient-1',
      type: 'orientacao',
      name: 'Seguir plano alimentar',
      instructions: 'Manter disciplina com horários das refeições e quantidades estabelecidas',
      createdAt: new Date()
    });

    prescriptions.push({
      id: 'orient-2',
      type: 'orientacao',
      name: 'Hidratação adequada',
      instructions: 'Consumir pelo menos 2 litros de água por dia',
      createdAt: new Date()
    });

    return prescriptions;
  };

  const exportPrescriptions = () => {
    if (!prescriptions) return;

    const content = generatePrescriptionsContent(prescriptions);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescricoes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePrescriptionsContent = (data: PrescriptionData): string => {
    let content = `PRESCRIÇÕES MÉDICAS\n`;
    content += `Gerada em: ${data.generatedAt.toLocaleDateString('pt-BR')}\n`;
    content += `Baseada em: ${data.generatedFrom}\n\n`;

    const prescriptionsByType = data.prescriptions.reduce((acc, prescription) => {
      if (!acc[prescription.type]) {
        acc[prescription.type] = [];
      }
      acc[prescription.type].push(prescription);
      return acc;
    }, {} as Record<string, Prescription[]>);

    Object.entries(prescriptionsByType).forEach(([type, prescriptions]) => {
      const typeTitle = type === 'medicamento' ? 'MEDICAMENTOS' : 
                       type === 'suplemento' ? 'SUPLEMENTOS' : 'ORIENTAÇÕES';
      content += `${typeTitle}:\n`;
      prescriptions.forEach(prescription => {
        content += `- ${prescription.name}\n`;
        if (prescription.dosage) content += `  Dosagem: ${prescription.dosage}\n`;
        if (prescription.frequency) content += `  Frequência: ${prescription.frequency}\n`;
        if (prescription.duration) content += `  Duração: ${prescription.duration}\n`;
        if (prescription.instructions) content += `  Instruções: ${prescription.instructions}\n`;
        content += `\n`;
      });
      content += `\n`;
    });

    return content;
  };

  return {
    prescriptions,
    generatePrescriptions,
    exportPrescriptions,
    isLoading
  };
};
