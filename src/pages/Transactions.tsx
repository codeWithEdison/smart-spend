
import React from 'react';
import Layout from '@/components/layout/Layout';
import TransactionList from '@/components/transactions/TransactionList';

const Transactions = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        
        <TransactionList />
      </div>
    </Layout>
  );
};

export default Transactions;
