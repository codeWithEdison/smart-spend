
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useBudget, Category, TransactionType } from '@/context/BudgetContext';
import { toast } from 'sonner';

interface BudgetFormProps {
  editCategory?: Category;
  onComplete?: () => void;
}

const BudgetForm = ({ editCategory, onComplete }: BudgetFormProps) => {
  const [open, setOpen] = useState(false);
  const { addCategory, updateCategory } = useBudget();
  
  // Sample color options
  const colorOptions = [
    { value: '#f87171', label: 'Red' },
    { value: '#fb923c', label: 'Orange' },
    { value: '#facc15', label: 'Yellow' },
    { value: '#4ade80', label: 'Green' },
    { value: '#60a5fa', label: 'Blue' },
    { value: '#a78bfa', label: 'Purple' },
    { value: '#e879f9', label: 'Pink' },
    { value: '#94a3b8', label: 'Gray' }
  ];
  
  const defaultValues = editCategory 
    ? { ...editCategory } 
    : {
        name: '',
        budget: 0,
        type: 'expense' as TransactionType,
        color: colorOptions[0].value
      };
    
  const form = useForm<Omit<Category, 'id'>>({
    defaultValues
  });
  
  const onSubmit = (data: Omit<Category, 'id'>) => {
    try {
      const categoryData = {
        ...data,
        budget: Number(data.budget)
      };
      
      if (editCategory) {
        updateCategory({
          ...categoryData,
          id: editCategory.id
        });
        toast.success('Budget category updated successfully');
      } else {
        addCategory(categoryData);
        toast.success('Budget category added successfully');
      }
      
      setOpen(false);
      form.reset(defaultValues);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error('Error saving budget category');
      console.error(error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editCategory ? (
          <Button variant="outline" size="sm">Edit</Button>
        ) : (
          <Button className="gap-1">
            <Plus size={16} />
            <span>Add Budget Category</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editCategory ? 'Edit Budget Category' : 'Add New Budget Category'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center">
                            <div 
                              className="h-4 w-4 rounded-full mr-2"
                              style={{ backgroundColor: field.value }}
                            />
                            <span>
                              {colorOptions.find(c => c.value === field.value)?.label || 'Select color'}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div 
                              className="h-4 w-4 rounded-full mr-2"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button type="submit">
                {editCategory ? 'Update' : 'Add'} Budget
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
