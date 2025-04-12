
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/utils/budgetUtils';

const Reports = () => {
  const { transactions, categories } = useBudget();
  
  // Prepare data for category breakdown chart
  const categoryData = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const spent = transactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        name: category.name,
        amount: spent,
        color: category.color
      };
    })
    .sort((a, b) => b.amount - a.amount);
    
  // Monthly spending data
  const monthlyData = (() => {
    const now = new Date();
    const data = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const income = transactions
        .filter(t => {
          const date = new Date(t.date);
          return (
            date.getMonth() === month.getMonth() &&
            date.getFullYear() === month.getFullYear() &&
            t.type === 'income'
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = transactions
        .filter(t => {
          const date = new Date(t.date);
          return (
            date.getMonth() === month.getMonth() &&
            date.getFullYear() === month.getFullYear() &&
            t.type === 'expense'
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
        
      data.push({
        name: monthName,
        income,
        expense,
        savings: income - expense
      });
    }
    
    return data;
  })();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, undefined]}
                    />
                    <Bar 
                      dataKey="income" 
                      fill="#4ade80" 
                      name="Income" 
                    />
                    <Bar 
                      dataKey="expense" 
                      fill="#f87171" 
                      name="Expenses" 
                    />
                    <Bar 
                      dataKey="savings" 
                      fill="#60a5fa" 
                      name="Savings" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => {
                        // Type guard to ensure percent is treated as a number
                        const percentage = typeof percent === 'number' 
                          ? (percent * 100).toFixed(0) 
                          : '0';
                        return `${name} (${percentage}%)`;
                      }}
                      labelLine
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => {
                        return [formatCurrency(typeof value === 'number' ? value : 0), 'Amount'];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
