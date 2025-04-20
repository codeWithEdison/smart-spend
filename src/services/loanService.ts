
import { supabase } from '@/lib/supabase';
import { Loan, Payment } from '@/context/BudgetContext';

// Fetch loans for current user
export const fetchLoans = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    // First fetch all loans
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', user.user.id)
      .order('start_date', { ascending: false });

    if (loansError) throw loansError;
    
    if (!loans || loans.length === 0) {
      return [] as Loan[];
    }
    
    // Then fetch all payments for these loans
    const loanIds = loans.map(loan => loan.id);
    
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .in('loan_id', loanIds)
      .order('date', { ascending: false });
      
    if (paymentsError) throw paymentsError;
    
    // Combine loans with their payments
    const loansWithPayments = loans.map(loan => {
      const loanPayments = (payments || []).filter(payment => payment.loan_id === loan.id);
      return {
        ...loan,
        paymentHistory: loanPayments as unknown as Payment[]
      };
    });
    
    return loansWithPayments as unknown as Loan[];
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

// Add new loan
export const addLoan = async (loan: Omit<Loan, 'id' | 'paymentHistory'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('loans')
      .insert([{ 
        ...loan, 
        user_id: user.user.id,
        // Convert snake_case to camelCase for database
        person_name: loan.personName,
        start_date: loan.startDate,
        due_date: loan.dueDate,
        interest_rate: loan.interestRate
      }])
      .select()
      .single();

    if (error) throw error;
    
    return { ...data, paymentHistory: [] } as unknown as Loan;
  } catch (error) {
    console.error('Error adding loan:', error);
    throw error;
  }
};

// Update loan
export const updateLoan = async (loan: Loan) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('loans')
      .update({
        amount: loan.amount,
        type: loan.type,
        person_name: loan.personName,
        description: loan.description,
        start_date: loan.startDate,
        due_date: loan.dueDate,
        interest_rate: loan.interestRate,
        status: loan.status
      })
      .eq('id', loan.id)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    
    return { ...data, paymentHistory: loan.paymentHistory } as unknown as Loan;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

// Delete loan
export const deleteLoan = async (id: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    // First delete all payments associated with this loan
    const { error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq('loan_id', id);
      
    if (paymentsError) throw paymentsError;

    // Then delete the loan
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
};

// Add payment to loan
export const addPaymentToLoan = async (loanId: string, payment: Omit<Payment, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{ ...payment, loan_id: loanId }])
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Payment;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};
