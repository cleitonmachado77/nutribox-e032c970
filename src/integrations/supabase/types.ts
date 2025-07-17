export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_audit_logs: {
        Row: {
          endpoint: string
          id: string
          instance_name: string | null
          method: string
          status: number
          timestamp: string
          user_id: string
        }
        Insert: {
          endpoint: string
          id?: string
          instance_name?: string | null
          method: string
          status: number
          timestamp?: string
          user_id: string
        }
        Update: {
          endpoint?: string
          id?: string
          instance_name?: string | null
          method?: string
          status?: number
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      Chat: {
        Row: {
          createdAt: string | null
          id: number
          instance: string
          labels: Json | null
          remoteJid: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: number
          instance: string
          labels?: Json | null
          remoteJid: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: number
          instance?: string
          labels?: Json | null
          remoteJid?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      coach_questionnaires: {
        Row: {
          category: string
          created_at: string
          frequency: string
          id: string
          is_active: boolean | null
          options: Json | null
          question_text: string
          title: string
          updated_at: string
          user_id: string
          patient_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text: string
          title: string
          updated_at?: string
          user_id: string
          patient_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text?: string
          title?: string
          updated_at?: string
          user_id?: string
          patient_id?: string | null
        }
        Relationships: []
      }
      coach_responses: {
        Row: {
          created_at: string
          id: string
          patient_name: string
          patient_phone: string
          question_category: string
          question_text: string
          question_type: string
          questionnaire_id: string | null
          response_date: string
          response_score: number | null
          response_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_name: string
          patient_phone: string
          question_category: string
          question_text: string
          question_type: string
          questionnaire_id?: string | null
          response_date?: string
          response_score?: number | null
          response_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_name?: string
          patient_phone?: string
          question_category?: string
          question_text?: string
          question_type?: string
          questionnaire_id?: string | null
          response_date?: string
          response_score?: number | null
          response_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_responses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "coach_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_schedules: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean | null
          next_send_date: string
          patient_name: string
          patient_phone: string
          questionnaire_id: string | null
          schedule_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean | null
          next_send_date: string
          patient_name: string
          patient_phone: string
          questionnaire_id?: string | null
          schedule_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_send_date?: string
          patient_name?: string
          patient_phone?: string
          questionnaire_id?: string | null
          schedule_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_schedules_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "coach_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      consulta_arquivos: {
        Row: {
          consulta_realizada_id: string
          created_at: string
          descricao: string | null
          id: string
          nome_arquivo: string
          tipo_arquivo: string
          url_arquivo: string
        }
        Insert: {
          consulta_realizada_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome_arquivo: string
          tipo_arquivo: string
          url_arquivo: string
        }
        Update: {
          consulta_realizada_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome_arquivo?: string
          tipo_arquivo?: string
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "consulta_arquivos_consulta_realizada_id_fkey"
            columns: ["consulta_realizada_id"]
            isOneToOne: false
            referencedRelation: "consultas_realizadas"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas: {
        Row: {
          created_at: string
          data_consulta: string
          id: string
          lead_id: string | null
          observacoes: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_consulta: string
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_consulta?: string
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_realizadas: {
        Row: {
          altura_atual: string | null
          consulta_id: string | null
          created_at: string
          data_consulta: string
          id: string
          imc_atual: string | null
          notas_clinicas: string | null
          observacoes: string | null
          paciente_id: string
          peso_atual: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          altura_atual?: string | null
          consulta_id?: string | null
          created_at?: string
          data_consulta: string
          id?: string
          imc_atual?: string | null
          notas_clinicas?: string | null
          observacoes?: string | null
          paciente_id: string
          peso_atual?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          altura_atual?: string | null
          consulta_id?: string | null
          created_at?: string
          data_consulta?: string
          id?: string
          imc_atual?: string | null
          notas_clinicas?: string | null
          observacoes?: string | null
          paciente_id?: string
          peso_atual?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_realizadas_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_realizadas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_behavioral_assessment: {
        Row: {
          consultation_id: string | null
          created_at: string
          fluid_intake: string | null
          id: string
          meal_frequency: string | null
          meal_time: string | null
          patient_id: string
          plan_consistency: string | null
          updated_at: string
          user_id: string
          vegetable_fruits: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          fluid_intake?: string | null
          id?: string
          meal_frequency?: string | null
          meal_time?: string | null
          patient_id: string
          plan_consistency?: string | null
          updated_at?: string
          user_id: string
          vegetable_fruits?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          fluid_intake?: string | null
          id?: string
          meal_frequency?: string | null
          meal_time?: string | null
          patient_id?: string
          plan_consistency?: string | null
          updated_at?: string
          user_id?: string
          vegetable_fruits?: string | null
        }
        Relationships: []
      }
      consultation_clinical_history: {
        Row: {
          allergies: string | null
          consultation_id: string | null
          created_at: string
          family_history: string | null
          hereditary_diseases: string | null
          id: string
          medications: string | null
          patient_id: string
          pre_existing_conditions: string | null
          supplements: string | null
          surgeries: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string | null
          consultation_id?: string | null
          created_at?: string
          family_history?: string | null
          hereditary_diseases?: string | null
          id?: string
          medications?: string | null
          patient_id: string
          pre_existing_conditions?: string | null
          supplements?: string | null
          surgeries?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string | null
          consultation_id?: string | null
          created_at?: string
          family_history?: string | null
          hereditary_diseases?: string | null
          id?: string
          medications?: string | null
          patient_id?: string
          pre_existing_conditions?: string | null
          supplements?: string | null
          surgeries?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_emotional_assessment: {
        Row: {
          consultation_id: string | null
          created_at: string
          eating_triggers: string | null
          emotional_state: string | null
          food_anxiety: string | null
          id: string
          patient_id: string
          relationship_with_food: string | null
          stress_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          eating_triggers?: string | null
          emotional_state?: string | null
          food_anxiety?: string | null
          id?: string
          patient_id: string
          relationship_with_food?: string | null
          stress_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          eating_triggers?: string | null
          emotional_state?: string | null
          food_anxiety?: string | null
          id?: string
          patient_id?: string
          relationship_with_food?: string | null
          stress_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_nutritional_personalization: {
        Row: {
          avoided_foods: string | null
          avoided_meals: string | null
          consultation_id: string | null
          created_at: string
          fruits: string | null
          id: string
          limitations: string | null
          objects: string | null
          patient_id: string
          perfect_meals: string | null
          preferred_foods: string | null
          preferred_meals: string | null
          updated_at: string
          user_id: string
          vegetables: string | null
        }
        Insert: {
          avoided_foods?: string | null
          avoided_meals?: string | null
          consultation_id?: string | null
          created_at?: string
          fruits?: string | null
          id?: string
          limitations?: string | null
          objects?: string | null
          patient_id: string
          perfect_meals?: string | null
          preferred_foods?: string | null
          preferred_meals?: string | null
          updated_at?: string
          user_id: string
          vegetables?: string | null
        }
        Update: {
          avoided_foods?: string | null
          avoided_meals?: string | null
          consultation_id?: string | null
          created_at?: string
          fruits?: string | null
          id?: string
          limitations?: string | null
          objects?: string | null
          patient_id?: string
          perfect_meals?: string | null
          preferred_foods?: string | null
          preferred_meals?: string | null
          updated_at?: string
          user_id?: string
          vegetables?: string | null
        }
        Relationships: []
      }
      consultation_nutritional_plans: {
        Row: {
          consultation_id: string | null
          created_at: string
          generation_data: Json | null
          id: string
          is_active: boolean | null
          patient_id: string
          plan_content: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          generation_data?: Json | null
          id?: string
          is_active?: boolean | null
          patient_id: string
          plan_content?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          generation_data?: Json | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
          plan_content?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_nutritional_structure: {
        Row: {
          carbs_grams: string | null
          carbs_percentage: string | null
          consultation_id: string | null
          created_at: string
          daily_calories: string | null
          fats_grams: string | null
          fats_percentage: string | null
          id: string
          patient_id: string
          proteins_grams: string | null
          proteins_percentage: string | null
          selected_meals: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          carbs_grams?: string | null
          carbs_percentage?: string | null
          consultation_id?: string | null
          created_at?: string
          daily_calories?: string | null
          fats_grams?: string | null
          fats_percentage?: string | null
          id?: string
          patient_id: string
          proteins_grams?: string | null
          proteins_percentage?: string | null
          selected_meals?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          carbs_grams?: string | null
          carbs_percentage?: string | null
          consultation_id?: string | null
          created_at?: string
          daily_calories?: string | null
          fats_grams?: string | null
          fats_percentage?: string | null
          id?: string
          patient_id?: string
          proteins_grams?: string | null
          proteins_percentage?: string | null
          selected_meals?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_physical_assessment: {
        Row: {
          altura: string | null
          circunferencia_braco: string | null
          circunferencia_cintura: string | null
          circunferencia_coxa: string | null
          circunferencia_quadril: string | null
          consultation_id: string | null
          created_at: string
          gordura_corporal: string | null
          id: string
          imc: string | null
          objetivo_emagrecimento: boolean | null
          objetivo_estetica: boolean | null
          objetivo_performance_esportiva: boolean | null
          objetivo_saude_longevidade: boolean | null
          patient_id: string
          peso_atual: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          altura?: string | null
          circunferencia_braco?: string | null
          circunferencia_cintura?: string | null
          circunferencia_coxa?: string | null
          circunferencia_quadril?: string | null
          consultation_id?: string | null
          created_at?: string
          gordura_corporal?: string | null
          id?: string
          imc?: string | null
          objetivo_emagrecimento?: boolean | null
          objetivo_estetica?: boolean | null
          objetivo_performance_esportiva?: boolean | null
          objetivo_saude_longevidade?: boolean | null
          patient_id: string
          peso_atual?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          altura?: string | null
          circunferencia_braco?: string | null
          circunferencia_cintura?: string | null
          circunferencia_coxa?: string | null
          circunferencia_quadril?: string | null
          consultation_id?: string | null
          created_at?: string
          gordura_corporal?: string | null
          id?: string
          imc?: string | null
          objetivo_emagrecimento?: boolean | null
          objetivo_estetica?: boolean | null
          objetivo_performance_esportiva?: boolean | null
          objetivo_saude_longevidade?: boolean | null
          patient_id?: string
          peso_atual?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_wellness_assessment: {
        Row: {
          body_image: string | null
          consultation_id: string | null
          created_at: string
          id: string
          journey_confidence: string | null
          patient_id: string
          physical_activity: string | null
          physical_energy: string | null
          sleep: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_image?: string | null
          consultation_id?: string | null
          created_at?: string
          id?: string
          journey_confidence?: string | null
          patient_id: string
          physical_activity?: string | null
          physical_energy?: string | null
          sleep?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_image?: string | null
          consultation_id?: string | null
          created_at?: string
          id?: string
          journey_confidence?: string | null
          patient_id?: string
          physical_activity?: string | null
          physical_energy?: string | null
          sleep?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          completed_at: string | null
          consultation_number: number
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          consultation_number: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          consultation_number?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Contact: {
        Row: {
          createdAt: string | null
          id: number
          instance: string
          profilePicUrl: string | null
          pushName: string | null
          remoteJid: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: number
          instance: string
          profilePicUrl?: string | null
          pushName?: string | null
          remoteJid: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: number
          instance?: string
          profilePicUrl?: string | null
          pushName?: string | null
          remoteJid?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      envios_programados: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          envio_diario: boolean | null
          envio_semanal: boolean | null
          id: string
          paciente_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          envio_diario?: boolean | null
          envio_semanal?: boolean | null
          id?: string
          paciente_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          envio_diario?: boolean | null
          envio_semanal?: boolean | null
          id?: string
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "envios_programados_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      Instance: {
        Row: {
          apikey: string | null
          autoReconnect: boolean | null
          browser: string | null
          businessAddress: string | null
          businessDescription: string | null
          businessHours: Json | null
          businessId: string | null
          chatwootAccountId: number | null
          chatwootConversationPending: boolean | null
          chatwootReopenConversation: boolean | null
          chatwootSignMsg: boolean | null
          chatwootToken: string | null
          chatwootUrl: string | null
          clientName: string | null
          connectionAt: string | null
          connectionStatus:
            | Database["public"]["Enums"]["InstanceConnectionStatus"]
            | null
          createdAt: string | null
          device: string | null
          difyBot: Json | null
          disconnectionAt: string | null
          disconnectionCount: number | null
          disconnectionObject: Json | null
          disconnectionReason: string | null
          disconnectionReasonCode: string | null
          disconnectionTime: string | null
          evolution: Json | null
          flowise: Json | null
          id: number
          instanceId: string | null
          integration: string | null
          lastConnectionAttempt: string | null
          lastSeen: string | null
          mobile: string | null
          name: string
          number: string | null
          openaiBot: Json | null
          ownerJid: string | null
          platform: string | null
          profileBio: string | null
          profileBusiness: string | null
          profileCategory: string | null
          profileEmail: string | null
          profileName: string | null
          profilePicUrl: string | null
          profileStatus: string | null
          profileVerified: boolean | null
          profileWebsite: string | null
          qrcode: string | null
          rabbitMq: Json | null
          retryCount: number | null
          serverUrl: string | null
          settings: Json | null
          sqs: Json | null
          state: string | null
          token: string | null
          typebot: Json | null
          updatedAt: string | null
          version: string | null
          webhook_settings: Json | null
          webhookBase64: boolean | null
          webhookByEvents: boolean | null
          webhookEvents: Json | null
          webhookUrl: string | null
          websocket: Json | null
        }
        Insert: {
          apikey?: string | null
          autoReconnect?: boolean | null
          browser?: string | null
          businessAddress?: string | null
          businessDescription?: string | null
          businessHours?: Json | null
          businessId?: string | null
          chatwootAccountId?: number | null
          chatwootConversationPending?: boolean | null
          chatwootReopenConversation?: boolean | null
          chatwootSignMsg?: boolean | null
          chatwootToken?: string | null
          chatwootUrl?: string | null
          clientName?: string | null
          connectionAt?: string | null
          connectionStatus?:
            | Database["public"]["Enums"]["InstanceConnectionStatus"]
            | null
          createdAt?: string | null
          device?: string | null
          difyBot?: Json | null
          disconnectionAt?: string | null
          disconnectionCount?: number | null
          disconnectionObject?: Json | null
          disconnectionReason?: string | null
          disconnectionReasonCode?: string | null
          disconnectionTime?: string | null
          evolution?: Json | null
          flowise?: Json | null
          id?: number
          instanceId?: string | null
          integration?: string | null
          lastConnectionAttempt?: string | null
          lastSeen?: string | null
          mobile?: string | null
          name: string
          number?: string | null
          openaiBot?: Json | null
          ownerJid?: string | null
          platform?: string | null
          profileBio?: string | null
          profileBusiness?: string | null
          profileCategory?: string | null
          profileEmail?: string | null
          profileName?: string | null
          profilePicUrl?: string | null
          profileStatus?: string | null
          profileVerified?: boolean | null
          profileWebsite?: string | null
          qrcode?: string | null
          rabbitMq?: Json | null
          retryCount?: number | null
          serverUrl?: string | null
          settings?: Json | null
          sqs?: Json | null
          state?: string | null
          token?: string | null
          typebot?: Json | null
          updatedAt?: string | null
          version?: string | null
          webhook_settings?: Json | null
          webhookBase64?: boolean | null
          webhookByEvents?: boolean | null
          webhookEvents?: Json | null
          webhookUrl?: string | null
          websocket?: Json | null
        }
        Update: {
          apikey?: string | null
          autoReconnect?: boolean | null
          browser?: string | null
          businessAddress?: string | null
          businessDescription?: string | null
          businessHours?: Json | null
          businessId?: string | null
          chatwootAccountId?: number | null
          chatwootConversationPending?: boolean | null
          chatwootReopenConversation?: boolean | null
          chatwootSignMsg?: boolean | null
          chatwootToken?: string | null
          chatwootUrl?: string | null
          clientName?: string | null
          connectionAt?: string | null
          connectionStatus?:
            | Database["public"]["Enums"]["InstanceConnectionStatus"]
            | null
          createdAt?: string | null
          device?: string | null
          difyBot?: Json | null
          disconnectionAt?: string | null
          disconnectionCount?: number | null
          disconnectionObject?: Json | null
          disconnectionReason?: string | null
          disconnectionReasonCode?: string | null
          disconnectionTime?: string | null
          evolution?: Json | null
          flowise?: Json | null
          id?: number
          instanceId?: string | null
          integration?: string | null
          lastConnectionAttempt?: string | null
          lastSeen?: string | null
          mobile?: string | null
          name?: string
          number?: string | null
          openaiBot?: Json | null
          ownerJid?: string | null
          platform?: string | null
          profileBio?: string | null
          profileBusiness?: string | null
          profileCategory?: string | null
          profileEmail?: string | null
          profileName?: string | null
          profilePicUrl?: string | null
          profileStatus?: string | null
          profileVerified?: boolean | null
          profileWebsite?: string | null
          qrcode?: string | null
          rabbitMq?: Json | null
          retryCount?: number | null
          serverUrl?: string | null
          settings?: Json | null
          sqs?: Json | null
          state?: string | null
          token?: string | null
          typebot?: Json | null
          updatedAt?: string | null
          version?: string | null
          webhook_settings?: Json | null
          webhookBase64?: boolean | null
          webhookByEvents?: boolean | null
          webhookEvents?: Json | null
          webhookUrl?: string | null
          websocket?: Json | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          altura: string | null
          anotacoes: string | null
          cidade: string | null
          created_at: string
          data_conversao: string | null
          email: string | null
          estado: string | null
          foto_perfil: string | null
          id: string
          imc: string | null
          nome: string
          objetivo: string | null
          objetivo_tag_id: string | null
          peso: string | null
          plano_alimentar: string | null
          progresso: number | null
          proxima_consulta: string | null
          status: string | null
          telefone: string
          ultima_consulta: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          altura?: string | null
          anotacoes?: string | null
          cidade?: string | null
          created_at?: string
          data_conversao?: string | null
          email?: string | null
          estado?: string | null
          foto_perfil?: string | null
          id?: string
          imc?: string | null
          nome: string
          objetivo?: string | null
          objetivo_tag_id?: string | null
          peso?: string | null
          plano_alimentar?: string | null
          progresso?: number | null
          proxima_consulta?: string | null
          status?: string | null
          telefone: string
          ultima_consulta?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          altura?: string | null
          anotacoes?: string | null
          cidade?: string | null
          created_at?: string
          data_conversao?: string | null
          email?: string | null
          estado?: string | null
          foto_perfil?: string | null
          id?: string
          imc?: string | null
          nome?: string
          objetivo?: string | null
          objetivo_tag_id?: string | null
          peso?: string | null
          plano_alimentar?: string | null
          progresso?: number | null
          proxima_consulta?: string | null
          status?: string | null
          telefone?: string
          ultima_consulta?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_objetivo_tag_id_fkey"
            columns: ["objetivo_tag_id"]
            isOneToOne: false
            referencedRelation: "objetivo_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      Message: {
        Row: {
          contextInfo: Json | null
          createdAt: string | null
          fromMe: boolean
          id: number
          instance: string
          message: Json
          messageId: string
          messageTimestamp: number
          messageType: string
          participant: string | null
          pushName: string | null
          remoteJid: string
          status: string | null
          updatedAt: string | null
        }
        Insert: {
          contextInfo?: Json | null
          createdAt?: string | null
          fromMe: boolean
          id?: number
          instance: string
          message: Json
          messageId: string
          messageTimestamp: number
          messageType: string
          participant?: string | null
          pushName?: string | null
          remoteJid: string
          status?: string | null
          updatedAt?: string | null
        }
        Update: {
          contextInfo?: Json | null
          createdAt?: string | null
          fromMe?: boolean
          id?: number
          instance?: string
          message?: Json
          messageId?: string
          messageTimestamp?: number
          messageType?: string
          participant?: string | null
          pushName?: string | null
          remoteJid?: string
          status?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      nutricoach_patients: {
        Row: {
          created_at: string | null
          id: string
          name: string
          paciente_id: string | null
          plan_active: boolean | null
          telephone: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          paciente_id?: string | null
          plan_active?: boolean | null
          telephone: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          paciente_id?: string | null
          plan_active?: boolean | null
          telephone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutricoach_patients_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      nutricoach_planos_personalizados: {
        Row: {
          created_at: string | null
          id: string
          mes: string
          nota_nutricionista: string | null
          patient_id: string
          recomendacao_gpt: string | null
          score_medio: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mes: string
          nota_nutricionista?: string | null
          patient_id: string
          recomendacao_gpt?: string | null
          score_medio?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mes?: string
          nota_nutricionista?: string | null
          patient_id?: string
          recomendacao_gpt?: string | null
          score_medio?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutricoach_planos_personalizados_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "nutricoach_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      nutricoach_programmed_shipping: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          patient_id: string
          shipping_diario: boolean | null
          shipping_semanal: boolean | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          patient_id: string
          shipping_diario?: boolean | null
          shipping_semanal?: boolean | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          patient_id?: string
          shipping_diario?: boolean | null
          shipping_semanal?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutricoach_programmed_shipping_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "nutricoach_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      nutricoach_respostas_diarias: {
        Row: {
          atividade: number
          created_at: string
          data_resposta: string
          energia: number
          feedback: string
          id: string
          patient_id: string
          sono: number
        }
        Insert: {
          atividade: number
          created_at?: string
          data_resposta: string
          energia: number
          feedback: string
          id?: string
          patient_id: string
          sono: number
        }
        Update: {
          atividade?: number
          created_at?: string
          data_resposta?: string
          energia?: number
          feedback?: string
          id?: string
          patient_id?: string
          sono?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutricoach_respostas_diarias_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      nutricoach_respostas_semanais: {
        Row: {
          confianca: number | null
          created_at: string | null
          data_resposta: string
          feedback_gpt: string | null
          id: string
          patient_id: string
          satisfacao: number | null
          user_id: string
        }
        Insert: {
          confianca?: number | null
          created_at?: string | null
          data_resposta: string
          feedback_gpt?: string | null
          id?: string
          patient_id: string
          satisfacao?: number | null
          user_id: string
        }
        Update: {
          confianca?: number | null
          created_at?: string | null
          data_resposta?: string
          feedback_gpt?: string | null
          id?: string
          patient_id?: string
          satisfacao?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutricoach_respostas_semanais_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivo_tags: {
        Row: {
          cor: string
          created_at: string
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          cor?: string
          created_at?: string
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          created_at: string
          data_primeira_consulta: string | null
          id: string
          lead_id: string
          status_tratamento: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_primeira_consulta?: string | null
          id?: string
          lead_id: string
          status_tratamento?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_primeira_consulta?: string | null
          id?: string
          lead_id?: string
          status_tratamento?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_photos: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          id: string
          patient_id: string
          tipo: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          patient_id: string
          tipo: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          patient_id?: string
          tipo?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome_completo: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nome_completo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_completo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      Setting: {
        Row: {
          always_online: boolean | null
          alwaysOnline: boolean | null
          callReject: boolean | null
          createdAt: string | null
          groups_ignore: boolean | null
          groupsIgnore: boolean | null
          id: number
          instanceId: string
          key: string
          msgCall: boolean | null
          read_messages: boolean | null
          read_status: boolean | null
          readMessages: boolean | null
          readStatus: boolean | null
          rejectCall: boolean | null
          sync_full_history: boolean | null
          syncFullHistory: boolean | null
          updatedAt: string | null
          value: string | null
          wavoipToken: string | null
        }
        Insert: {
          always_online?: boolean | null
          alwaysOnline?: boolean | null
          callReject?: boolean | null
          createdAt?: string | null
          groups_ignore?: boolean | null
          groupsIgnore?: boolean | null
          id?: number
          instanceId: string
          key: string
          msgCall?: boolean | null
          read_messages?: boolean | null
          read_status?: boolean | null
          readMessages?: boolean | null
          readStatus?: boolean | null
          rejectCall?: boolean | null
          sync_full_history?: boolean | null
          syncFullHistory?: boolean | null
          updatedAt?: string | null
          value?: string | null
          wavoipToken?: string | null
        }
        Update: {
          always_online?: boolean | null
          alwaysOnline?: boolean | null
          callReject?: boolean | null
          createdAt?: string | null
          groups_ignore?: boolean | null
          groupsIgnore?: boolean | null
          id?: number
          instanceId?: string
          key?: string
          msgCall?: boolean | null
          read_messages?: boolean | null
          read_status?: boolean | null
          readMessages?: boolean | null
          readStatus?: boolean | null
          rejectCall?: boolean | null
          sync_full_history?: boolean | null
          syncFullHistory?: boolean | null
          updatedAt?: string | null
          value?: string | null
          wavoipToken?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          google_calendar_link: string | null
          id: string
          updated_at: string
          user_id: string
          whatsapp_business_number: string | null
        }
        Insert: {
          created_at?: string
          google_calendar_link?: string | null
          id?: string
          updated_at?: string
          user_id: string
          whatsapp_business_number?: string | null
        }
        Update: {
          created_at?: string
          google_calendar_link?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          whatsapp_business_number?: string | null
        }
        Relationships: []
      }
      user_twilio_numbers: {
        Row: {
          cidade: string | null
          consultorio_nome: string
          created_at: string
          id: string
          is_active: boolean | null
          subaccount_sid: string | null
          twilio_phone_number: string
          twilio_phone_sid: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cidade?: string | null
          consultorio_nome: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          subaccount_sid?: string | null
          twilio_phone_number: string
          twilio_phone_sid: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cidade?: string | null
          consultorio_nome?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          subaccount_sid?: string | null
          twilio_phone_number?: string
          twilio_phone_sid?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_twilio_subaccounts: {
        Row: {
          cidade: string | null
          consultorio_nome: string
          created_at: string
          friendly_name: string
          id: string
          is_active: boolean | null
          subaccount_sid: string
          subaccount_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cidade?: string | null
          consultorio_nome: string
          created_at?: string
          friendly_name: string
          id?: string
          is_active?: boolean | null
          subaccount_sid: string
          subaccount_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cidade?: string | null
          consultorio_nome?: string
          created_at?: string
          friendly_name?: string
          id?: string
          is_active?: boolean | null
          subaccount_sid?: string
          subaccount_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Webhook: {
        Row: {
          createdAt: string | null
          enabled: boolean | null
          events: Json | null
          headers: Json | null
          id: number
          instanceId: string
          updatedAt: string | null
          url: string
          webhookBase64: boolean | null
          webhookByEvents: boolean | null
        }
        Insert: {
          createdAt?: string | null
          enabled?: boolean | null
          events?: Json | null
          headers?: Json | null
          id?: number
          instanceId: string
          updatedAt?: string | null
          url: string
          webhookBase64?: boolean | null
          webhookByEvents?: boolean | null
        }
        Update: {
          createdAt?: string | null
          enabled?: boolean | null
          events?: Json | null
          headers?: Json | null
          id?: number
          instanceId?: string
          updatedAt?: string | null
          url?: string
          webhookBase64?: boolean | null
          webhookByEvents?: boolean | null
        }
        Relationships: []
      }
      whatsapp_coach_interactions: {
        Row: {
          action_type: string
          created_at: string
          generated_message: string
          id: string
          patient_data: Json | null
          patient_name: string
          patient_phone: string
          updated_at: string
        }
        Insert: {
          action_type: string
          created_at?: string
          generated_message: string
          id?: string
          patient_data?: Json | null
          patient_name: string
          patient_phone: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          generated_message?: string
          id?: string
          patient_data?: Json | null
          patient_name?: string
          patient_phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          contact_name: string | null
          contact_phone: string
          created_at: string
          id: string
          is_archived: boolean | null
          last_message: string | null
          last_message_time: string | null
          unread_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_name?: string | null
          contact_phone: string
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message?: string | null
          last_message_time?: string | null
          unread_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message?: string | null
          last_message_time?: string | null
          unread_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          media_url: string | null
          message_id: string | null
          message_type: string | null
          sender_type: string | null
          timestamp: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_id?: string | null
          message_type?: string | null
          sender_type?: string | null
          timestamp: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_id?: string | null
          message_type?: string | null
          sender_type?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_sessions: {
        Row: {
          created_at: string
          id: string
          is_connected: boolean | null
          phone_number: string | null
          qr_code: string | null
          session_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_connected?: boolean | null
          phone_number?: string | null
          qr_code?: string | null
          session_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_connected?: boolean | null
          phone_number?: string | null
          qr_code?: string | null
          session_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_consultation_number: {
        Args: { p_patient_id: string; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      InstanceConnectionStatus: "open" | "close" | "connecting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      InstanceConnectionStatus: ["open", "close", "connecting"],
    },
  },
} as const
