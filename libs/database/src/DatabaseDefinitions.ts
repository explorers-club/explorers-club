export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      game_instances: {
        Row: {
          host_user_id: string
          game_id: string | null
          id: string
          starting_at: string | null
          started_at: string | null
          created_at: string | null
        }
        Insert: {
          host_user_id: string
          game_id?: string | null
          id?: string
          starting_at?: string | null
          started_at?: string | null
          created_at?: string | null
        }
        Update: {
          host_user_id?: string
          game_id?: string | null
          id?: string
          starting_at?: string | null
          started_at?: string | null
          created_at?: string | null
        }
      }
      games: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: number
          player_name: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          player_name?: string | null
          user_id?: string
          created_at?: string
        }
        Update: {
          id?: number
          player_name?: string | null
          user_id?: string
          created_at?: string
        }
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
  }
}

