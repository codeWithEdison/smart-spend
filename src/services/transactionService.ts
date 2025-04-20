
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/context/BudgetContext';

// Fetch transactions for current user
export const fetchTransactions = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    
    return data as unknown as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Add new transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Transaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (transaction: Transaction) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', transaction.id)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (id: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
