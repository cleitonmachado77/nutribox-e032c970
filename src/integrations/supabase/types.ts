export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
        }
        Insert: {
          created_at?: string
          google_calendar_link?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          google_calendar_link?: string | null
          id?: string
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
      [_ in never]: never
    }
    Enums: {
      InstanceConnectionStatus: "open" | "close" | "connecting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
