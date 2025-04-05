
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";

interface TransactionFormProps {
  onSendMoney: (receiverId: string, amount: number) => Promise<void>;
  balance: number;
}

const TransactionForm = ({ onSendMoney, balance }: TransactionFormProps) => {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateUpiId = (upiId: string) => {
    // Basic validation for UPI ID (should contain @)
    return upiId.includes('@');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!receiverId || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate UPI ID format
    if (!validateUpiId(receiverId)) {
      toast({
        title: "Error",
        description: "Please enter a valid UPI ID (should contain @)",
        variant: "destructive",
      });
      return;
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount (greater than 0)",
        variant: "destructive",
      });
      return;
    }

    // Validate amount does not exceed balance
    if (amountNum > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Sending money:", receiverId, amountNum);
      await onSendMoney(receiverId, amountNum);
      
      // Clear form after successful transaction
      setReceiverId("");
      setAmount("");
      
      toast({
        title: "Success",
        description: `₹${amountNum} sent successfully to ${receiverId}`,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      // Error is already shown by the useTransactions hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-b">
        <CardTitle className="text-purple-700 dark:text-purple-300">Initiate Transaction</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="receiverId" className="block text-sm font-medium">
              Receiver UPI ID
            </label>
            <Input
              id="receiverId"
              placeholder="example@fastpay"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              className="border-purple-200 focus:border-purple-400"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">Available balance: ₹{balance}</p>
          </div>
          <Button 
            type="submit" 
            className="w-full group bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Money <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
