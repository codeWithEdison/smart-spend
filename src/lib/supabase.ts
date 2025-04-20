import { createClient } from '@supabase/supabase-js';

// These env variables are automatically available via Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client when credentials are missing (development/build time)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

// Helper function to create a mock Supabase client
function createMockSupabaseClient() {
  console.error(
    'Supabase URL or Anon Key is missing. Using a mock client. ' +
    'Make sure your Supabase integration is properly configured in Lovable.'
  );
  
  // Return a mock client that won't throw errors but won't work with real data
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ error: new Error('Mock client: Supabase not configured') }),
      signInWithPassword: async () => ({ error: new Error('Mock client: Supabase not configured') }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            in: () => ({ data: [], error: null }),
            data: [],
            error: null
          }),
          in: () => ({ data: [], error: null }),
          data: [],
          error: null
        }),
        single: () => ({ data: null, error: null }),
        data: [],
        error: null
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({ error: null })
      })
    })
  };
}

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
