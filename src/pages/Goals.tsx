
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const Goals = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Coming Soon</CardTitle>
              <CardDescription>
                Savings goals will be available in a future update
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-center py-8">
                <TrendingUp size={48} className="text-muted-foreground" />
              </div>
              <Button disabled className="w-full">
                Create Goal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Goals;
