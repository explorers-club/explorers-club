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
      parties: {
        Row: {
          join_code: string | null;
          host_actor_id: string | null;
          id: string;
          user_id: string;
          is_public: boolean;
          last_activity_at: string;
          created_at: string;
        };
        Insert: {
          join_code?: string | null;
          host_actor_id?: string | null;
          id?: string;
          user_id?: string;
          is_public?: boolean;
          last_activity_at?: string;
          created_at?: string;
        };
        Update: {
          join_code?: string | null;
          host_actor_id?: string | null;
          id?: string;
          user_id?: string;
          is_public?: boolean;
          last_activity_at?: string;
          created_at?: string;
        };
      };
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

