
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Category } from '@/context/BudgetContext';
import { getTransactionsByCategory } from '@/utils/budgetUtils';

interface ExpensePieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

const ExpensePieChart = ({ transactions, categories }: ExpensePieChartProps) => {
  const expensesByCategory = useMemo(() => {
    const grouped = getTransactionsByCategory(transactions, 'expense');
    
    // Convert to format needed for recharts
    return Object.entries(grouped)
      .map(([name, value]) => {
        // Find category to get its color
        const category = categories.find(c => c.name === name);
        return {
          name,
          value,
          color: category?.color || '#CBD5E1' // Default color if not found
        };
      })
      .sort((a, b) => b.value - a.value); // Sort descending by value
  }, [transactions, categories]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
