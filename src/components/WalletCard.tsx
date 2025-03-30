interface WalletCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
  };
}

const WalletCard = ({ user }: WalletCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Wallet Balance</h2>
            <p className="text-blue-100 text-sm">Available funds</p>
          </div>
          <div className="rounded-full bg-white p-3">
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-white">{formatCurrency(user.walletBalance)}</h3>
        </div>
      </div>
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-800">{user.name}</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
