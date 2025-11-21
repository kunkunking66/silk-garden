import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Check, ShoppingCart, 
  Palette, Package, SlidersHorizontal, Share2, Heart, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock silk product data for customization
const silkProducts = [
  {
    id: 1,
    name: "Silk Dress",
    basePrice: 299.99,
    images: [
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Elegant%20silk%20dress%20on%20mannequin&sign=170839d0a0274ee36cc0dd4b5e3aa0fd",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20dress%20detail%20fabric%20texture&sign=e7e8de8c0ccf48e5a52988a4ea1ba0c5",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20dress%20fashion%20model%20wearing&sign=8946c5c06916c8b5611d4ad38502d8b0"
    ]
  },
  {
    id: 2,
    name: "Silk Blouse",
    basePrice: 199.99,
    images: [
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20blouse%20on%20display&sign=754911571499b2b9b832513a040997f1",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20blouse%20fabric%20detail&sign=cf6704fb39a7f547adfc1170732e3f0d",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Business%20woman%20wearing%20silk%20blouse&sign=91cbaf719b070b00d646c2fb712182de"
    ]
  },
  {
    id: 3,
    name: "Silk Scarf",
    basePrice: 89.99,
    images: [
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20folded%20elegant&sign=22fe4fd94f861f4b8e6f355b2d6b3d02",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20pattern%20detail&sign=ba1d530f9d1d011d632c0a6c3d04f403",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Woman%20wearing%20silk%20scarf%20around%20neck&sign=b4723d4dcabf65b45e6f902bb8832871"
    ]
  },
  {
    id: 4,
    name: "Silk Robe",
    basePrice: 199.99,
    images: [
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20robe%20hanging%20elegantly&sign=93ac47001f00c2079539f6dc2ca34596",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20robe%20detail%20cuffs&sign=f5bd197ef80327102c44d03309778848",
      "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20robe%20luxury%20bedroom%20setting&sign=74ad6efbc32eef4f62e2e736c28056d8"
    ]
  }
];

// Silk types for customization
const silkTypes = [
  { id: 'mulberry', name: 'Mulberry Silk', price: 0 },
  { id: 'charmeuse', name: 'Charmeuse Silk', price: 50 },
  { id: 'crepe', name: 'Crepe Silk', price: 75 },
  { id: 'georgette', name: 'Georgette Silk', price: 60 }
];

// Colors for customization
const colors = [
  { id: 'ivory', name: 'Ivory', color: '#FFFFF0' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'navy', name: 'Navy Blue', color: '#001F3F' },
  { id: 'crimson', name: 'Crimson', color: '#DC143C' },
  { id: 'emerald', name: 'Emerald Green', color: '#046307' },
  { id: 'gold', name: 'Gold', color: '#D4AF37' },
  { id: 'blush', name: 'Blush Pink', color: '#DE5D83' },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA' }
];

// Patterns for customization
const patterns = [
  { id: 'solid', name: 'Solid', price: 0 },
  { id: 'floral', name: 'Floral', price: 40 },
  { id: 'geometric', name: 'Geometric', price: 35 },
  { id: 'abstract', name: 'Abstract', price: 45 },
  { id: 'animal', name: 'Animal Print', price: 55 },
  { id: 'stripes', name: 'Stripes', price: 30 }
];

