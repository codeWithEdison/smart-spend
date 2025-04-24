import { Transaction, Category, TransactionType } from '../context/BudgetContext';

// Format currency amount
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get percentage of budget used
export const getBudgetPercentage = (
  category: Category,
  transactions: Transaction[]
): number => {
  const totalSpent = transactions
    .filter(t => t.category === category.name && t.type === category.type)
    .reduce((sum, t) => sum + t.amount, 0);
    
  if (category.budget <= 0) return 0;
  
  return Math.min(Math.round((totalSpent / category.budget) * 100), 100);
};

// Get transactions grouped by category
export const getTransactionsByCategory = (
  transactions: Transaction[],
  type: TransactionType
): Record<string, number> => {
  const result: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === type)
    .forEach(t => {
      if (result[t.category]) {
        result[t.category] += t.amount;
      } else {
        result[t.category] = t.amount;
      }
    });
    
  return result;
};

// Calculate remaining budget for a category
export const getRemainingBudget = (
  category: Category,
  transactions: Transaction[]
): number => {
  if (category.type === 'income') return category.budget;
  
  const spent = transactions
    .filter(t => t.category === category.name && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return Math.max(category.budget - spent, 0);
};

// Get color for budget progress based on percentage
export const getBudgetProgressColor = (percentage: number): string => {
  if (percentage < 70) return 'bg-budget-income';
  if (percentage < 90) return 'bg-yellow-400';
  return 'bg-budget-expense';
};

// Get color based on transaction type
export const getTransactionColor = (type: TransactionType): string => {
  return type === 'income' ? 'text-budget-income' : 'text-budget-expense';
};

// Get icon class based on transaction type
export const getTransactionIconClass = (type: TransactionType): string => {
  return type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
};

// Filter transactions by search term
export const filterTransactions = (
  transactions: Transaction[],
  searchTerm: string
): Transaction[] => {
  if (!searchTerm) return transactions;
  
  const term = searchTerm.toLowerCase();
  
  return transactions.filter(
    t =>
      t.description.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      formatCurrency(t.amount).includes(term)
  );
};

// Sort transactions by date (newest first)
export const sortTransactionsByDate = (
  transactions: Transaction[]
): Transaction[] => {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get current month's transactions
export const getCurrentMonthTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
};

// Get transactions by date range
export const getTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate?: Date
): Transaction[] => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    if (endDate) {
      // Set end date to end of day for inclusive range
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      return transactionDate >= startDate && transactionDate <= endOfDay;
    }
    return transactionDate >= startDate;
  });
};

// Format date range for display
export const formatDateRange = (startDate: Date, endDate?: Date): string => {
  const start = formatDate(startDate.toISOString());
  if (!endDate) return `From ${start}`;
  
  const end = formatDate(endDate.toISOString());
  return `${start} - ${end}`;
};
