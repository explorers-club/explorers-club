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
          user_id: string;
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
    };
    Functions: {};
  };
}

