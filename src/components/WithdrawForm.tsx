import { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const WithdrawForm = () => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { withdraw } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate amount
    const withdrawAmount = Number.parseFloat(amount);

    if (Number.isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (user && withdrawAmount > user.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSubmitting(true);

    try {
      await withdraw(withdrawAmount);
      toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)}`);
      setAmount(''); // Reset form
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to process withdrawal';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Withdraw Money</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Withdraw
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="amount"
              id="amount"
              value={amount}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
              aria-describedby="amount-currency"
              disabled={isSubmitting}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="amount-currency">
                USD
              </span>
            </div>
          </div>
          {user && (
            <p className="mt-2 text-sm text-gray-500">
              Available balance: ${user.walletBalance.toFixed(2)}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Withdraw Funds'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
