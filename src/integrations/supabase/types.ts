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
      comparisons: {
        Row: {
          added_at: string
          property_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          property_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          property_id: string | null
          sender_email: string
          sender_name: string
          sender_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          property_id?: string | null
          sender_email: string
          sender_name: string
          sender_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          property_id?: string | null
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          list_name: string | null
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          list_name?: string | null
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          list_name?: string | null
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          property_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          property_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          property_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          city_interest: string | null
          confirmed: boolean | null
          created_at: string
          email: string
          id: string
          lang: string | null
          transaction_interest: string | null
        }
        Insert: {
          city_interest?: string | null
          confirmed?: boolean | null
          created_at?: string
          email: string
          id?: string
          lang?: string | null
          transaction_interest?: string | null
        }
        Update: {
          city_interest?: string | null
          confirmed?: boolean | null
          created_at?: string
          email?: string
          id?: string
          lang?: string | null
          transaction_interest?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_name: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          type: Database["public"]["Enums"]["profile_type"] | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          agency_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          type?: Database["public"]["Enums"]["profile_type"] | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          agency_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["profile_type"] | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          bathrooms: number | null
          city: string
          condition: Database["public"]["Enums"]["property_condition"] | null
          created_at: string
          currency: string
          description: string | null
          description_ar: string | null
          district: string | null
          expires_at: string | null
          featured: boolean | null
          finishing: string | null
          floor_number: number | null
          floors: number | null
          hot_score: number
          id: string
          land_surface: number | null
          lat: number | null
          lng: number | null
          orientation: string | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          published_at: string | null
          rooms: number | null
          status: Database["public"]["Enums"]["property_status"]
          surface: number | null
          title: string
          title_ar: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          verified: boolean | null
          view: string | null
          views_count: number
          year_built: number | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          city: string
          condition?: Database["public"]["Enums"]["property_condition"] | null
          created_at?: string
          currency?: string
          description?: string | null
          description_ar?: string | null
          district?: string | null
          expires_at?: string | null
          featured?: boolean | null
          finishing?: string | null
          floor_number?: number | null
          floors?: number | null
          hot_score?: number
          id?: string
          land_surface?: number | null
          lat?: number | null
          lng?: number | null
          orientation?: string | null
          owner_id: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          published_at?: string | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          surface?: number | null
          title: string
          title_ar?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          verified?: boolean | null
          view?: string | null
          views_count?: number
          year_built?: number | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          city?: string
          condition?: Database["public"]["Enums"]["property_condition"] | null
          created_at?: string
          currency?: string
          description?: string | null
          description_ar?: string | null
          district?: string | null
          expires_at?: string | null
          featured?: boolean | null
          finishing?: string | null
          floor_number?: number | null
          floors?: number | null
          hot_score?: number
          id?: string
          land_surface?: number | null
          lat?: number | null
          lng?: number | null
          orientation?: string | null
          owner_id?: string
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          published_at?: string | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          surface?: number | null
          title?: string
          title_ar?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          verified?: boolean | null
          view?: string | null
          views_count?: number
          year_built?: number | null
        }
        Relationships: []
      }
      property_features: {
        Row: {
          furnished: boolean | null
          has_ac: boolean | null
          has_balcony: boolean | null
          has_concierge: boolean | null
          has_elevator: boolean | null
          has_garden: boolean | null
          has_gym: boolean | null
          has_heating: boolean | null
          has_parking: boolean | null
          has_pool: boolean | null
          has_security: boolean | null
          has_terrace: boolean | null
          near_beach: boolean | null
          near_hospital: boolean | null
          near_mosque: boolean | null
          near_school: boolean | null
          near_transport: boolean | null
          parking_spots: number | null
          pets_allowed: boolean | null
          property_id: string
        }
        Insert: {
          furnished?: boolean | null
          has_ac?: boolean | null
          has_balcony?: boolean | null
          has_concierge?: boolean | null
          has_elevator?: boolean | null
          has_garden?: boolean | null
          has_gym?: boolean | null
          has_heating?: boolean | null
          has_parking?: boolean | null
          has_pool?: boolean | null
          has_security?: boolean | null
          has_terrace?: boolean | null
          near_beach?: boolean | null
          near_hospital?: boolean | null
          near_mosque?: boolean | null
          near_school?: boolean | null
          near_transport?: boolean | null
          parking_spots?: number | null
          pets_allowed?: boolean | null
          property_id: string
        }
        Update: {
          furnished?: boolean | null
          has_ac?: boolean | null
          has_balcony?: boolean | null
          has_concierge?: boolean | null
          has_elevator?: boolean | null
          has_garden?: boolean | null
          has_gym?: boolean | null
          has_heating?: boolean | null
          has_parking?: boolean | null
          has_pool?: boolean | null
          has_security?: boolean | null
          has_terrace?: boolean | null
          near_beach?: boolean | null
          near_hospital?: boolean | null
          near_mosque?: boolean | null
          near_school?: boolean | null
          near_transport?: boolean | null
          parking_spots?: number | null
          pets_allowed?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_features_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          property_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          property_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          property_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          property_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          property_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          criteria: Json
          email_alerts: boolean | null
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          criteria: Json
          email_alerts?: boolean | null
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          email_alerts?: boolean | null
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
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
      viewings: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          owner_id: string
          property_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["viewing_status"]
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          owner_id: string
          property_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["viewing_status"]
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string
          property_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["viewing_status"]
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "user" | "owner" | "agent" | "agency" | "admin"
      profile_type: "individual" | "agency" | "agent"
      property_condition:
        | "new"
        | "good"
        | "renovated"
        | "to_renovate"
        | "under_construction"
      property_status:
        | "draft"
        | "pending"
        | "active"
        | "sold"
        | "rented"
        | "inactive"
      property_type:
        | "apartment"
        | "villa"
        | "house"
        | "land"
        | "commercial"
        | "office"
        | "riad"
        | "studio"
      transaction_type: "sale" | "rent"
      viewing_status: "pending" | "confirmed" | "completed" | "cancelled"
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
      app_role: ["user", "owner", "agent", "agency", "admin"],
      profile_type: ["individual", "agency", "agent"],
      property_condition: [
        "new",
        "good",
        "renovated",
        "to_renovate",
        "under_construction",
      ],
      property_status: [
        "draft",
        "pending",
        "active",
        "sold",
        "rented",
        "inactive",
      ],
      property_type: [
        "apartment",
        "villa",
        "house",
        "land",
        "commercial",
        "office",
        "riad",
        "studio",
      ],
      transaction_type: ["sale", "rent"],
      viewing_status: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
} as const
