
import { createClient } from '@supabase/supabase-js';

// These env variables are automatically available via Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types for Supabase tables
export type Tables = {
  users: {
    Row: {
      id: string;
      email: string;
      created_at: string;
    };
  };
  transactions: {
    Row: {
      id: string;
      user_id: string;
      amount: number;
      type: "income" | "expense";
      category: string;
      description: string;
      date: string;
      created_at: string;
    };
  };
  categories: {
    Row: {
      id: string;
      user_id: string;
      name: string;
      budget: number;
      type: "income" | "expense";
      color: string;
      created_at: string;
    };
  };
  loans: {
    Row: {
      id: string;
      user_id: string;
      amount: number;
      type: "borrowed" | "lent";
      person_name: string;
      description: string;
      start_date: string;
      due_date: string;
      interest_rate: number;
      status: "active" | "paid" | "defaulted";
      created_at: string;
    };
  };
  payments: {
    Row: {
      id: string;
      loan_id: string;
      amount: number;
      date: string;
      note: string;
      created_at: string;
    };
  };
};
