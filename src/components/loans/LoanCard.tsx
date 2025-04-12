
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { CreditCard, PiggyBank, Trash2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/budgetUtils';
import { Loan } from '@/context/BudgetContext';
import LoanForm from './LoanForm';
import PaymentForm from './PaymentForm';

interface LoanCardProps {
  loan: Loan;
  onDelete: (loan: Loan) => void;
}

const LoanCard = ({ loan, onDelete }: LoanCardProps) => {
  const totalPaid = loan.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = loan.amount - totalPaid;
  const progressPercentage = (totalPaid / loan.amount) * 100;
  
  // Calculate days until due
  const dueDate = new Date(loan.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {loan.type === 'borrowed' ? (
                <CreditCard className="h-4 w-4" />
              ) : (
                <PiggyBank className="h-4 w-4" />
              )}
              {loan.personName}
            </CardTitle>
            <CardDescription>{loan.description}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            loan.status === 'active' 
              ? 'bg-yellow-100 text-yellow-800' 
              : loan.status === 'paid' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatCurrency(loan.amount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium">{formatCurrency(remainingAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground">Interest Rate</span>
              <span className="font-medium">{loan.interestRate}%</span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2" 
            />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>0%</span>
              <span>{Math.round(progressPercentage)}% paid</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due: {formatDate(loan.dueDate)}</span>
            </div>
            {daysUntilDue > 0 && loan.status === 'active' && (
              <span className={`text-xs ${
                daysUntilDue <= 7 ? 'text-red-500' : daysUntilDue <= 30 ? 'text-yellow-600' : 'text-muted-foreground'
              }`}>
                {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'} left
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-2">
        <div className="flex gap-1 flex-grow">
          <LoanForm editLoan={loan} />
          <PaymentForm loanId={loan.id} remainingAmount={remainingAmount} />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Loan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this loan? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(loan)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default LoanCard;
