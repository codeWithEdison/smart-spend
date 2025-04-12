
import React from 'react';
import Layout from '@/components/layout/Layout';
import BudgetList from '@/components/budgets/BudgetList';

const Budgets = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Budget Categories</h1>
        </div>
        
        <BudgetList />
      </div>
    </Layout>
  );
};

export default Budgets;
