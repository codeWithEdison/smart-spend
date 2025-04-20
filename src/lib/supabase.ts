
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
  
  // Creating a more comprehensive mock client that handles all the chaining methods used in our services
  // This mock follows the PostgrestBuilder pattern while returning empty data
  const createQueryBuilder = () => {
    const methods = {
      select: () => methods,
      insert: () => methods,
      update: () => methods,
      delete: () => methods,
      eq: () => methods,
      neq: () => methods,
      gt: () => methods,
      lt: () => methods,
      gte: () => methods,
      lte: () => methods,
      like: () => methods,
      ilike: () => methods,
      is: () => methods,
      in: () => methods,
      contains: () => methods,
      containedBy: () => methods,
      rangeLt: () => methods,
      rangeGt: () => methods,
      rangeGte: () => methods,
      rangeLte: () => methods,
      rangeAdjacent: () => methods,
      overlaps: () => methods,
      textSearch: () => methods,
      match: () => methods,
      not: () => methods,
      filter: () => methods,
      or: () => methods,
      and: () => methods,
      order: () => methods,
      limit: () => methods,
      range: () => methods,
      single: () => ({ data: null, error: null }),
      maybeSingle: () => ({ data: null, error: null }),
      csv: () => ({ data: '', error: null }),
      data: null,
      error: null
    };
    
    return methods;
  };
  
  // Return a mock client that implements all methods our services use
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
    from: () => createQueryBuilder()
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
