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
          starting_at: string | null
          started_at: string | null
          id: string
          created_at: string | null
          is_listable: boolean
        }
        Insert: {
          host_user_id: string
          game_id?: string | null
          starting_at?: string | null
          started_at?: string | null
          id?: string
          created_at?: string | null
          is_listable?: boolean
        }
        Update: {
          host_user_id?: string
          game_id?: string | null
          starting_at?: string | null
          started_at?: string | null
          id?: string
          created_at?: string | null
          is_listable?: boolean
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
      rooms: {
        Row: {
          id: string
          name: string
          context: Json
          created_by: string
          created_session_id: string
          created_at: string
          states: string[]
          server_instance_id: string | null
        }
        Insert: {
          id?: string
          name: string
          context: Json
          created_by: string
          created_session_id: string
          created_at?: string
          states: string[]
          server_instance_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          context?: Json
          created_by?: string
          created_session_id?: string
          created_at?: string
          states?: string[]
          server_instance_id?: string | null
        }
      }
      server_instances: {
        Row: {
          id: string
          created_at: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
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

