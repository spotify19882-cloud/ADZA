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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_profiles: {
        Row: {
          company_description: string | null
          company_name: string
          created_at: string
          id: string
          industry: string | null
          logo_url: string | null
          portfolio_urls: string[] | null
          profile_id: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          portfolio_urls?: string[] | null
          profile_id: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          portfolio_urls?: string[] | null
          profile_id?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          business_profile_id: string
          categories: Database["public"]["Enums"]["category"][] | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          business_profile_id: string
          categories?: Database["public"]["Enums"]["category"][] | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          business_profile_id?: string
          categories?: Database["public"]["Enums"]["category"][] | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_requests: {
        Row: {
          business_profile_id: string
          campaign_id: string | null
          created_at: string
          id: string
          influencer_profile_id: string
          message: string | null
          proposed_budget: number | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          business_profile_id: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          influencer_profile_id: string
          message?: string | null
          proposed_budget?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          business_profile_id?: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          influencer_profile_id?: string
          message?: string | null
          proposed_budget?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_requests_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_influencer_profile_id_fkey"
            columns: ["influencer_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_profiles: {
        Row: {
          bio: string | null
          categories: Database["public"]["Enums"]["category"][] | null
          created_at: string
          followers_count: number | null
          id: string
          instagram_url: string | null
          is_available: boolean | null
          max_rate: number | null
          min_rate: number | null
          portfolio_urls: string[] | null
          profile_id: string
          rating_avg: number | null
          rating_count: number | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          bio?: string | null
          categories?: Database["public"]["Enums"]["category"][] | null
          created_at?: string
          followers_count?: number | null
          id?: string
          instagram_url?: string | null
          is_available?: boolean | null
          max_rate?: number | null
          min_rate?: number | null
          portfolio_urls?: string[] | null
          profile_id: string
          rating_avg?: number | null
          rating_count?: number | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          bio?: string | null
          categories?: Database["public"]["Enums"]["category"][] | null
          created_at?: string
          followers_count?: number | null
          id?: string
          instagram_url?: string | null
          is_available?: boolean | null
          max_rate?: number | null
          min_rate?: number | null
          portfolio_urls?: string[] | null
          profile_id?: string
          rating_avg?: number | null
          rating_count?: number | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          collaboration_request_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_profile_id: string
          sender_profile_id: string
        }
        Insert: {
          collaboration_request_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_profile_id: string
          sender_profile_id: string
        }
        Update: {
          collaboration_request_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_profile_id?: string
          sender_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_collaboration_request_id_fkey"
            columns: ["collaboration_request_id"]
            isOneToOne: false
            referencedRelation: "collaboration_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          profile_id: string
          related_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          profile_id: string
          related_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          profile_id?: string
          related_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          collaboration_request_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_profile_id: string
          reviewer_profile_id: string
        }
        Insert: {
          collaboration_request_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_profile_id: string
          reviewer_profile_id: string
        }
        Update: {
          collaboration_request_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_profile_id?: string
          reviewer_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_collaboration_request_id_fkey"
            columns: ["collaboration_request_id"]
            isOneToOne: false
            referencedRelation: "collaboration_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_profile_id_fkey"
            columns: ["reviewee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_collaboration: {
        Args: { collab_id: string }
        Returns: boolean
      }
      get_profile_id: { Args: { user_id: string }; Returns: string }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      owns_profile: { Args: { profile_id: string }; Returns: boolean }
    }
    Enums: {
      category:
        | "food"
        | "fashion"
        | "tech"
        | "beauty"
        | "fitness"
        | "travel"
        | "lifestyle"
        | "entertainment"
        | "education"
        | "gaming"
        | "sports"
        | "music"
        | "art"
        | "photography"
        | "other"
      request_status: "pending" | "accepted" | "rejected" | "completed"
      user_role: "business" | "influencer"
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
      category: [
        "food",
        "fashion",
        "tech",
        "beauty",
        "fitness",
        "travel",
        "lifestyle",
        "entertainment",
        "education",
        "gaming",
        "sports",
        "music",
        "art",
        "photography",
        "other",
      ],
      request_status: ["pending", "accepted", "rejected", "completed"],
      user_role: ["business", "influencer"],
    },
  },
} as const
