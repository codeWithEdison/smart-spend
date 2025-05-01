
import React, { useState } from 'react';
import { useBudget, Transaction } from '@/context/BudgetContext';
import { formatCurrency, formatDate, getTransactionIconClass } from '@/utils/budgetUtils';
import { ArrowDownRight, ArrowUpRight, Search, Trash2, Loader2 } from 'lucide-react';
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
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const { transactions, isTransactionsLoading, deleteTransaction } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatCurrency(transaction.amount).includes(searchTerm)
  );
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleDelete = async (transaction: Transaction) => {
    try {
      await deleteTransaction(transaction.id);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Error deleting transaction');
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TransactionForm />
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        {isTransactionsLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        ) : sortedTransactions.length > 0 ? (
          <div className="divide-y">
            {sortedTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`rounded-full p-2 mr-3 ${getTransactionIconClass(transaction.type)}`}>
                    {transaction.type === 'income' 
                      ? <ArrowUpRight size={16} /> 
                      : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-budget-income' : 'text-budget-expense'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} 
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex space-x-1">
                    <TransactionForm editTransaction={transaction} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(transaction)}
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
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No transactions found</p>
            <TransactionForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
