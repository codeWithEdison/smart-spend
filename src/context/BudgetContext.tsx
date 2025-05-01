import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTransactions, addTransaction as apiAddTransaction, updateTransaction as apiUpdateTransaction, deleteTransaction as apiDeleteTransaction } from '@/services/transactionService';
import { fetchCategories, addCategory as apiAddCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from '@/services/categoryService';

// Define types
export type TransactionType = 'income' | 'expense';
export type LoanType = 'borrowed' | 'lent';
export type LoanStatus = 'active' | 'paid' | 'defaulted';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  type: TransactionType;
  color: string;
}

export interface Loan {
  id: string;
  amount: number;
  type: LoanType;
  personName: string;
  description: string;
  startDate: string;
  dueDate: string;
  interestRate: number;
  status: LoanStatus;
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note: string;
}

interface BudgetContextType {
  // Transactions
  transactions: Transaction[];
  isTransactionsLoading: boolean;
  categories: Category[];
  isCategoriesLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Categories
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Stats
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  
  // Loans
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'paymentHistory'>) => void;
  updateLoan: (loan: Loan) => void;
  deleteLoan: (id: string) => void;
  addPaymentToLoan: (loanId: string, payment: Omit<Payment, 'id'>) => void;
  totalBorrowed: number;
  totalLent: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Default categories with colors
const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', budget: 5000, type: 'income', color: '#4ade80' },
  { id: '2', name: 'Groceries', budget: 500, type: 'expense', color: '#f87171' },
  { id: '3', name: 'Rent', budget: 1200, type: 'expense', color: '#fb923c' },
  { id: '4', name: 'Utilities', budget: 200, type: 'expense', color: '#60a5fa' },
  { id: '5', name: 'Entertainment', budget: 300, type: 'expense', color: '#c084fc' },
  { id: '6', name: 'Transportation', budget: 150, type: 'expense', color: '#34d399' },
  { id: '7', name: 'Shopping', budget: 400, type: 'expense', color: '#a3e635' },
  { id: '8', name: 'Health', budget: 100, type: 'expense', color: '#e879f9' }
];

// Sample transactions for demo
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date(2023, 3, 1).toISOString()
  },
  {
    id: '2',
    amount: 50,
    type: 'expense',
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: new Date(2023, 3, 5).toISOString()
  },
  {
    id: '3',
    amount: 1200,
    type: 'expense',
    category: 'Rent',
    description: 'Monthly rent',
    date: new Date(2023, 3, 2).toISOString()
  },
  {
    id: '4',
    amount: 35,
    type: 'expense',
    category: 'Entertainment',
    description: 'Movie tickets',
    date: new Date(2023, 3, 10).toISOString()
  },
  {
    id: '5',
    amount: 20,
    type: 'expense',
    category: 'Transportation',
    description: 'Uber ride',
    date: new Date(2023, 3, 8).toISOString()
  }
];

// Sample loans for demo
const sampleLoans: Loan[] = [
  {
    id: '1',
    amount: 1000,
    type: 'borrowed',
    personName: 'Alex Brown',
    description: 'Emergency car repair',
    startDate: new Date(2023, 2, 15).toISOString(),
    dueDate: new Date(2023, 5, 15).toISOString(),
    interestRate: 5,
    status: 'active',
    paymentHistory: [
      {
        id: '1',
        amount: 200,
        date: new Date(2023, 3, 15).toISOString(),
        note: 'First payment'
      }
    ]
  },
  {
    id: '2',
    amount: 500,
    type: 'lent',
    personName: 'Jamie Smith',
    description: 'Home improvement project',
    startDate: new Date(2023, 1, 10).toISOString(),
    dueDate: new Date(2023, 4, 10).toISOString(),
    interestRate: 0,
    status: 'active',
    paymentHistory: []
  }
];

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Transactions query
  const { 
    data: transactions = [],
    isLoading: isTransactionsLoading
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Categories query
  const {
    data: categories = [],
    isLoading: isCategoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: apiAddTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
  
  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: apiUpdateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
  
  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: apiDeleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: apiAddCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
  
  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: apiUpdateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: apiDeleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
  
  // For now, we'll keep loans in local state until we implement loan services
  const [loans, setLoans] = React.useState<Loan[]>([]);
  
  // Calculate derived values for transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;
  
  // Calculate derived values for loans
  const totalBorrowed = loans
    .filter(loan => loan.type === 'borrowed' && loan.status === 'active')
    .reduce((sum, loan) => {
      const paidAmount = loan.paymentHistory.reduce((total, payment) => total + payment.amount, 0);
      return sum + (loan.amount - paidAmount);
    }, 0);
    
  const totalLent = loans
    .filter(loan => loan.type === 'lent' && loan.status === 'active')
    .reduce((sum, loan) => {
      const paidAmount = loan.paymentHistory.reduce((total, payment) => total + payment.amount, 0);
      return sum + (loan.amount - paidAmount);
    }, 0);

  // Transaction CRUD operations
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addTransactionMutation.mutateAsync(transaction);
  };

  const updateTransaction = async (transaction: Transaction) => {
    await updateTransactionMutation.mutateAsync(transaction);
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionMutation.mutateAsync(id);
  };

  // Category CRUD operations
  const addCategory = async (category: Omit<Category, 'id'>) => {
    await addCategoryMutation.mutateAsync(category);
  };

  const updateCategory = async (category: Category) => {
    await updateCategoryMutation.mutateAsync(category);
  };

  const deleteCategory = async (id: string) => {
    await deleteCategoryMutation.mutateAsync(id);
  };
  
  // Loan CRUD operations
  const addLoan = (loan: Omit<Loan, 'id' | 'paymentHistory'>) => {
    const newLoan = {
      ...loan,
      id: Date.now().toString(),
      paymentHistory: []
    };
    setLoans(prev => [...prev, newLoan]);
  };

  const updateLoan = (loan: Loan) => {
    setLoans(prev => 
      prev.map(l => l.id === loan.id ? loan : l)
    );
  };

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };
  
  const addPaymentToLoan = (loanId: string, payment: Omit<Payment, 'id'>) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString()
    };
    
    setLoans(prev => 
      prev.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            paymentHistory: [...loan.paymentHistory, newPayment]
          };
        }
        return loan;
      })
    );
  };

  const value = {
    transactions,
    isTransactionsLoading,
    categories,
    isCategoriesLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addLoan,
    updateLoan,
    deleteLoan,
    addPaymentToLoan,
    totalIncome,
    totalExpenses,
    savingsRate,
    totalBorrowed,
    totalLent,
    loans
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
