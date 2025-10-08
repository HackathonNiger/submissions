export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          account_number: string | null;
          bank_name: string | null;
          account_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          account_number?: string | null;
          bank_name?: string | null;
          account_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          account_number?: string | null;
          bank_name?: string | null;
          account_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      causes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          goal: number;
          raised: number;
          status: string;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
          image: string | null;
          days_active: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          goal: number;
          raised?: number;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          image?: string | null;
          days_active?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          goal?: number;
          raised?: number;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          image?: string | null;
          days_active?: number | null;
        };
      };
      petitions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          goal: number;
          raised: number;
          status: string;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
          image: string | null;
          days_active: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          goal: number;
          raised?: number;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          image?: string | null;
          days_active?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          goal?: number;
          raised?: number;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          image?: string | null;
          days_active?: number | null;
        };
      };
      donations: {
        Row: {
          id: string;
          cause_id: string;
          user_id: string | null;
          amount: number;
          name: string;
          email: string;
          message: string | null;
          is_anonymous: boolean;
          status: string;
          receipt_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cause_id: string;
          user_id?: string | null;
          amount: number;
          name: string;
          email: string;
          message?: string | null;
          is_anonymous?: boolean;
          status?: string;
          receipt_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cause_id?: string;
          user_id?: string | null;
          amount?: number;
          name?: string;
          email?: string;
          message?: string | null;
          is_anonymous?: boolean;
          status?: string;
          receipt_url?: string | null;
          created_at?: string;
        };
      };
      signatures: {
        Row: {
          id: string;
          petition_id: string;
          user_id: string | null;
          amount: number;
          name: string;
          email: string;
          message: string | null;
          is_anonymous: boolean;
          status: string;
          receipt_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          petition_id: string;
          user_id?: string | null;
          amount: number;
          name: string;
          email: string;
          message?: string | null;
          is_anonymous?: boolean;
          status?: string;
          receipt_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          petition_id?: string;
          user_id?: string | null;
          amount?: number;
          name?: string;
          email?: string;
          message?: string | null;
          is_anonymous?: boolean;
          status?: string;
          receipt_url?: string | null;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          cause_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
          parent_id: string | null;
        };
        Insert: {
          id?: string;
          cause_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string | null;
        };
        Update: {
          id?: string;
          cause_id?: string;
          user_id?: string;
          content?: string;
          updated_at?: string;
          parent_id?: string | null;
        };
      };
    };
  };
}
