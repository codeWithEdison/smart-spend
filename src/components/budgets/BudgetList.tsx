
import React, { useState } from 'react';
import { useBudget, Category } from '@/context/BudgetContext';
import { getBudgetPercentage, formatCurrency } from '@/utils/budgetUtils';
import { Progress } from '@/components/ui/progress';
import { Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BudgetForm from './BudgetForm';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const BudgetList = () => {
  const { categories, transactions, deleteCategory } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Split categories by type
  const incomeCategories = filteredCategories.filter(c => c.type === 'income');
  const expenseCategories = filteredCategories.filter(c => c.type === 'expense');
  
  const handleDelete = (category: Category) => {
    deleteCategory(category.id);
    toast.success('Budget category deleted successfully');
  };
  
  const getBudgetColorClass = (percentage: number) => {
    if (percentage < 70) return 'bg-budget-income';
    if (percentage < 90) return 'bg-yellow-400';
    return 'bg-budget-expense';
  };
  
  const renderCategoryList = (categories: Category[]) => (
    <div className="space-y-4">
      {categories.length > 0 ? (
        categories.map((category) => {
          const percentage = getBudgetPercentage(category, transactions);
          const colorClass = getBudgetColorClass(percentage);
          
          return (
            <Card key={category.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="h-4 w-4 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(category.budget)}
                  </span>
                  <div className="flex space-x-1">
                    <BudgetForm editCategory={category} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Budget Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this budget category? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(category)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {percentage}% used
                  </span>
                  <span>
                    {formatCurrency(category.budget * percentage / 100)} / {formatCurrency(category.budget)}
                  </span>
                </div>
                <Progress value={percentage} className={`h-2 ${colorClass}`} />
              </div>
            </Card>
          );
        })
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No budget categories found</p>
          <BudgetForm />
        </div>
      )}
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search budget categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <BudgetForm />
      </div>
      
      <Tabs defaultValue="expense">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expense">
          {renderCategoryList(expenseCategories)}
        </TabsContent>
        
        <TabsContent value="income">
          {renderCategoryList(incomeCategories)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetList;
