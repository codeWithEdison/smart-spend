
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useBudget } from '@/context/BudgetContext';
import StatCard from '@/components/dashboard/StatCard';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/utils/budgetUtils';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

const Dashboard = () => {
  const { 
    transactions, 
    categories, 
    totalIncome, 
    totalExpenses, 
    savingsRate
  } = useBudget();
  
  // Top expense categories for progress bars
  const topExpenseCategories = [...categories]
    .filter(c => c.type === 'expense')
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 4);
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Expense Categories</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {topExpenseCategories.map(category => (
                <BudgetProgress 
                  key={category.id}
                  category={category}
                  transactions={transactions}
                />
              ))}
            </div>
            
            <ExpensePieChart 
              transactions={transactions}
              categories={categories}
            />
          </div>
          
          <div className="lg:col-span-1">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
