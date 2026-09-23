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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      diseases: {
        Row: {
          causes: string[]
          chemical_treatments: string[]
          created_at: string
          crop: string
          default_severity: Database["public"]["Enums"]["severity_level"]
          description_en: string
          description_hi: string | null
          description_mr: string | null
          favourable_conditions: string | null
          fertilizer_advice: string
          id: string
          image_url: string | null
          name_en: string
          name_hi: string | null
          name_mr: string | null
          organic_treatments: string[]
          preventive_measures: string[]
          scientific_name: string | null
          slug: string
          symptoms: string[]
          updated_at: string
        }
        Insert: {
          causes?: string[]
          chemical_treatments?: string[]
          created_at?: string
          crop: string
          default_severity?: Database["public"]["Enums"]["severity_level"]
          description_en?: string
          description_hi?: string | null
          description_mr?: string | null
          favourable_conditions?: string | null
          fertilizer_advice?: string
          id?: string
          image_url?: string | null
          name_en: string
          name_hi?: string | null
          name_mr?: string | null
          organic_treatments?: string[]
          preventive_measures?: string[]
          scientific_name?: string | null
          slug: string
          symptoms?: string[]
          updated_at?: string
        }
        Update: {
          causes?: string[]
          chemical_treatments?: string[]
          created_at?: string
          crop?: string
          default_severity?: Database["public"]["Enums"]["severity_level"]
          description_en?: string
          description_hi?: string | null
          description_mr?: string | null
          favourable_conditions?: string | null
          fertilizer_advice?: string
          id?: string
          image_url?: string | null
          name_en?: string
          name_hi?: string | null
          name_mr?: string | null
          organic_treatments?: string[]
          preventive_measures?: string[]
          scientific_name?: string | null
          slug?: string
          symptoms?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          district: string | null
          farm_size_acres: number | null
          full_name: string
          id: string
          language: Database["public"]["Enums"]["app_language"]
          phone: string | null
          primary_crops: string[]
          state: string | null
          updated_at: string
          village: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          farm_size_acres?: number | null
          full_name?: string
          id: string
          language?: Database["public"]["Enums"]["app_language"]
          phone?: string | null
          primary_crops?: string[]
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          farm_size_acres?: number | null
          full_name?: string
          id?: string
          language?: Database["public"]["Enums"]["app_language"]
          phone?: string | null
          primary_crops?: string[]
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      scans: {
        Row: {
          ai_raw: Json | null
          ai_summary: string | null
          confidence: number | null
          created_at: string
          crop: string | null
          detected_label: string | null
          disease_id: string | null
          id: string
          image_path: string
          is_healthy: boolean
          latitude: number | null
          longitude: number | null
          model_version: string | null
          notes: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          status: Database["public"]["Enums"]["scan_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_raw?: Json | null
          ai_summary?: string | null
          confidence?: number | null
          created_at?: string
          crop?: string | null
          detected_label?: string | null
          disease_id?: string | null
          id?: string
          image_path: string
          is_healthy?: boolean
          latitude?: number | null
          longitude?: number | null
          model_version?: string | null
          notes?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["scan_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_raw?: Json | null
          ai_summary?: string | null
          confidence?: number | null
          created_at?: string
          crop?: string | null
          detected_label?: string | null
          disease_id?: string | null
          id?: string
          image_path?: string
          is_healthy?: boolean
          latitude?: number | null
          longitude?: number | null
          model_version?: string | null
          notes?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["scan_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scans_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          detail: string | null
          due_on: string | null
          id: string
          scan_id: string
          step_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          detail?: string | null
          due_on?: string | null
          id?: string
          scan_id: string
          step_order?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          detail?: string | null
          due_on?: string | null
          id?: string
          scan_id?: string
          step_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_steps_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_language: "en" | "hi" | "mr"
      app_role: "farmer" | "agronomist" | "admin"
      scan_status: "pending" | "analyzing" | "completed" | "failed"
      severity_level: "low" | "moderate" | "high" | "critical"
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
      app_language: ["en", "hi", "mr"],
      app_role: ["farmer", "agronomist", "admin"],
      scan_status: ["pending", "analyzing", "completed", "failed"],
      severity_level: ["low", "moderate", "high", "critical"],
    },
  },
} as const
