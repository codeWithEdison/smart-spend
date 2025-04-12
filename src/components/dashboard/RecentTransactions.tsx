
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Transaction } from '@/context/BudgetContext';
import { formatCurrency, formatDate, getTransactionColor } from '@/utils/budgetUtils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  
  // Get 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Button 
          variant="link" 
          onClick={() => navigate('/transactions')}
          className="text-primary"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <div className={`rounded-full p-2 mr-3 ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
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
                <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'income' ? '+' : '-'} 
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
