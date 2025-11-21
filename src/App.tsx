import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner'; // 全局提示框

// 引入頁面組件
import Home from "@/pages/Home";
import Community from "@/pages/Community";
import UserCenter from "@/pages/UserCenter";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import CustomizePage from "@/pages/CustomizePage";
import AITryOnPage from "@/pages/AITryOnPage";

// 引入通用組件
import NavigationBar from "@/components/NavigationBar";
import AuthModal from './components/AuthModal';
import DebugOverlay from './components/DebugOverlay'; // 🔥 引入診斷組件

// 引入 Context
import { AuthContext } from '@/contexts/authContext';

// --- 1. AuthProvider (認證狀態管理) ---
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

// --- 2. Protected Route (路由保護) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <UserCenter />;
  }
  return children;
};

// --- 3. AppContent (主要佈局與路由) ---
const AppContent = () => {
  const [cartCount, setCartCount] = useState(3); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, register, forgotPassword } = useContext(AuthContext);

  // 監聽自定義事件以打開登錄框
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
    <div className="min-h-screen relative">
      {/* 全局 Toast 提示 */}
      <Toaster position="top-center" richColors />

      {/* 導航欄 */}
      <NavigationBar cartCount={cartCount} />
      
       {/* 路由定義 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/community" element={<Community />} />
        
        {/* 受保護的用戶中心 */}
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
        
        {/* AI 試穿頁面 (兼容兩種路徑寫法) */}
        <Route path="/ai-try-on" element={<AITryOnPage />} />
        <Route path="/ai-tryon" element={<AITryOnPage />} />
        
        {/* 404 頁面 */}
        <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-gray-50">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                <div className="text-sm text-gray-500">
                  Current Path: {window.location.pathname}
                </div>
                <a href="/" className="mt-6 px-6 py-3 bg-[#8b6e4f] text-white rounded-lg hover:bg-[#6d573a] transition-colors">
                  Back to Home
                </a>
            </div>
        } />
      </Routes>

      {/* 登錄彈窗 */}
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

// --- 4. Export App (根組件) ---
export default function App() {
  return (
    // Router 必須包裹在最外層
    <Router>
      <AuthProvider>
        <AppContent />
        
        {/* 🔥 調試面板：放在這裡確保它永遠在最頂層顯示 */}
        <DebugOverlay />
      </AuthProvider>
    </Router>
  );
}