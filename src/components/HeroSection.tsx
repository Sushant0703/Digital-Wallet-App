
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative bg-primary text-white pb-32 pt-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-8 mt-16">
          Fast & Secure
          <br />
          Digital Payments
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-12 bg-primary/30 backdrop-blur-sm p-6 rounded-lg">
          Experience seamless transactions with FastPay. Manage your payments effortlessly with our powerful yet simple platform.
        </p>
        <Link to="/signup">
          <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-6 text-lg rounded-full">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="wave-shape">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
