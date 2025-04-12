
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TrendingUp, Edit, Trash2, Target, Calendar, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: ''
    }
  });
  
  const openCreateDialog = () => {
    form.reset({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: ''
    });
    setEditingGoal(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (goal: SavingsGoal) => {
    form.reset({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
    });
    setEditingGoal(goal);
    setDialogOpen(true);
  };
  
  const saveGoal = (data: Omit<SavingsGoal, 'id'>) => {
    try {
      if (editingGoal) {
        // Update existing goal
        const updatedGoals = goals.map(g => 
          g.id === editingGoal.id ? { ...data, id: editingGoal.id } : g
        );
        setGoals(updatedGoals);
        localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
        toast.success('Goal updated successfully');
      } else {
        // Create new goal
        const newGoal = {
          ...data,
          id: crypto.randomUUID()
        };
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
        toast.success('Goal created successfully');
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };
  
  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(g => g.id !== id);
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      toast.success('Goal deleted');
    }
  };
  
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>
          <Button onClick={openCreateDialog}>
            <TrendingUp className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>
        
        {goals.length === 0 ? (
          <Card className="bg-card border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">No Goals Yet</CardTitle>
              <CardDescription>
                Create your first savings goal to start tracking your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-center py-8">
                <Target size={48} className="text-muted-foreground" />
              </div>
              <Button onClick={openCreateDialog} className="w-full">
                Create Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => (
              <Card key={goal.id} className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {goal.name}
                    <div className="space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Target: {formatCurrency(goal.targetAmount)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Progress:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress value={calculateProgress(goal.currentAmount, goal.targetAmount)} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="font-medium">
                      {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => openEditDialog(goal)}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Update Progress
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? 'Update your savings goal details or progress' 
                : 'Set a new financial goal to track your savings progress'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveGoal)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Vacation Fund" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="1000"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Goals;
