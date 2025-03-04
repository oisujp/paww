export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      passes: {
        Row: {
          addedAt: string | null
          authenticationToken: string
          createdAt: string
          id: string
          passTemplateId: string
          publicUrl: string
          publishedAt: string | null
          serialNumber: string
          updatedAt: string | null
          usedAt: string | null
          userId: string | null
        }
        Insert: {
          addedAt?: string | null
          authenticationToken?: string
          createdAt?: string
          id?: string
          passTemplateId: string
          publicUrl: string
          publishedAt?: string | null
          serialNumber?: string
          updatedAt?: string | null
          usedAt?: string | null
          userId?: string | null
        }
        Update: {
          addedAt?: string | null
          authenticationToken?: string
          createdAt?: string
          id?: string
          passTemplateId?: string
          publicUrl?: string
          publishedAt?: string | null
          serialNumber?: string
          updatedAt?: string | null
          usedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passes_passTemplateId_fkey"
            columns: ["passTemplateId"]
            isOneToOne: false
            referencedRelation: "passTemplates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      passTemplates: {
        Row: {
          backgroundColor: string
          coupon: Json
          createdAt: string
          deletedAt: string | null
          description: string
          expirationDate: string | null
          foregroundColor: string
          formatVersion: number | null
          iconUrl: string
          id: string
          labelColor: string
          logoText: string | null
          logoUrl: string
          name: string
          organizationName: string
          passTypeIdentifier: string
          serialNumber: string
          stripUrl: string | null
          teamIdentifier: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          backgroundColor: string
          coupon: Json
          createdAt?: string
          deletedAt?: string | null
          description: string
          expirationDate?: string | null
          foregroundColor: string
          formatVersion?: number | null
          iconUrl: string
          id?: string
          labelColor: string
          logoText?: string | null
          logoUrl: string
          name: string
          organizationName: string
          passTypeIdentifier: string
          serialNumber: string
          stripUrl?: string | null
          teamIdentifier: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          backgroundColor?: string
          coupon?: Json
          createdAt?: string
          deletedAt?: string | null
          description?: string
          expirationDate?: string | null
          foregroundColor?: string
          formatVersion?: number | null
          iconUrl?: string
          id?: string
          labelColor?: string
          logoText?: string | null
          logoUrl?: string
          name?: string
          organizationName?: string
          passTypeIdentifier?: string
          serialNumber?: string
          stripUrl?: string | null
          teamIdentifier?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "passTemplates_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          iconUrl: string | null
          id: string
          logoUrl: string | null
          name: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          iconUrl?: string | null
          id?: string
          logoUrl?: string | null
          name?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          iconUrl?: string | null
          id?: string
          logoUrl?: string | null
          name?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      json_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: {
          schema: Json
        }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
