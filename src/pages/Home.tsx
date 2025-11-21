import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

// Mock data for products
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
  }
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    comment: "The quality of the silk is exceptional. It feels so luxurious against my skin.",
    rating: 5,
    avatar: "https://placehold.co/100x100/ffffff/000000?text=EJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    comment: "I've been buying silk products for years, and this is by far the best quality I've found.",
    rating: 5,
    avatar: "https://placehold.co/100x100/ffffff/000000?text=MC"
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    comment: "The silk scarf collection is stunning. The colors are vibrant and long-lasting.",
    rating: 4,
    avatar: "https://placehold.co/100x100/ffffff/000000?text=SR"
  }
];

// Mock data for trend chart
const trendData = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 1900 },
  { month: 'Mar', sales: 1500 },
  { month: 'Apr', sales: 2400 },
  { month: 'May', sales: 2100 },
  { month: 'Jun', sales: 3000 },
  { month: 'Jul', sales: 2800 }
];

// Hero section images
const heroImages = [
  {
    id: 1,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Luxury%20silk%20fabric%20display%20in%20boutique&sign=41659f2a43e1db04140b0c6fdd4715ed",
    title: "Discover Our Exclusive Silk Collection",
    description: "Experience the luxury of pure silk, handcrafted with precision and care."
  },
  {
    id: 2,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Custom%20silk%20dress%20design%20workshop&sign=2528db647de1522d4fb551d939d2ea20",
    title: "Create Your Perfect Silk Piece",
    description: "Customize silk clothing to your exact preferences with our premium fabrics."
  },
  {
    id: 3,
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Elegant%20silk%20fashion%20show&sign=68bbd5658ff9723d9fa4a451a2356fac",
    title: "New Arrivals - Fall Collection",
    description: "Introducing our latest designs for the upcoming season."
  }
];

