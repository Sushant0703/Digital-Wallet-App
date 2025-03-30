import { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const TransferForm = () => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { transfer } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const { recipientEmail, amount, description } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Only allow numbers and decimal points for amount
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields
    if (!recipientEmail) {
      toast.error('Please enter a recipient email');
      return;
    }

    const transferAmount = Number.parseFloat(amount);

    if (Number.isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check if user has enough balance
    if (user && transferAmount > user.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSubmitting(true);

    try {
      await transfer(recipientEmail, transferAmount, description);
      toast.success('Transfer successful');

      // Clear form
      setFormData({
        recipientEmail: '',
        amount: '',
        description: '',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to process transfer';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Transfer Money</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              name="recipientEmail"
              id="recipientEmail"
              value={recipientEmail}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="example@email.com"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
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
                required
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="What's this transfer for?"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Send Money'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