// Sizes for customization
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CustomizePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSilkType, setSelectedSilkType] = useState('mulberry');
  const [selectedColor, setSelectedColor] = useState('ivory');
  const [selectedPattern, setSelectedPattern] = useState('solid');
  const [selectedSize, setSelectedSize] = useState('M');
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const currentProduct = silkProducts[currentProductIndex];
  
  // Calculate unit price (base + extras)
  const calculateUnitPrice = () => {
    const silkTypePrice = silkTypes.find(type => type.id === selectedSilkType)?.price || 0;
    const patternPrice = patterns.find(pattern => pattern.id === selectedPattern)?.price || 0;
    return currentProduct.basePrice + silkTypePrice + patternPrice;
  };

  // Calculate total price
  const calculateTotal = () => {
    return calculateUnitPrice() * quantity;
  };
  
  // Change product image
  const changeImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
    } else {
      setCurrentImageIndex(prev => (prev + 1) % currentProduct.images.length);
    }
  };
  
  // Change product
  const changeProduct = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentProductIndex(prev => (prev - 1 + silkProducts.length) % silkProducts.length);
    } else {
      setCurrentProductIndex(prev => (prev + 1) % silkProducts.length);
    }
    setCurrentImageIndex(0);
    // Reset selections when changing product
    setSelectedSilkType('mulberry');
    setSelectedColor('ivory');
    setSelectedPattern('solid');
    setSelectedSize('M');
    setQuantity(1);
  };
  
  // **FIXED: Add to Cart with LocalStorage**
  const addToCart = () => {
    try {
      // Get descriptive names for selected options
      const silkName = silkTypes.find(t => t.id === selectedSilkType)?.name;
      const colorName = colors.find(c => c.id === selectedColor)?.name;
      
      // Create a unique item for the cart
      const newItem = {
        // Use timestamp to ensure unique ID for customized items
        id: Date.now(), 
        productId: currentProduct.id,
        // Create a descriptive name so it looks good in the cart
        name: `${currentProduct.name} (${colorName} / ${silkName})`,
        price: calculateUnitPrice(), // Store unit price
        image: currentProduct.images[currentImageIndex], // Use currently viewed image
        quantity: quantity,
        // Optional: Store customization details if you want to use them later
        customization: {
          silkType: selectedSilkType,
          color: selectedColor,
          pattern: selectedPattern,
          size: selectedSize,
          text: customText
        }
      };

      // Save to LocalStorage
      const savedCart = localStorage.getItem('shopping-cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // For custom items, we generally just push a new item instead of merging quantities
      // because the customization details might differ.
      cartItems.push(newItem);
      
      localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
      
      toast.success("Custom design added to cart!");
      
      // Optional: Navigate to cart after a short delay
      setTimeout(() => {
         navigate('/cart');
      }, 500);
      
    } catch (error) {
      console.error("Error adding custom item:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleSaveDesign = () => {
    toast.success("Design saved to your wishlist! (Simulation)");
  };
  
  return (
    <div className="min-h-screen bg-[#f9f7f3] text-[#333] pt-24 pb-16">
      {/* Page Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center">
          <button 
            className="mr-4 text-gray-600 hover:text-[#8b6e4f]"
            onClick={() => navigate('/products')}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Customize Your Silk</h1>
        </div>
        <p className="text-gray-600 mt-2">Create your perfect silk piece with our customization options</p>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Preview */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              {/* Product images */}
              <div className="relative h-96">
                <motion.img 
                  key={currentProduct.images[currentImageIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={currentProduct.images[currentImageIndex]} 
                  alt={currentProduct.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition-all"
                  onClick={() => changeImage('prev')}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition-all"
                  onClick={() => changeImage('next')}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Image thumbnails */}
              <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar">
                {currentProduct.images.map((image, index) => (
                  <button 
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex ? 'ring-2 ring-[#8b6e4f] scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${currentProduct.name} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Product navigation */}
              <div className="p-4 flex justify-between items-center border-t bg-gray-50">
                <button 
                  className="flex items-center text-gray-600 hover:text-[#8b6e4f] font-medium"
                  onClick={() => changeProduct('prev')}
                >
                  <ChevronLeft size={18} className="mr-1" />
                  <span>Previous Item</span>
                </button>
                <span className="text-sm text-gray-500 font-medium">
                  {currentProductIndex + 1} of {silkProducts.length}
                </span>
                <button 
                  className="flex items-center text-gray-600 hover:text-[#8b6e4f] font-medium"
                  onClick={() => changeProduct('next')}
                >
                  <span>Next Item</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Customization Options */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-2">{currentProduct.name}</h2>
                <p className="text-2xl font-bold text-[#8b6e4f]">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
              
              {/* Product Info */}
              <div className="mb-8 border-b pb-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Create your custom {currentProduct.name.toLowerCase()} with our premium silk fabrics and customization options. Each piece is handcrafted with attention to detail.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="flex items-center text-gray-500 hover:text-[#8b6e4f] transition-colors text-sm"
                    onClick={handleSaveDesign}
                  >
                    <Heart size={16} className="mr-1" />
                    <span>Save to Wishlist</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-[#8b6e4f] transition-colors text-sm">
                    <Share2 size={16} className="mr-1" />
                    <span>Share Design</span>
                  </button>
                </div>
              </div>
              
              {/* Silk Type Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette size={18} className="mr-2" />
                  Silk Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {silkTypes.map(type => (
                    <button
                      key={type.id}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        selectedSilkType === type.id 
                          ? 'border-[#8b6e4f] bg-[#f9f7f3] shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSilkType(type.id)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{type.name}</span>
                        {type.price > 0 && <span className="text-[#8b6e4f] text-sm">+${type.price}</span>}
                      </div>
                      {selectedSilkType === type.id && (
                        <div className="flex justify-end mt-1">
                          <Check size={16} className="text-[#8b6e4f]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette size={18} className="mr-2" />
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color.id}
                      className={`relative w-12 h-12 rounded-full transition-transform shadow-sm border border-gray-200 ${
                        selectedColor === color.id ? 'ring-2 ring-[#8b6e4f] ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.color }}
                      onClick={() => setSelectedColor(color.id)}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={18} className={color.id === 'black' || color.id === 'navy' || color.id === 'emerald' || color.id === 'sapphire' ? 'text-white' : 'text-[#8b6e4f]'} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Selected: <span className="font-medium text-gray-800">{colors.find(c => c.id === selectedColor)?.name}</span></p>
              </div>
              
              {/* Pattern Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <SlidersHorizontal size={18} className="mr-2" />
                  Pattern
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      className={`p-3 border rounded-lg text-center transition-all ${
                        selectedPattern === pattern.id 
                          ? 'border-[#8b6e4f] bg-[#f9f7f3] shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPattern(pattern.id)}
                    >
                      <div className="font-medium text-sm">{pattern.name}</div>
                      {pattern.price > 0 && <div className="text-xs text-[#8b6e4f] mt-1">+${pattern.price}</div>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Package size={18} className="mr-2" />
                  Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-all ${
                        selectedSize === size 
                          ? 'border-[#8b6e4f] bg-[#8b6e4f] text-white font-medium shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom Text */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Custom Text (Optional)</h3>
                <div className="relative">
                    <input
                    type="text"
                    placeholder="Add initials or name..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={20}
                    />
                    <span className="absolute right-3 top-3 text-xs text-gray-400">{customText.length}/20</span>
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center font-medium">{quantity}</span>
                  <button 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="flex-1 bg-[#8b6e4f] hover:bg-[#6d573a] text-white py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-lg"
                  onClick={addToCart}
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart - ${calculateTotal().toFixed(2)}</span>
                </button>
                
                {/* Replaced CustomizeButton with standard HTML button */}
                <button 
                  className="flex-1 border-2 border-[#8b6e4f] text-[#8b6e4f] hover:bg-[#f9f7f3] py-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                  onClick={handleSaveDesign}
                >
                  <Save size={20} />
                  <span>Save Design</span>
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                    <Package size={20} className="mb-1 text-gray-400"/>
                    <span>Free shipping over $150</span>
                </div>
                <div className="flex flex-col items-center">
                    <Check size={20} className="mb-1 text-gray-400"/>
                    <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;