import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner'; // 🔥 新增：這是 AI 頁面彈窗必須的組件

// 引入頁面
import Home from "@/pages/Home";
import Community from "@/pages/Community";
import UserCenter from "@/pages/UserCenter";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import CustomizePage from "@/pages/CustomizePage";
import AITryOnPage from "@/pages/AITryOnPage";

// 引入組件和 Context
import NavigationBar from "@/components/NavigationBar";
import { AuthContext } from '@/contexts/authContext';
import AuthModal from './components/AuthModal';

// --- 1. AuthProvider (保持你原本的邏輯不變) ---
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (username && password) {
      setIsAuthenticated(true);
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('username');
    localStorage.setItem('isAuthenticated', 'false');
  };

  const register = (username: string, email: string, password: string): boolean => {
    if (username && email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      return true;
    }
    return false;
  };

  const forgotPassword = (email: string): void => {
    console.log(`Password reset email sent to: ${email}`);
  };

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

// --- 2. Protected Route (保持不變) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <UserCenter />;
  }
  return children;
};

// --- 3. AppContent (合併邏輯) ---
const AppContent = () => {
  const [cartCount, setCartCount] = useState(3); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, register, forgotPassword } = useContext(AuthContext);

  useEffect(() => {
    const handleOpenAuthModal = () => {
      setShowAuthModal(true);
    };

    document.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      document.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

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
      {/* 🔥 新增：全局提示框 (AI 頁面需要它) */}
      <Toaster position="top-center" richColors />

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
        
        {/* 🔥 這裡統一路由名稱為 /ai-try-on，確保和 Netlify 部署一致 */}
        <Route path="/ai-try-on" element={<AITryOnPage />} />
        
        {/* 404 Fallback */}
        <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <h1 className="text-4xl font-bold">404</h1>
                <p>Page Not Found</p>
                <a href="/" className="text-blue-500 mt-4">Go Home</a>
            </div>
        } />
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

// --- 4. Export App ---
export default function App() {
  return (
    // 確保最外層有 Router
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}