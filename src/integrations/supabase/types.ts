export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_access_requests: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      animals: {
        Row: {
          adoption_status: string
          age: string | null
          behaviour: string | null
          created_at: string
          description: string | null
          gender: string | null
          geopet_id: string | null
          health_status: string | null
          id: string
          location: string | null
          name: string
          photos: string[]
          published: boolean
          rescue_story: string | null
          species: string | null
          sterilization_status: string | null
          vaccination_status: string | null
        }
        Insert: {
          adoption_status?: string
          age?: string | null
          behaviour?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          geopet_id?: string | null
          health_status?: string | null
          id?: string
          location?: string | null
          name: string
          photos?: string[]
          published?: boolean
          rescue_story?: string | null
          species?: string | null
          sterilization_status?: string | null
          vaccination_status?: string | null
        }
        Update: {
          adoption_status?: string
          age?: string | null
          behaviour?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          geopet_id?: string | null
          health_status?: string | null
          id?: string
          location?: string | null
          name?: string
          photos?: string[]
          published?: boolean
          rescue_story?: string | null
          species?: string | null
          sterilization_status?: string | null
          vaccination_status?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donated_on: string
          donor_name: string
          email: string | null
          id: string
          method: string | null
          notes: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          donated_on?: string
          donor_name: string
          email?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donated_on?: string
          donor_name?: string
          email?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          reference?: string | null
        }
        Relationships: []
      }
      geopet_records: {
        Row: {
          animal_id: string
          medical_record: string | null
          recovery_timeline: string | null
          rescue_history: string | null
          sponsor_info: string | null
          updated_at: string
          vaccination_history: string | null
        }
        Insert: {
          animal_id: string
          medical_record?: string | null
          recovery_timeline?: string | null
          rescue_history?: string | null
          sponsor_info?: string | null
          updated_at?: string
          vaccination_history?: string | null
        }
        Update: {
          animal_id?: string
          medical_record?: string | null
          recovery_timeline?: string | null
          rescue_history?: string | null
          sponsor_info?: string | null
          updated_at?: string
          vaccination_history?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "geopet_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: true
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          gpc_id: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          gpc_id?: string
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          gpc_id?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          animal_id: string | null
          created_at: string
          details: Json
          email: string
          gpc_id: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          animal_id?: string | null
          created_at?: string
          details?: Json
          email: string
          gpc_id?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          type: string
          user_id?: string | null
        }
        Update: {
          animal_id?: string | null
          created_at?: string
          details?: Json
          email?: string
          gpc_id?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
