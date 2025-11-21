import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data
const initialMockData = [
  {
    id: 1,
    name: "Silk Scarf Collection",
    price: 89.99,
    quantity: 1,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20silk%20scarf%20collection&sign=e52fea390d593a29f2174ae2ebeea5c9"
  },
  {
    id: 2,
    name: "Silk Pillowcase",
    price: 69.99,
    quantity: 2,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20pillowcase%20on%20white%20background&sign=fa935bd8386d7ca6dd9dd309f9db1d6f"
  },
  {
    id: 3,
    name: "Silk Eye Mask",
    price: 29.99,
    quantity: 1,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20eye%20mask%20on%20display&sign=d635d8baf887bd88ce951c57e25676ec"
  }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage if available, otherwise use mock data
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    return savedCart ? JSON.parse(savedCart) : initialMockData;
  });

  // Persist changes to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="font-serif min-h-screen bg-[#f9f7f3] text-[#333] pt-24 pb-16">
      {/* Page Header */}
      <div className="container mx-auto px-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-[#8b6e4f] mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Shopping Cart</h1>
        <p className="text-lg text-gray-600">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {cartItems.length > 0 ? (
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3">
              {/* AnimatePresence is crucial for removal animations */}
              <AnimatePresence mode='popLayout'>
                {cartItems.map((item) => (
                  <motion.div 
                    layout // Allows other items to slide up smoothly when one is removed
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 flex flex-col sm:flex-row gap-6 group"
                  >
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                          <button 
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <p className="text-lg font-bold text-[#8b6e4f] mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4 sm:mt-0">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                          <button 
                            className="px-3 py-2 hover:bg-gray-200 rounded-l-full transition-colors disabled:opacity-30"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button 
                            className="px-3 py-2 hover:bg-gray-200 rounded-r-full transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 font-medium">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              <motion.button 
                layout
                className="mt-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ml-auto"
                onClick={clearCart}
              >
                <Trash2 size={16} />
                <span>Clear All Items</span>
              </motion.button>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24 border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-medium text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-[#8b6e4f]">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-[#8b6e4f] hover:bg-[#6d573a] text-white py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold mb-4">
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingBag size={18} />
                  <span>Continue Shopping</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="container mx-auto px-4 text-center py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-10 border border-gray-100"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#8b6e4f] hover:bg-[#6d573a] text-white px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Start Shopping
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;