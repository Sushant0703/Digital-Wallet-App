
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-white text-purple-600 p-1 rounded-md">FP</span>
          Fast-Pay
        </Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-purple-700 hover:text-white hover:border-transparent" 
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="text-white border-white hover:bg-purple-700 hover:text-white hover:border-transparent">
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
