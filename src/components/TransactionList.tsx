import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';

const TransactionList = () => {
  const { transactions, isLoading, error } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer':
        return 'Transfer';
      default:
        return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <div className="p-2 rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="p-2 rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case 'transfer':
        return (
          <div className="p-2 rounded-full bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100">
            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="py-4 flex items-center">
          {getTransactionIcon(transaction.type)}
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {getTransactionTypeLabel(transaction.type)}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.type === 'deposit'
                    ? 'text-green-600'
                    : transaction.type === 'withdrawal'
                      ? 'text-red-600'
                      : transaction.sender._id === user?.id
                        ? 'text-red-600'
                        : 'text-green-600'
                }`}>
                  {transaction.type === 'deposit'
                    ? '+'
                    : transaction.type === 'withdrawal'
                      ? '-'
                      : transaction.sender._id === user?.id
                        ? '-'
                        : '+'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.type === 'transfer' && (
                  <p className="text-xs text-gray-500">
                    {transaction.sender._id === user?.id
                      ? `To: ${transaction.recipient.email}`
                      : `From: ${transaction.sender.email}`}
                  </p>
                )}
              </div>
            </div>
            {transaction.description && (
              <p className="mt-1 text-xs text-gray-500">{transaction.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
