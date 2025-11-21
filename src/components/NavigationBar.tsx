import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';

interface NavigationBarProps {
  cartCount?: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ cartCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  // Handle scroll event for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle login button click - open auth modal
  const handleLoginClick = () => {
    // Trigger the auth modal by setting showAuthModal to true
    // We use a custom event to communicate with the App component
    const event = new CustomEvent('openAuthModal');
    document.dispatchEvent(event);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://lf-code-agent.coze.cn/obj/x-ai-cn/attachment/3388008047842323/612b6900e3b284e76eda8c2b331a00a4_20251114002932.jpg" 
              alt="Silk Garden Logo" 
              className="w-10 h-10"
            />
            <img 
              src="https://lf-code-agent.coze.cn/obj/x-ai-cn/attachment/3388008047842323/微信图片_20251020212523_352_1001_20251114002933.jpg" 
              alt="Silk Garden" 
              className="h-8"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#333] hover:text-[#8b6e4f] transition-colors font-medium text-lg">Home</Link>
            <Link to="/products" className="text-[#333] hover:text-[#8b6e4f] transition-colors font-medium text-lg">Products</Link>
            <Link to="/customize" className="text-[#333] hover:text-[#8b6e4f] transition-colors font-medium text-lg">Customize</Link>
            <Link to="/ai-tryon" className="text-[#333] hover:text-[#8b6e4f] transition-colors font-medium text-lg">AI Try-On</Link>
            <Link to="/community" className="text-[#333] hover:text-[#8b6e4f] transition-colors font-medium text-lg">Community</Link>
            
            {/* Conditional display based on authentication status */}
            {isAuthenticated ? (
              <Link to="/user-center" className="text-[#333] hover:text-[#8b6e4f] transition-colors">
                <User size={20} />
              </Link>
            ) : (
              <button 
                className="flex items-center text-[#333] hover:text-[#8b6e4f] transition-colors"
                onClick={handleLoginClick}
              >
                <LogIn size={20} className="mr-1" />
                <span>Login</span>
              </button>
            )}
            
            <Link to="/cart" className="text-[#333] hover:text-[#8b6e4f] transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8b6e4f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg">Home</Link>
            <Link to="/products" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg">Products</Link>
            <Link to="/customize" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg">Customize</Link>
            <Link to="/ai-tryon" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg">AI Try-On</Link>
            <Link to="/community" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg">Community</Link>
            
            {/* Conditional display based on authentication status for mobile */}
            {isAuthenticated ? (
              <Link to="/user-center" className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg flex items-center">
                <User size={20} className="mr-2" />
                <span>My Account</span>
              </Link>
            ) : (
              <button 
                className="py-2 px-4 hover:bg-[#f9f7f3] rounded-lg transition-colors font-medium text-lg flex items-center"
                onClick={handleLoginClick}
              >
                <LogIn size={20} className="mr-2" />
                <span>Login</span>
              </button>
            )}
            
            <div className="flex justify-around pt-2 border-t">
              {isAuthenticated ? (
                <Link to="/user-center" className="p-2 hover:bg-[#f9f7f3] rounded-full transition-colors">
                  <User size={24} />
                </Link>
              ) : (
                <button 
                  className="p-2 hover:bg-[#f9f7f3] rounded-full transition-colors"
                  onClick={handleLoginClick}
                >
                  <LogIn size={24} />
                </button>
              )}
              <Link to="/cart" className="p-2 hover:bg-[#f9f7f3] rounded-full transition-colors relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8b6e4f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavigationBar;