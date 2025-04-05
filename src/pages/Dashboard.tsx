
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import Navbar from "@/components/Navbar";
import UserInfoCard from "@/components/UserInfoCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionHistory from "@/components/TransactionHistory";
import TransactionGraph from "@/components/TransactionGraph";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { transactions, sendMoney } = useTransactions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  // Prepare transaction graph data from transaction history
  const graphData = transactions.reduce((acc, transaction, index) => {
    const date = new Date(transaction.timestamp).toLocaleDateString();
    const existingDay = acc.find(item => item.name === date);
    
    const transactionAmount = transaction.type === "received" 
      ? transaction.amount 
      : -transaction.amount;
    
    if (existingDay) {
      existingDay.amount += transactionAmount;
    } else {
      acc.push({
        name: date,
        amount: transactionAmount
      });
    }
    
    return acc;
  }, [] as { name: string; amount: number }[]);

  // Sort the graph data by date
  graphData.sort((a, b) => {
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <UserInfoCard 
                email={user.email} 
                upiId={user.upiId} 
                balance={user.balance} 
              />
              <TransactionForm 
                onSendMoney={sendMoney} 
                balance={user.balance} 
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <TransactionHistory transactions={transactions} />
            <TransactionGraph data={graphData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
