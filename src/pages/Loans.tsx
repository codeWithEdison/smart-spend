
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoanList from '@/components/loans/LoanList';

const Loans = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Loan Management</h1>
        </div>
        
        <LoanList />
      </div>
    </Layout>
  );
};

export default Loans;