const Home: React.FC = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Auto rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Change hero image manually
  const changeHeroImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    } else {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }
  };

  return (
    <div className="font-serif min-h-screen bg-[#f9f7f3] text-[#333] pt-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {heroImages.map((hero, index) => (
          <div 
            key={hero.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${hero.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl"
              >
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{hero.title}</h1>
                <p className="text-xl text-white mb-8">{hero.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                   <Link to="/products" className="inline-block bg-[#8b6e4f] hover:bg-[#6d573a] text-white px-8 py-3 rounded-md transition-colors">
                     Shop Now
                   </Link>
                   <Link to="/customize" className="inline-block bg-white hover:bg-gray-100 text-[#8b6e4f] px-8 py-3 rounded-md transition-colors font-medium">
                     Customize Your Silk
                   </Link>
                 </div>
              </motion.div>
            </div>
          </div>
        ))}
        
        {/* Hero Navigation */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all z-20"
          onClick={() => changeHeroImage('prev')}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all z-20"
          onClick={() => changeHeroImage('next')}
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === currentHeroImage ? 'w-8 bg-white' : 'bg-white bg-opacity-50'}`}
              onClick={() => setCurrentHeroImage(index)}
            />
          ))}
        </div>
      </section>

       {/* Featured Categories */}
       <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Categories</h2>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our carefully curated collection of premium silk products for every aspect of your life.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer"
              >
                <div className="h-64 flex items-center justify-center">
                  <h3 className="text-4xl font-bold">Women Silk</h3>
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-800 text-white">
                  <span className="font-medium">Women</span>
                  <Link to="/products?category=Women" className="flex items-center text-white hover:text-gray-300 transition-colors">
                    Shop Now <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
             
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer"
              >
                <div className="h-64 flex items-center justify-center">
                  <h3 className="text-4xl font-bold">Men Silk</h3>
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-800 text-white">
                  <span className="font-medium">Men</span>
                  <Link to="/products?category=Men" className="flex items-center text-white hover:text-gray-300 transition-colors">
                    Shop Now <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
             
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer"
              >
                <div className="h-64 flex items-center justify-center">
                  <h3 className="text-3xl font-bold">Accessories Silk</h3>
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-800 text-white">
                  <span className="font-medium">Accessories</span>
                  <Link to="/products?category=Accessories" className="flex items-center text-white hover:text-gray-300 transition-colors">
                    Shop Now <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
             
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer"
              >
                <div className="h-64 flex items-center justify-center">
                  <h3 className="text-4xl font-bold">Home Silk</h3>
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-800 text-white">
                  <span className="font-medium">Home</span>
                  <Link to="/products?category=Home" className="flex items-center text-white hover:text-gray-300 transition-colors">
                    Shop Now <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
           </div>
         </div>
       </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#f9f7f3]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl">Our most popular silk products, loved by customers around the world.</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-[#8b6e4f] font-medium hover:text-[#6d573a] transition-colors">
              View All Products <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg overflow-hidden shadow-md group"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#8b6e4f] text-white text-sm px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                  <Link to="/products" className="block w-full text-center bg-[#333] hover:bg-[#555] text-white py-2 rounded-md transition-colors">
                    Add to Cart
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center text-[#8b6e4f] font-medium hover:text-[#6d573a] transition-colors">
              View All Products <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Our Silk */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
                 <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20production%20traditional%20craftsmanship&sign=8afaaf953a5b7299c0e0f4a8ef94c659" 
                  alt="Premium Silk Production" 
                  className="rounded-lg shadow-xl w-full"
                />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Story of Our Silk</h2>
              <p className="text-lg text-gray-600 mb-6">
                For centuries, silk has been revered as the epitome of luxury and elegance. At Silk Garden, we continue this tradition by sourcing only the finest mulberry silk, known for its exceptional softness, durability, and natural sheen.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our silk is carefully harvested and processed using traditional techniques combined with modern innovations to ensure the highest quality. Each piece is meticulously crafted by skilled artisans who take pride in their work.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#8b6e4f] text-white rounded-full flex items-center justify-center mr-4">100%</div>
                  <span>Pure Silk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#8b6e4f] text-white rounded-full flex items-center justify-center mr-4">Ethical</div>
                  <span>Sourcing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#8b6e4f] text-white rounded-full flex items-center justify-center mr-4">Artisan</div>
                  <span>Crafted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#8b6e4f] text-white rounded-full flex items-center justify-center mr-4">Sustainable</div>
                  <span>Process</span>
                </div>
              </div>
              <Link to="/products" className="inline-block bg-[#8b6e4f] hover:bg-[#6d573a] text-white px-8 py-3 rounded-md transition-colors">
                Explore Products
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f9f7f3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover why our customers love our silk products and keep coming back for more.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#8b6e4f] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-lg mb-8 opacity-90">Subscribe to receive updates about new collections, special offers, and silk care tips.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              />
              <button className="bg-white text-[#8b6e4f] font-medium px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="mt-4 text-sm opacity-80">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src="https://lf-code-agent.coze.cn/obj/x-ai-cn/attachment/3388008047842323/612b6900e3b284e76eda8c2b331a00a4_20251114002932.jpg" 
                  alt="Silk Garden Logo" 
                  className="w-10 h-10"
                />
                <img 
                  src="https://lf-code-agent.coze.cn/obj/x-ai-cn/attachment/3388008047842323/微信图片_20251020212523_352_1001_20251114002933.jpg" 
                  alt="Silk Garden" 
                  className="h-8 invert"
                />
              </div>
              <p className="mb-6 opacity-80">
                Luxury silk products handcrafted with love and care, bringing elegance and comfort to your everyday life.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6">Shop</h3>
              <ul className="space-y-3">
                <li><Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">All Products</Link></li>
                <li><Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">New Arrivals</Link></li>
                <li><Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">Best Sellers</Link></li>
                <li><Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">Special Offers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/community" className="opacity-80 hover:opacity-100 transition-opacity">Community</Link></li>
                <li><Link to="/user-center" className="opacity-80 hover:opacity-100 transition-opacity">My Account</Link></li>
                <li><Link to="/cart" className="opacity-80 hover:opacity-100 transition-opacity">Cart</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6">Help</h3>
              <ul className="space-y-3">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Shipping & Returns</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">FAQ</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white border-opacity-20 mt-12 pt-8 text-center opacity-80">
            <p>&copy; {new Date().getFullYear()} Silk Garden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;