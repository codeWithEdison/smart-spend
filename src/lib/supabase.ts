
import { createClient } from '@supabase/supabase-js';

// Use the credentials from the Supabase integration
const supabaseUrl = "https://qpyrqtpavtcpltkksvvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXJxdHBhdnRjcGx0a2tzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzExNTgsImV4cCI6MjA2MDc0NzE1OH0.h1uoFRyDl6OTOkWIHxSHpSzxrJtJi1PmDybL1UrJLVw";

// Create the Supabase client with the credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

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
