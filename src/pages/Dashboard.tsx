
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useBudget } from '@/context/BudgetContext';
import StatCard from '@/components/dashboard/StatCard';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/utils/budgetUtils';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import DashboardStats from '@/components/dashboard/DashboardStats';

const Dashboard = () => {
  const { 
    transactions, 
    categories, 
    totalIncome, 
    totalExpenses, 
    savingsRate
  } = useBudget();
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    if (!startDate) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (endDate) {
        // Set end date to end of day for inclusive range
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return transactionDate >= startDate && transactionDate <= endOfDay;
      }
      return transactionDate >= startDate;
    });
  }, [transactions, startDate, endDate]);
  
  // Get comparison data from previous period
  const comparisonData = useMemo(() => {
    if (!startDate) return undefined;
    
    const currentPeriodLength = endDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) 
      : 30; // Default to 30 days if only start date
    
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - currentPeriodLength);
    
    const previousPeriodEnd = new Date(startDate);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
    
    const previousTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= previousPeriodStart && transactionDate <= previousPeriodEnd;
    });
    
    const previousIncome = previousTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const previousExpenses = previousTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { previousIncome, previousExpenses };
  }, [transactions, startDate, endDate]);
  
  // Top expense categories for progress bars
  const topExpenseCategories = useMemo(() => {
    return [...categories]
      .filter(c => c.type === 'expense')
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 4);
  }, [categories]);
  
  // Handle date range change
  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        </div>

        {/* Enhanced Stats */}
        <DashboardStats 
          transactions={filteredTransactions} 
          comparisonData={comparisonData}
        />

        {/* Legacy Stats Overview - can be removed if you prefer the new stats */}
        {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<Wallet size={18} />}
            className="border-l-4 border-budget-income"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<TrendingDown size={18} />}
            className="border-l-4 border-budget-expense"
          />
          <StatCard
            title="Net Balance"
            value={formatCurrency(totalIncome - totalExpenses)}
            icon={<TrendingUp size={18} />}
            className="border-l-4 border-primary"
          />
          <StatCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            description="of income saved"
            icon={<PiggyBank size={18} />}
            className="border-l-4 border-budget-saving"
          />
        </div> */}

        {/* Main Dashboard Content */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Expense Categories</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {topExpenseCategories.map(category => (
                <BudgetProgress 
                  key={category.id}
                  category={category}
                  transactions={filteredTransactions}
                />
              ))}
            </div>
            
            <ExpensePieChart 
              transactions={filteredTransactions}
              categories={categories}
            />
          </div>
          
          <div className="lg:col-span-1">
            <RecentTransactions transactions={filteredTransactions} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
