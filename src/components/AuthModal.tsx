import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
  onForgotPassword: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onForgotPassword,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (activeTab === 'login') {
      try {
        loginSchema.parse(formData);
      } catch (error) {
        isValid = false;
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            newErrors[err.path[0]] = err.message;
          });
        }
      }
    } else if (activeTab === 'register') {
      try {
        registerSchema.parse(formData);
      } catch (error) {
        isValid = false;
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            newErrors[err.path[0]] = err.message;
          });
        }
      }
    } else if (activeTab === 'forgot') {
      try {
        forgotPasswordSchema.parse(formData);
      } catch (error) {
        isValid = false;
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            newErrors[err.path[0]] = err.message;
          });
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (activeTab === 'login') {
        onLogin(formData.username, formData.password);
      } else if (activeTab === 'register') {
        const success = onRegister(formData.username, formData.email, formData.password);
        if (success) {
          // Reset form after successful registration
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          setActiveTab('login');
          toast.success('Registration successful! Please login.');
        }
      } else if (activeTab === 'forgot') {
        onForgotPassword(formData.email);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: 'login' | 'register' | 'forgot') => {
    setActiveTab(tab);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {activeTab === 'login' && 'Login'}
              {activeTab === 'register' && 'Register'}
              {activeTab === 'forgot' && 'Forgot Password'}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'login' && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="login-username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="login-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 text-[#8b6e4f] border-gray-300 rounded focus:ring-[#8b6e4f]"
                    disabled={loading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#8b6e4f] hover:text-[#6d573a] font-medium"
                  onClick={() => switchTab('forgot')}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8b6e4f] hover:bg-[#6d573a] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-[#8b6e4f] hover:text-[#6d573a] font-medium"
                    onClick={() => switchTab('register')}
                    disabled={loading}
                  >
                    Create one
                  </button>
                </p>
              </div>
            </>
          )}

          {activeTab === 'register' && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="register-username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="register-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Choose a username"
                    required
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <CheckCircle size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8b6e4f] hover:bg-[#6d573a] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Registering...
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-[#8b6e4f] hover:text-[#6d573a] font-medium"
                    onClick={() => switchTab('login')}
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}

          {activeTab === 'forgot' && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-[#8b6e4f]'
                    }`}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8b6e4f] hover:bg-[#6d573a] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <button
                    type="button"
                    className="text-[#8b6e4f] hover:text-[#6d573a] font-medium"
                    onClick={() => switchTab('login')}
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;