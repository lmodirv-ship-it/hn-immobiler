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
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_holder: string
          account_type: string
          active: boolean | null
          bank_name: string
          created_at: string
          display_order: number | null
          iban: string | null
          id: string
          rib: string | null
          swift: string | null
        }
        Insert: {
          account_holder: string
          account_type?: string
          active?: boolean | null
          bank_name: string
          created_at?: string
          display_order?: number | null
          iban?: string | null
          id?: string
          rib?: string | null
          swift?: string | null
        }
        Update: {
          account_holder?: string
          account_type?: string
          active?: boolean | null
          bank_name?: string
          created_at?: string
          display_order?: number | null
          iban?: string | null
          id?: string
          rib?: string | null
          swift?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          check_in: string
          check_out: string
          created_at: string
          currency: string
          guest_id: string
          guests: number
          host_id: string | null
          id: string
          nights: number | null
          payment_status: string
          price_per_night: number
          property_id: string
          special_requests: string | null
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          check_in: string
          check_out: string
          created_at?: string
          currency?: string
          guest_id: string
          guests?: number
          host_id?: string | null
          id?: string
          nights?: number | null
          payment_status?: string
          price_per_night?: number
          property_id: string
          special_requests?: string | null
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          currency?: string
          guest_id?: string
          guests?: number
          host_id?: string | null
          id?: string
          nights?: number | null
          payment_status?: string
          price_per_night?: number
          property_id?: string
          special_requests?: string | null
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
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
      invoices: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          description: string | null
          due_date: string
          id: string
          owner_id: string
          paid_at: string | null
          property_id: string
          status: string
          tenant_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date: string
          id?: string
          owner_id: string
          paid_at?: string | null
          property_id: string
          status?: string
          tenant_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string
          id?: string
          owner_id?: string
          paid_at?: string | null
          property_id?: string
          status?: string
          tenant_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          booking_id: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          owner_id: string
          photo_url: string | null
          priority: string
          property_id: string
          requester_id: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          photo_url?: string | null
          priority?: string
          property_id: string
          requester_id: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          photo_url?: string | null
          priority?: string
          property_id?: string
          requester_id?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          property_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          property_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
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
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          created_by: string | null
          id: string
          kind: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          admin_notes: string | null
          agency_name: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          payer_name: string | null
          payer_phone: string | null
          plan_id: string | null
          proof_url: string | null
          reference: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          agency_name?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          plan_id?: string | null
          proof_url?: string | null
          reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          agency_name?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          plan_id?: string | null
          proof_url?: string | null
          reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          base_currency: string
          contact_email: string | null
          default_commission_pct: number
          id: boolean
          maintenance_mode: boolean
          platform_name: string
          support_phone: string | null
          updated_at: string
          updated_by: string | null
          vat_pct: number
        }
        Insert: {
          base_currency?: string
          contact_email?: string | null
          default_commission_pct?: number
          id?: boolean
          maintenance_mode?: boolean
          platform_name?: string
          support_phone?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_pct?: number
        }
        Update: {
          base_currency?: string
          contact_email?: string | null
          default_commission_pct?: number
          id?: boolean
          maintenance_mode?: boolean
          platform_name?: string
          support_phone?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_pct?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_name: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          commission_pct: number | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          suspended: boolean
          type: Database["public"]["Enums"]["profile_type"] | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          agency_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commission_pct?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          suspended?: boolean
          type?: Database["public"]["Enums"]["profile_type"] | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          agency_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commission_pct?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          suspended?: boolean
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
          seasonal_pricing: Json
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
          seasonal_pricing?: Json
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
          seasonal_pricing?: Json
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
      property_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          min_stay: number | null
          note: string | null
          price_override: number | null
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          min_stay?: number | null
          note?: string | null
          price_override?: number | null
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          min_stay?: number | null
          note?: string | null
          price_override?: number | null
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          owner_reply: string | null
          owner_reply_at: string | null
          property_id: string | null
          rating: number
          reviewed_id: string
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          owner_reply?: string | null
          owner_reply_at?: string | null
          property_id?: string | null
          rating: number
          reviewed_id: string
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          owner_reply?: string | null
          owner_reply_at?: string | null
          property_id?: string | null
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      role_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          reason: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_role?: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
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
      site_visits: {
        Row: {
          country: string | null
          created_at: string
          id: number
          path: string | null
          session_hash: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: number
          path?: string | null
          session_hash?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: number
          path?: string | null
          session_hash?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          created_at: string
          currency: string
          display_order: number | null
          featured: boolean | null
          features: Json | null
          id: string
          interval: string
          max_listings: number | null
          name: string
          name_ar: string | null
          price: number
          slug: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          currency?: string
          display_order?: number | null
          featured?: boolean | null
          features?: Json | null
          id?: string
          interval?: string
          max_listings?: number | null
          name: string
          name_ar?: string | null
          price: number
          slug: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          currency?: string
          display_order?: number | null
          featured?: boolean | null
          features?: Json | null
          id?: string
          interval?: string
          max_listings?: number | null
          name?: string
          name_ar?: string | null
          price?: number
          slug?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          ends_at: string | null
          id: string
          plan_id: string
          starts_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
      broadcast_notification: {
        Args: {
          _body: string
          _kind?: string
          _link?: string
          _target_role?: Database["public"]["Enums"]["app_role"]
          _title: string
        }
        Returns: number
      }
      get_admin_revenue_series: {
        Args: { _months?: number }
        Returns: {
          bookings: number
          month: string
          revenue: number
        }[]
      }
      get_admin_stats: {
        Args: never
        Returns: {
          bookings_today: number
          open_maintenance: number
          pending_bookings: number
          pending_properties: number
          revenue_month: number
          total_owners: number
          total_properties: number
          total_users: number
          unpaid_invoices: number
        }[]
      }
      get_owner_revenue_series: {
        Args: { _months?: number; _owner: string }
        Returns: {
          bookings: number
          month: string
          revenue: number
        }[]
      }
      get_owner_stats: {
        Args: { _owner: string }
        Returns: {
          avg_rating: number
          confirmed_bookings: number
          month_revenue: number
          occupancy_rate: number
          pending_bookings: number
          total_properties: number
          total_reviews: number
          unread_messages: number
        }[]
      }
      get_visitor_stats: {
        Args: never
        Returns: {
          online: number
          today: number
          total: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "user"
        | "owner"
        | "agent"
        | "agency"
        | "admin"
        | "tenant"
        | "visitor"
      payment_method:
        | "cash"
        | "wallet"
        | "cmi"
        | "payzone"
        | "stripe"
        | "bank_transfer"
        | "agency_transfer"
        | "paypal"
      payment_status: "pending" | "confirmed" | "rejected" | "refunded"
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
      subscription_status: "pending" | "active" | "expired" | "cancelled"
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
      app_role: [
        "user",
        "owner",
        "agent",
        "agency",
        "admin",
        "tenant",
        "visitor",
      ],
      payment_method: [
        "cash",
        "wallet",
        "cmi",
        "payzone",
        "stripe",
        "bank_transfer",
        "agency_transfer",
        "paypal",
      ],
      payment_status: ["pending", "confirmed", "rejected", "refunded"],
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
      subscription_status: ["pending", "active", "expired", "cancelled"],
      transaction_type: ["sale", "rent"],
      viewing_status: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
} as const
