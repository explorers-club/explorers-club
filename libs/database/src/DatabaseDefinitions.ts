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
          user_id: string;
          created_at: string;
          player_name: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string;
          created_at?: string;
          player_name?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          created_at?: string;
          player_name?: string | null;
        };
      };
      parties: {
        Row: {
          id: string;
          user_id: string;
          join_code: string | null;
          last_activity_at: string;
          created_at: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          user_id?: string;
          join_code?: string | null;
          last_activity_at?: string;
          created_at?: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          join_code?: string | null;
          last_activity_at?: string;
          created_at?: string;
          is_public?: boolean;
        };
      };
      party_players: {
        Row: {
          party_id: string;
          user_id: string;
          connected: boolean;
          created_at: string;
        };
        Insert: {
          party_id: string;
          user_id?: string;
          connected?: boolean;
          created_at?: string;
        };
        Update: {
          party_id?: string;
          user_id?: string;
          connected?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {};
  };
}

