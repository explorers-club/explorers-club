export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number;
          player_name: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          player_name?: string | null;
          user_id?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          player_name?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      parties: {
        Row: {
          join_code: string | null;
          id: string;
          user_id: string;
          is_public: boolean;
          last_activity_at: string;
          created_at: string;
          actor_host_id: string | null;
        };
        Insert: {
          join_code?: string | null;
          id?: string;
          user_id?: string;
          is_public?: boolean;
          last_activity_at?: string;
          created_at?: string;
          actor_host_id?: string | null;
        };
        Update: {
          join_code?: string | null;
          id?: string;
          user_id?: string;
          is_public?: boolean;
          last_activity_at?: string;
          created_at?: string;
          actor_host_id?: string | null;
        };
      };
      party_players: {
        Row: {
          party_id: string;
          user_id: string;
          join_token: string;
        };
        Insert: {
          party_id: string;
          user_id: string;
          join_token?: string;
        };
        Update: {
          party_id?: string;
          user_id?: string;
          join_token?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

