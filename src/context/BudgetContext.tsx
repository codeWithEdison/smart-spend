
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
export type TransactionType = 'income' | 'expense';

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

interface BudgetContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
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

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Calculate derived values
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedCategories = localStorage.getItem('categories');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Use sample data for demo
      setTransactions(sampleTransactions);
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Use default categories
      setCategories(defaultCategories);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Transaction CRUD operations
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Category CRUD operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => 
      prev.map(c => c.id === category.id ? category : c)
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const value = {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    totalIncome,
    totalExpenses,
    savingsRate
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
