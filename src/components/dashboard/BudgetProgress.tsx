
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getBudgetProgressColor } from '@/utils/budgetUtils';
import { Category, Transaction } from '@/context/BudgetContext';

interface BudgetProgressProps {
  category: Category;
  transactions: Transaction[];
}

const BudgetProgress = ({ category, transactions }: BudgetProgressProps) => {
  // Calculate how much has been spent in this category
  const spent = transactions
    .filter(t => t.category === category.name && t.type === category.type)
    .reduce((sum, t) => sum + t.amount, 0);
    
  // Calculate percentage of budget used
  const percentage = category.budget > 0 
    ? Math.min(Math.round((spent / category.budget) * 100), 100) 
    : 0;
    
  // Determine color based on percentage
  const progressColor = getBudgetProgressColor(percentage);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {category.name}
          </CardTitle>
          <span 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(spent)} spent
            </span>
            <span className="font-medium">
              {formatCurrency(category.budget)} budgeted
            </span>
          </div>
          <Progress 
            value={percentage} 
            className={`h-2 ${progressColor}`} 
          />
          <div className="text-xs text-right text-muted-foreground">
            {percentage}% used
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
