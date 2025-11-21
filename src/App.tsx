import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Community from "@/pages/Community";
import UserCenter from "@/pages/UserCenter";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import CustomizePage from "@/pages/CustomizePage";
import AITryOnPage from "@/pages/AITryOnPage";
import NavigationBar from "@/components/NavigationBar";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from '@/contexts/authContext';
import AuthModal from './components/AuthModal';

// AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Check if user is authenticated from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Save authentication status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Mock login function
  const login = (username: string, password: string): boolean => {
    // Simple validation for demonstration
    // In a real app, this would make an API call
    if (username && password) {
      setIsAuthenticated(true);
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('username');
    localStorage.setItem('isAuthenticated', 'false');
  };

  // Mock register function
  const register = (username: string, email: string, password: string): boolean => {
    // Simple validation for demonstration
    // In a real app, this would make an API call
    if (username && email && password) {
      // Auto login after registration
      setIsAuthenticated(true);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      return true;
    }
    return false;
  };

  // Mock forgot password function
  const forgotPassword = (email: string): void => {
    // In a real app, this would make an API call to send a password reset email
    console.log(`Password reset email sent to: ${email}`);
  };

  // Provide the context values
  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    // Instead of redirecting to home, show the UserCenter page with login prompt
    return <UserCenter />;
  }
  return children;
};

const AppContent = () => {
  const [cartCount, setCartCount] = useState(3); // Initial cart count
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, register, forgotPassword } = useContext(AuthContext);

  // Listen for the custom event to open the auth modal
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setShowAuthModal(true);
    };

    document.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      document.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // Handle authentication events from modal
  const handleLogin = (username: string, password: string) => {
    const success = login(username, password);
    if (success) {
      setShowAuthModal(false);
    }
  };

  const handleRegister = (username: string, email: string, password: string) => {
    register(username, email, password);
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Navigation Bar */}
      <NavigationBar cartCount={cartCount} />
      
       {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/community" element={<Community />} />
        <Route 
          path="/user-center" 
          element={
            <ProtectedRoute>
              <UserCenter />
            </ProtectedRoute>
          } 
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/customize" element={<CustomizePage />} />
        <Route path="/ai-tryon" element={<AITryOnPage />} />
      </Routes>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={forgotPassword}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
