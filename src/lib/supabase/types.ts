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
          estudio_id: string | null
          id: string
          referencia_imagem_url: string | null
          status_pagamento: string | null
          valor_sinal: number | null
        }
        Insert: {
          cliente_id?: string | null
          data_hora?: string | null
          estudio_id?: string | null
          id?: string
          referencia_imagem_url?: string | null
          status_pagamento?: string | null
          valor_sinal?: number | null
        }
        Update: {
          cliente_id?: string | null
          data_hora?: string | null
          estudio_id?: string | null
          id?: string
          referencia_imagem_url?: string | null
          status_pagamento?: string | null
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
          created_at: string | null
          estudio_id: string | null
          historico_medico: string | null
          id: string
          nome: string | null
          telefone: string | null
        }
        Insert: {
          alergias?: string | null
          created_at?: string | null
          estudio_id?: string | null
          historico_medico?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          alergias?: string | null
          created_at?: string | null
          estudio_id?: string | null
          historico_medico?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
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
          created_at: string | null
          id: string
          mp_access_token: string | null
          nome: string
          status_assinatura: string | null
          whatsapp_vinculado: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mp_access_token?: string | null
          nome: string
          status_assinatura?: string | null
          whatsapp_vinculado?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mp_access_token?: string | null
          nome?: string
          status_assinatura?: string | null
          whatsapp_vinculado?: string | null
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
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   estudio_id: uuid (nullable)
//   nome: text (nullable)
//   telefone: text (nullable)
//   alergias: text (nullable)
//   historico_medico: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: estudios
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   whatsapp_vinculado: text (nullable)
//   mp_access_token: text (nullable)
//   status_assinatura: text (nullable, default: 'ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
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
//   UNIQUE estudios_whatsapp_vinculado_key: UNIQUE (whatsapp_vinculado)
// Table: termos_lgpd
//   FOREIGN KEY termos_lgpd_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id)
//   FOREIGN KEY termos_lgpd_estudio_id_fkey: FOREIGN KEY (estudio_id) REFERENCES estudios(id)
//   PRIMARY KEY termos_lgpd_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: clientes
//   Policy "Isolamento por Estúdio" (ALL, PERMISSIVE) roles={public}
//     USING: (estudio_id = auth.uid())

// --- WARNING: TABLES WITH RLS ENABLED BUT NO POLICIES ---
// These tables have Row Level Security enabled but NO policies defined.
// This means ALL queries (SELECT, INSERT, UPDATE, DELETE) will return ZERO rows
// for non-superuser roles (including the anon and authenticated roles used by the app).
// You MUST create RLS policies for these tables to allow data access.
//   - agendamentos
//   - estudios
//   - termos_lgpd

// --- INDEXES ---
// Table: estudios
//   CREATE UNIQUE INDEX estudios_whatsapp_vinculado_key ON public.estudios USING btree (whatsapp_vinculado)
