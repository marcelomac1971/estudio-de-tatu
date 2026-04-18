// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_id: string | null
          data_hora: string | null
          date: string | null
          description: string | null
          duration: number | null
          estudio_id: string | null
          financial_status: string | null
          id: string
          payment_status: string | null
          referencia_imagem_url: string | null
          reschedule_link: string | null
          status: string | null
          status_pagamento: string | null
          time: string | null
          total_value: number | null
          valor_sinal: number | null
        }
        Insert: {
          cliente_id?: string | null
          data_hora?: string | null
          date?: string | null
          description?: string | null
          duration?: number | null
          estudio_id?: string | null
          financial_status?: string | null
          id?: string
          payment_status?: string | null
          referencia_imagem_url?: string | null
          reschedule_link?: string | null
          status?: string | null
          status_pagamento?: string | null
          time?: string | null
          total_value?: number | null
          valor_sinal?: number | null
        }
        Update: {
          cliente_id?: string | null
          data_hora?: string | null
          date?: string | null
          description?: string | null
          duration?: number | null
          estudio_id?: string | null
          financial_status?: string | null
          id?: string
          payment_status?: string | null
          referencia_imagem_url?: string | null
          reschedule_link?: string | null
          status?: string | null
          status_pagamento?: string | null
          time?: string | null
          total_value?: number | null
          valor_sinal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'agendamentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamentos_estudio_id_fkey'
            columns: ['estudio_id']
            isOneToOne: false
            referencedRelation: 'estudios'
            referencedColumns: ['id']
          },
        ]
      }
      clientes: {
        Row: {
          alergias: string | null
          avatar: string | null
          consent_ip: string | null
          consent_timestamp: string | null
          created_at: string | null
          estudio_id: string | null
          health_data_consent: boolean | null
          historico_medico: string | null
          history: Json | null
          id: string
          image_rights: boolean | null
          nome: string | null
          reference_image: string | null
          reference_type: string | null
          telefone: string | null
          total_spent: number | null
        }
        Insert: {
          alergias?: string | null
          avatar?: string | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          estudio_id?: string | null
          health_data_consent?: boolean | null
          historico_medico?: string | null
          history?: Json | null
          id?: string
          image_rights?: boolean | null
          nome?: string | null
          reference_image?: string | null
          reference_type?: string | null
          telefone?: string | null
          total_spent?: number | null
        }
        Update: {
          alergias?: string | null
          avatar?: string | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          estudio_id?: string | null
          health_data_consent?: boolean | null
          historico_medico?: string | null
          history?: Json | null
          id?: string
          image_rights?: boolean | null
          nome?: string | null
          reference_image?: string | null
          reference_type?: string | null
          telefone?: string | null
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'clientes_estudio_id_fkey'
            columns: ['estudio_id']
            isOneToOne: false
            referencedRelation: 'estudios'
            referencedColumns: ['id']
          },
        ]
      }
      estudios: {
        Row: {
          address: string | null
          availability_search_margin: number | null
          billing_cycle_end: string | null
          bot_first_message: string | null
          contact_email: string | null
          created_at: string | null
          deposit_percentage: number | null
          google_calendar_connected: boolean | null
          id: string
          location: string | null
          mp_access_token: string | null
          mrr: number | null
          nome: string
          recovery_message: string | null
          status_assinatura: string | null
          tattoo_style_configs: Json | null
          tattoo_styles: Json | null
          user_id: string | null
          whatsapp_vinculado: string | null
          zapi_instance_id: string | null
          zapi_token: string | null
        }
        Insert: {
          address?: string | null
          availability_search_margin?: number | null
          billing_cycle_end?: string | null
          bot_first_message?: string | null
          contact_email?: string | null
          created_at?: string | null
          deposit_percentage?: number | null
          google_calendar_connected?: boolean | null
          id?: string
          location?: string | null
          mp_access_token?: string | null
          mrr?: number | null
          nome: string
          recovery_message?: string | null
          status_assinatura?: string | null
          tattoo_style_configs?: Json | null
          tattoo_styles?: Json | null
          user_id?: string | null
          whatsapp_vinculado?: string | null
          zapi_instance_id?: string | null
          zapi_token?: string | null
        }
        Update: {
          address?: string | null
          availability_search_margin?: number | null
          billing_cycle_end?: string | null
          bot_first_message?: string | null
          contact_email?: string | null
          created_at?: string | null
          deposit_percentage?: number | null
          google_calendar_connected?: boolean | null
          id?: string
          location?: string | null
          mp_access_token?: string | null
          mrr?: number | null
          nome?: string
          recovery_message?: string | null
          status_assinatura?: string | null
          tattoo_style_configs?: Json | null
          tattoo_styles?: Json | null
          user_id?: string | null
          whatsapp_vinculado?: string | null
          zapi_instance_id?: string | null
          zapi_token?: string | null
        }
        Relationships: []
      }
      termos_lgpd: {
        Row: {
          aceito: boolean | null
          assinado_em: string | null
          cliente_id: string | null
          estudio_id: string | null
          id: string
          ip_assinatura: string | null
        }
        Insert: {
          aceito?: boolean | null
          assinado_em?: string | null
          cliente_id?: string | null
          estudio_id?: string | null
          id?: string
          ip_assinatura?: string | null
        }
        Update: {
          aceito?: boolean | null
          assinado_em?: string | null
          cliente_id?: string | null
          estudio_id?: string | null
          id?: string
          ip_assinatura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'termos_lgpd_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'termos_lgpd_estudio_id_fkey'
            columns: ['estudio_id']
            isOneToOne: false
            referencedRelation: 'estudios'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: agendamentos
//   id: uuid (not null, default: gen_random_uuid())
//   estudio_id: uuid (nullable)
//   cliente_id: uuid (nullable)
//   data_hora: timestamp with time zone (nullable)
//   valor_sinal: numeric (nullable)
//   status_pagamento: text (nullable, default: 'pendente'::text)
//   referencia_imagem_url: text (nullable)
//   duration: numeric (nullable)
//   description: text (nullable)
//   total_value: numeric (nullable)
//   financial_status: text (nullable)
//   reschedule_link: text (nullable)
//   date: text (nullable)
//   time: text (nullable)
//   status: text (nullable, default: 'pending'::text)
//   payment_status: text (nullable, default: 'pending'::text)
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   estudio_id: uuid (nullable)
//   nome: text (nullable)
//   telefone: text (nullable)
//   alergias: text (nullable)
//   historico_medico: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   avatar: text (nullable)
//   total_spent: numeric (nullable, default: 0)
//   health_data_consent: boolean (nullable, default: false)
//   image_rights: boolean (nullable, default: false)
//   consent_timestamp: text (nullable)
//   consent_ip: text (nullable)
//   reference_type: text (nullable)
//   reference_image: text (nullable)
//   history: jsonb (nullable)
// Table: estudios
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   whatsapp_vinculado: text (nullable)
//   mp_access_token: text (nullable)
//   status_assinatura: text (nullable, default: 'ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   user_id: uuid (nullable)
//   contact_email: text (nullable)
//   address: text (nullable)
//   location: text (nullable)
//   mrr: numeric (nullable)
//   tattoo_styles: jsonb (nullable)
//   bot_first_message: text (nullable)
//   recovery_message: text (nullable)
//   deposit_percentage: numeric (nullable)
//   availability_search_margin: integer (nullable)
//   tattoo_style_configs: jsonb (nullable)
//   zapi_instance_id: text (nullable)
//   zapi_token: text (nullable)
//   google_calendar_connected: boolean (nullable, default: false)
//   billing_cycle_end: text (nullable)
// Table: termos_lgpd
//   id: uuid (not null, default: gen_random_uuid())
//   estudio_id: uuid (nullable)
//   cliente_id: uuid (nullable)
//   aceito: boolean (nullable, default: false)
//   ip_assinatura: text (nullable)
//   assinado_em: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: agendamentos
//   FOREIGN KEY agendamentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   FOREIGN KEY agendamentos_estudio_id_fkey: FOREIGN KEY (estudio_id) REFERENCES estudios(id) ON DELETE CASCADE
//   PRIMARY KEY agendamentos_pkey: PRIMARY KEY (id)
// Table: clientes
//   FOREIGN KEY clientes_estudio_id_fkey: FOREIGN KEY (estudio_id) REFERENCES estudios(id) ON DELETE CASCADE
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
// Table: estudios
//   PRIMARY KEY estudios_pkey: PRIMARY KEY (id)
//   FOREIGN KEY estudios_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
//   UNIQUE estudios_whatsapp_vinculado_key: UNIQUE (whatsapp_vinculado)
// Table: termos_lgpd
//   FOREIGN KEY termos_lgpd_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id)
//   FOREIGN KEY termos_lgpd_estudio_id_fkey: FOREIGN KEY (estudio_id) REFERENCES estudios(id)
//   PRIMARY KEY termos_lgpd_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: agendamentos
//   Policy "agendamentos_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
//   Policy "agendamentos_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (estudio_id = auth.uid())
//   Policy "agendamentos_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
//   Policy "agendamentos_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
// Table: clientes
//   Policy "Isolamento por Estúdio" (ALL, PERMISSIVE) roles={public}
//     USING: (estudio_id = auth.uid())
//   Policy "clientes_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
//   Policy "clientes_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (estudio_id = auth.uid())
//   Policy "clientes_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
//   Policy "clientes_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (estudio_id = auth.uid())
// Table: estudios
//   Policy "estudios_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "estudios_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "estudios_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: termos_lgpd
//   Policy "termos_lgpd_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "termos_lgpd_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "termos_lgpd_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true

// --- INDEXES ---
// Table: estudios
//   CREATE UNIQUE INDEX estudios_whatsapp_vinculado_key ON public.estudios USING btree (whatsapp_vinculado)
