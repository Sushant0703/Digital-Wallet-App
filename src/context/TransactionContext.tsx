import { createContext, useState, useContext, type ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

interface Transaction {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (recipientEmail: string, amount: number, description: string) => Promise<void>;
}

const API_URL = 'http://localhost:5000/api';

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  isLoading: false,
  error: null,
  fetchTransactions: async () => {},
  deposit: async () => {},
  withdraw: async () => {},
  transfer: async () => {},
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useContext(AuthContext);

  // Fetch all transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/transactions`);
      setTransactions(res.data.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit money
  const deposit = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/transactions/deposit`, { amount });

      // Update the transactions list with the new transaction
      setTransactions([res.data.data, ...transactions]);

      // Update user's wallet balance
      if (user) {
        updateUser({
          ...user,
          walletBalance: user.walletBalance + amount,
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Deposit failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw money
  const withdraw = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/transactions/withdraw`, { amount });

      // Update the transactions list with the new transaction
      setTransactions([res.data.data, ...transactions]);

      // Update user's wallet balance
      if (user) {
        updateUser({
          ...user,
          walletBalance: user.walletBalance - amount,
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Withdrawal failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer money
  const transfer = async (recipientEmail: string, amount: number, description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/transactions/transfer`, {
        recipientEmail,
        amount,
        description,
      });

      // Update the transactions list with the new transaction
      setTransactions([res.data.data, ...transactions]);

      // Update user's wallet balance
      if (user) {
        updateUser({
          ...user,
          walletBalance: user.walletBalance - amount,
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Transfer failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchTransactions,
        deposit,
        withdraw,
        transfer,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
