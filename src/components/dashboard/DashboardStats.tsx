
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/context/BudgetContext';
import { formatCurrency } from '@/utils/budgetUtils';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
  comparisonData?: {
    previousIncome: number;
    previousExpenses: number;
  };
}

const DashboardStats = ({ transactions, comparisonData }: DashboardStatsProps) => {
  // Calculate current period stats
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  
  // Calculate comparison with previous period if data is available
  const incomeChange = comparisonData && comparisonData.previousIncome > 0
    ? ((income - comparisonData.previousIncome) / comparisonData.previousIncome) * 100
    : 0;
    
  const expensesChange = comparisonData && comparisonData.previousExpenses > 0
    ? ((expenses - comparisonData.previousExpenses) / comparisonData.previousExpenses) * 100
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="overflow-hidden animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(income)}</div>
          {comparisonData && (
            <div className="mt-2 flex items-center text-sm">
              {incomeChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={incomeChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(Math.round(incomeChange))}% 
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
          {comparisonData && (
            <div className="mt-2 flex items-center text-sm">
              {expensesChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              )}
              <span className={expensesChange > 0 ? "text-red-500" : "text-green-500"}>
                {Math.abs(Math.round(expensesChange))}% 
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <div className="mt-2 flex items-center">
            {balance >= 0 ? (
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={balance >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
              {balance >= 0 ? "Positive" : "Negative"} balance
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate}%</div>
          <Progress 
            value={savingsRate} 
            className="h-2 mt-2" 
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {savingsRate >= 20 
              ? "Great savings rate!" 
              : savingsRate > 0 
                ? "Room for improvement" 
                : "No savings this period"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
