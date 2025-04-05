
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoCardProps {
  email: string;
  upiId: string;
  balance: number;
}

const UserInfoCard = ({ email, upiId, balance }: UserInfoCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardTitle className="text-purple-700 dark:text-purple-300">User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span> 
          <span className="text-right">{email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-400">UPI ID:</span> 
          <span className="text-right font-mono">{upiId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-400">Balance:</span> 
          <span className="text-right font-bold text-lg text-purple-600 dark:text-purple-400">₹{balance.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
