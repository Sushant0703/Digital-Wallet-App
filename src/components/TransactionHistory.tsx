
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface Transaction {
  id: string;
  senderUpiId: string;
  receiverUpiId: string;
  amount: number;
  timestamp: string;
  type: "sent" | "received";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardTitle className="text-purple-700 dark:text-purple-300">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 dark:bg-purple-950">
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-purple-50 dark:hover:bg-purple-950/50">
                  <TableCell>
                    {transaction.type === "sent" ? (
                      <div className="flex items-center gap-1">
                        <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 font-medium">Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">Received</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{transaction.senderUpiId}</TableCell>
                  <TableCell className="text-sm font-medium">{transaction.receiverUpiId}</TableCell>
                  <TableCell 
                    className={
                      transaction.type === "sent" 
                        ? "text-red-500 font-mono font-medium" 
                        : "text-green-500 font-mono font-medium"
                    }
                  >
                    {transaction.type === "sent" ? "-" : "+"}
                    ₹{transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
