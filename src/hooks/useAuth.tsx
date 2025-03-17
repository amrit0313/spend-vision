
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: { username: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  exp: number;
  sub: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (token && username) {
      try {
        // Check if token is expired
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          handleLogout("Your session has expired. Please login again.");
          return;
        }
        
        setUser({ username });
        
        // Set a timeout to logout when the token expires
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
        const logoutTimer = setTimeout(() => {
          handleLogout("Your session has expired. Please login again.");
        }, timeUntilExpiry);
        
        return () => clearTimeout(logoutTimer);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = (message?: string) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setIsLoading(false);
    navigate("/login");
    if (message) {
      toast.info(message);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await apiLogin(username, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      setUser({ username });
      
      // Set expiry timer
      try {
        const decoded = jwtDecode<JwtPayload>(data.access_token);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
        
        setTimeout(() => {
          handleLogout("Your session has expired. Please login again.");
        }, timeUntilExpiry);
      } catch (error) {
        console.error("Error setting token expiry timer:", error);
      }
      
      navigate("/dashboard");
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await apiRegister(username, password);
      toast.success("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Username may already be taken.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleLogout("Successfully logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
