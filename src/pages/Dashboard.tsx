import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { Navigate } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import WalletCard from '../components/WalletCard';
import DepositForm from '../components/DepositForm';
import WithdrawForm from '../components/WithdrawForm';
import TransferForm from '../components/TransferForm';

const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const { fetchTransactions } = useContext(TransactionContext);
  const [activeTab, setActiveTab] = useState('deposit');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, fetchTransactions]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Fast Pay Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with wallet info */}
        <div className="md:col-span-1">
          {user && <WalletCard user={user} />}

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`py-2 px-4 rounded transition ${
                  activeTab === 'deposit'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Deposit Money
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`py-2 px-4 rounded transition ${
                  activeTab === 'withdraw'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Withdraw Money
              </button>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`py-2 px-4 rounded transition ${
                  activeTab === 'transfer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Transfer Money
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'deposit' && <DepositForm />}
            {activeTab === 'withdraw' && <WithdrawForm />}
            {activeTab === 'transfer' && <TransferForm />}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
