
import React, { useState, useEffect } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBudget, Transaction, TransactionType } from '@/context/BudgetContext';
import { toast } from 'sonner';

interface TransactionFormProps {
  editTransaction?: Transaction;
  onComplete?: () => void;
}

// Define the form values type to match expected types
interface TransactionFormValues {
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: Date;
}

const TransactionForm = ({ editTransaction, onComplete }: TransactionFormProps) => {
  const [open, setOpen] = useState(false);
  const { categories, addTransaction, updateTransaction } = useBudget();
  
  // Create default values with the right types
  const defaultValues: TransactionFormValues = editTransaction 
    ? { 
        amount: editTransaction.amount,
        type: editTransaction.type,
        category: editTransaction.category,
        description: editTransaction.description,
        date: new Date(editTransaction.date)
      } 
    : {
        amount: 0,
        type: 'expense',
        category: '',
        description: '',
        date: new Date()
      };
    
  const form = useForm<TransactionFormValues>({
    defaultValues
  });
  
  const transactionType = form.watch('type');
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(c => c.type === transactionType);
  
  // Log to debug
  useEffect(() => {
    console.log('All categories:', categories);
    console.log('Filtered categories:', filteredCategories);
    console.log('Current transaction type:', transactionType);
  }, [categories, filteredCategories, transactionType]);
  
  const onSubmit = (data: TransactionFormValues) => {
    try {
      const transactionData = {
        ...data,
        date: data.date.toISOString(),
        amount: Number(data.amount)
      };
      
      if (editTransaction) {
        updateTransaction({
          ...transactionData,
          id: editTransaction.id
        });
        toast.success('Transaction updated successfully');
      } else {
        addTransaction(transactionData);
        toast.success('Transaction added successfully');
      }
      
      setOpen(false);
      // Reset with correct types
      form.reset(defaultValues);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error('Error saving transaction');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editTransaction ? (
          <Button variant="outline" size="sm">Edit</Button>
        ) : (
          <Button className="gap-1">
            <Plus size={16} />
            <span>Add Transaction</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories && filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button type="submit">
                {editTransaction ? 'Update' : 'Add'} Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
