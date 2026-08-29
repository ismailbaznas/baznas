// src/types/database.types.ts
// Manually defined types based on supabase/migrations/0000_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// RPC function return type (used by getRbacUser)
export type RbacUserReturn = {
  name: string | null;
  role: string | null;
  permissions: string[] | null;
}[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string | null
          created_at: string
          last_active_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string | null
        }
        Update: {
          name?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      agendas: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          status: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          location?: string | null
          status?: string
          is_public?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          location?: string | null
          status?: string
          is_public?: boolean
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          type: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          name: string
          type: string
          is_active?: boolean
        }
        Update: {
          slug?: string
          name?: string
          type?: string
          is_active?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          subject: string
          message: string
          type: string
          status: string
          created_at: string
        }
        Insert: {
          name: string
          email?: string | null
          phone?: string | null
          subject: string
          message: string
          type: string
          status?: string
        }
        Update: {
          name?: string
          email?: string | null
          phone?: string | null
          subject?: string
          message?: string
          type?: string
          status?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          document_url: string
          type: string
          year: number | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          title: string
          description?: string | null
          document_url: string
          type: string
          year?: number | null
          is_public?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          document_url?: string
          type?: string
          year?: number | null
          is_public?: boolean
        }
        Relationships: []
      }
      news: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          category_id: string | null
          published_at: string
          is_published: boolean
          author_id: string | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          title: string
          content: string
          category_id?: string | null
          published_at?: string
          is_published?: boolean
          author_id?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          slug?: string
          title?: string
          content?: string
          category_id?: string | null
          published_at?: string
          is_published?: boolean
          author_id?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      permissions: {
        Row: {
          id: string
          module: string
          action: string
          name: string
        }
        Insert: {
          id: string
          module: string
          action: string
          name: string
        }
        Update: {
          module?: string
          action?: string
          name?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          category_id: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          title: string
          description?: string | null
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
        }
        Update: {
          slug?: string
          title?: string
          description?: string | null
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "programs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          permission_ids: string[] | null
          is_system: boolean
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          permission_ids?: string[] | null
          is_system?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          permission_ids?: string[] | null
          is_system?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          name: string
          position: string
          bio: string | null
          photo_url: string | null
          sort_order: number | null
          is_active: boolean
        }
        Insert: {
          name: string
          position: string
          bio?: string | null
          photo_url?: string | null
          sort_order?: number | null
          is_active?: boolean
        }
        Update: {
          name?: string
          position?: string
          bio?: string | null
          photo_url?: string | null
          sort_order?: number | null
          is_active?: boolean
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          id: string
          nama_bank: string
          nomor_rekening: string
          atas_nama: string
          kategori: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_bank: string
          nomor_rekening: string
          atas_nama: string
          kategori?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_bank?: string
          nomor_rekening?: string
          atas_nama?: string
          kategori?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quick_links: {
        Row: {
          id: string
          label: string
          url: string
          sort_order: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          url: string
          sort_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          url?: string
          sort_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      mustahik_applications: {
        Row: {
          id: string
          name: string
          nik: string
          district: string
          phone: string
          category: string
          notes: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          nik: string
          district: string
          phone: string
          category: string
          notes: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          nik?: string
          district?: string
          phone?: string
          category?: string
          notes?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transparency_stats: {
        Row: {
          id: string
          key: string
          label: string
          value: string
          sub_label: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          label: string
          value: string
          sub_label?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          label?: string
          value?: string
          sub_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      placeholder_view: {
        Row: Record<string, any>
      }
    }
    Functions: {
      get_rbac_user: {
        Args: { user_email: string }
        Returns: {
            name: string
            role: string
            permissions: string[]
        }[]
      }
      has_permission: {
        Args: { permission_id: string }
        Returns: boolean
      }
      placeholder_func: {
        Args: Record<string, any>
        Returns: Record<string, any>
      }
    }
    Enums: {
      placeholder_enum: unknown
    }
    CompositeTypes: {
      placeholder_type: unknown
    }
  }
}
