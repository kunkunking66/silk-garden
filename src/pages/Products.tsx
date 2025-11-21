import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock product data
const products = [
  {
    id: 1,
    name: "Silk Scarf Collection",
    price: 89.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Luxury%20silk%20scarf%20collection%20display&sign=1b5a7647983ccf327add7be352718b4a",
    category: "Accessories",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Premium Silk Dress",
    price: 299.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Elegant%20silk%20dress%20on%20mannequin&sign=09bfdd86139166a84b4306c8fa9fc341",
    category: "Women",
    rating: 4.9,
    reviews: 87
  },
  {
    id: 3,
    name: "Silk Bed Sheets Set",
    price: 399.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Luxury%20silk%20bed%20sheets%20on%20bed&sign=37ac7bebdbb62a47fe64e28aa390c2a2",
    category: "Home",
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: "Silk Pillowcase",
    price: 69.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20pillowcase%20on%20white%20pillow&sign=3c121d8b259bdee6aa7d9bf05004b4d4",
    category: "Home",
    rating: 4.6,
    reviews: 98
  },
  {
    id: 5,
    name: "Silk Robe",
    price: 199.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20robe%20hanging%20elegantly&sign=8db155e33c8f29946bb1950d03623be9",
    category: "Loungewear",
    rating: 4.8,
    reviews: 112
  },
  {
    id: 6,
    name: "Silk Tie Collection",
    price: 79.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20ties%20collection%20display&sign=89b1e7eeb22ca0c7ba9a3b81f143520f",
    category: "Men",
    rating: 4.7,
    reviews: 65
  },
  {
    id: 7,
    name: "Silk Nightgown",
    price: 159.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Luxury%20silk%20nightgown&sign=79d6f333b2c7722c68752cd784ac8ecf",
    category: "Women",
    rating: 4.9,
    reviews: 132
  },
  {
    id: 8,
    name: "Silk Eye Mask",
    price: 29.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20eye%20mask%20on%20display&sign=e3aadd2811f278e225f69d4ba68b552e",
    category: "Accessories",
    rating: 4.8,
    reviews: 203
  },
  {
    id: 9,
    name: "Silk Handkerchief",
    price: 19.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20handkerchief%20folded%20elegantly&sign=836253f7f7c638c7cca8b0b45b2b2450",
    category: "Accessories",
    rating: 4.7,
    reviews: 96
  },
  {
    id: 10,
    name: "Silk Hair Scrunchies Set",
    price: 15.99,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Silk%20hair%20scrunchies%20set&sign=85a549fa712589a4eaaea0a6188ed818",
    category: "Accessories",
    rating: 4.5,
    reviews: 157
  }
]

// Available categories
const categories = ["All", "Women", "Men", "Accessories", "Home", "Loungewear"];

const Products: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get category from URL parameters when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    // Check if the category is valid (exists in our categories array)
    if (category && categories.includes(category)) {
      setActiveCategory(category);
    }
  }, [location.search]);

  // **FIXED: Real Add to Cart Functionality using LocalStorage**
  const addToCart = (product: typeof products[0]) => {
    try {
      // 1. Get current cart from LocalStorage
      const savedCart = localStorage.getItem('shopping-cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      // 2. Check if product already exists
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex >= 0) {
        // If exists, increment quantity
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // If not, add new item with quantity 1
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      // 3. Save back to LocalStorage
      localStorage.setItem('shopping-cart', JSON.stringify(cartItems));

      // 4. Show success feedback
      toast.success(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="font-serif min-h-screen bg-[#f9f7f3] text-[#333] pt-24 pb-16">
      {/* Page Header */}
      <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Silk Products</h1>
          <p className="text-lg text-gray-600">Discover our collection of premium silk products</p>
        </div>
        {/* Optional: Quick link to Cart */}
        <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-[#8b6e4f] font-semibold hover:text-[#6d573a] transition-colors"
        >
            Go to Cart <ShoppingCart size={20} />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-[#8b6e4f] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg overflow-hidden shadow-md group flex flex-col h-full"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 space-y-2">
                    <button className="bg-white rounded-full p-2 shadow-md hover:bg-[#f9f7f3] transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#8b6e4f] text-white text-sm px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">${product.price.toFixed(2)}</p>
                   
                   {/* Push buttons to the bottom */}
                   <div className="space-y-2 mt-auto">
                    <button 
                      className="w-full bg-[#333] hover:bg-[#555] text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <Link to="/customize" className="block w-full text-center bg-[#8b6e4f] hover:bg-[#6d573a] text-white py-2 rounded-md transition-colors">
                      Customize
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;