
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TransactionData {
  name: string;
  amount: number;
}

interface TransactionGraphProps {
  data?: TransactionData[];
}

// Default data is moved to the hook now

const TransactionGraph = ({ data = [] }: TransactionGraphProps) => {
  // If no data provided, show a placeholder message
  if (data.length === 0) {
    return (
      <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
        <p className="text-gray-500">No transaction data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Balance Trend</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            formatter={(value) => [`₹${Math.abs(Number(value)).toLocaleString()}`, Number(value) >= 0 ? 'Received' : 'Spent']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ 
              backgroundColor: "#fff", 
              borderColor: "#e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            name="Transaction Amount"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#8b5cf6" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionGraph;
