
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Fast Transfers</h3>
            <p>Send money instantly to anyone with a UPI ID. No waiting times, no delays.</p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Secure Payments</h3>
            <p>Your transactions are encrypted and secure. We prioritize your financial safety.</p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Track Spending</h3>
            <p>View your transaction history and track your spending patterns with visual graphs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
