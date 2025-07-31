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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_detections: {
        Row: {
          ai_probability: number
          analysis_type: string
          created_at: string
          id: string
          original_text: string
          overall_score: number
          suspected_ai_agent: string | null
        }
        Insert: {
          ai_probability: number
          analysis_type: string
          created_at?: string
          id?: string
          original_text: string
          overall_score: number
          suspected_ai_agent?: string | null
        }
        Update: {
          ai_probability?: number
          analysis_type?: string
          created_at?: string
          id?: string
          original_text?: string
          overall_score?: number
          suspected_ai_agent?: string | null
        }
        Relationships: []
      }
      detection_indicators: {
        Row: {
          description: string | null
          detection_id: string
          id: string
          indicator_name: string
          score: number
          weight: number
        }
        Insert: {
          description?: string | null
          detection_id: string
          id?: string
          indicator_name: string
          score: number
          weight?: number
        }
        Update: {
          description?: string | null
          detection_id?: string
          id?: string
          indicator_name?: string
          score?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "detection_indicators_detection_id_fkey"
            columns: ["detection_id"]
            isOneToOne: false
            referencedRelation: "ai_detections"
            referencedColumns: ["id"]
          },
        ]
      }
      text_sections: {
        Row: {
          ai_probability: number
          detection_id: string
          end_position: number
          id: string
          reasoning: string | null
          section_text: string
          start_position: number
          suspicion_level: string
        }
        Insert: {
          ai_probability: number
          detection_id: string
          end_position: number
          id?: string
          reasoning?: string | null
          section_text: string
          start_position: number
          suspicion_level: string
        }
        Update: {
          ai_probability?: number
          detection_id?: string
          end_position?: number
          id?: string
          reasoning?: string | null
          section_text?: string
          start_position?: number
          suspicion_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "text_sections_detection_id_fkey"
            columns: ["detection_id"]
            isOneToOne: false
            referencedRelation: "ai_detections"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_files: {
        Row: {
          created_at: string
          detection_id: string
          extracted_text: string
          file_size: number
          file_type: string
          filename: string
          id: string
        }
        Insert: {
          created_at?: string
          detection_id: string
          extracted_text: string
          file_size: number
          file_type: string
          filename: string
          id?: string
        }
        Update: {
          created_at?: string
          detection_id?: string
          extracted_text?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_detection_id_fkey"
            columns: ["detection_id"]
            isOneToOne: false
            referencedRelation: "ai_detections"
            referencedColumns: ["id"]
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
    Enums: {},
  },
} as const
