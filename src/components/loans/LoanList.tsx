
import React, { useState } from 'react';
import { useBudget, Loan, LoanType } from '@/context/BudgetContext';
import { Search, Trash2, CreditCard, PiggyBank, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import LoanForm from './LoanForm';
import LoanCard from './LoanCard';
import { formatCurrency } from '@/utils/budgetUtils';

const LoanList = () => {
  const { loans, deleteLoan, totalBorrowed, totalLent } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<LoanType>('borrowed');
  
  // Filter loans based on search term and active tab
  const filteredLoans = loans.filter(loan => 
    (loan.type === activeTab) &&
    (loan.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatCurrency(loan.amount).includes(searchTerm))
  );
  
  // Sort loans by start date (most recent first)
  const sortedLoans = [...filteredLoans].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const handleDelete = (loan: Loan) => {
    deleteLoan(loan.id);
    toast.success('Loan deleted successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Borrowed
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBorrowed)}</div>
            <p className="text-xs text-muted-foreground">
              Amount you owe to others
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lent
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLent)}</div>
            <p className="text-xs text-muted-foreground">
              Amount others owe you
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search loans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <LoanForm />
      </div>
      
      <Tabs defaultValue="borrowed" onValueChange={(value) => setActiveTab(value as LoanType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
          <TabsTrigger value="lent">Lent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="borrowed" className="mt-4">
          {sortedLoans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedLoans.map((loan) => (
                <LoanCard 
                  key={loan.id} 
                  loan={loan} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border shadow-sm p-8 text-center">
              <p className="text-muted-foreground mb-4">No borrowed loans found</p>
              <LoanForm initialType="borrowed" />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="lent" className="mt-4">
          {sortedLoans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedLoans.map((loan) => (
                <LoanCard 
                  key={loan.id} 
                  loan={loan} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border shadow-sm p-8 text-center">
              <p className="text-muted-foreground mb-4">No lent loans found</p>
              <LoanForm initialType="lent" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanList;
