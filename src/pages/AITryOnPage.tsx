import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Share2, Download, ChevronLeft, 
  Sparkles, RefreshCw, Trash2, RotateCcw,
  ChevronRight, ChevronLeft as ChevronLeftIcon,
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock Data
const mockProducts = [
  { 
    id: 1, 
    name: "Silk Scarf", 
    price: 89.99, 
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20on%20transparent%20background&sign=32b32d1fa6be95be0954955b9c5839c2", 
    category: "Accessories",
    resultImage: "/images/results/img1.png" // Demo result
  },
  { 
    id: 2, 
    name: "Silk Dress", 
    price: 299.99, 
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20dress%20on%20transparent%20background&sign=8cf47f9522400c24de1385ceec496ae1", 
    category: "Women",
    resultImage: "/images/results/img2.png"
  },
  { 
    id: 3, 
    name: "Silk Blouse", 
    price: 199.99, 
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20blouse%20on%20transparent%20background&sign=a0877dfe6c755ac63f17389028c2a49b", 
    category: "Women",
    resultImage: "/images/results/img3.png"
  },
  { 
    id: 4, 
    name: "Silk Robe", 
    price: 199.99, 
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20robe%20on%20transparent%20background&sign=b05735ceb12a1a34974af0e61719dfee", 
    category: "Loungewear",
    resultImage: "/images/results/img4.png"
  },
];

const categories = ["All", "Women", "Accessories", "Loungewear"];

// CSS Styles
const styles = {
  backdrop: {
    WebkitBackdropFilter: 'blur(10px)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  noScroll: {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none',
  }
};

const AITryOnPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userImages, setUserImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isGeneratingAiTryOn, setIsGeneratingAiTryOn] = useState(false);
  const [aiResultImage, setAiResultImage] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const currentUserImage = userImages[currentImageIndex];
  const filteredProducts = mockProducts.filter(p => selectedCategory === "All" || p.category === selectedCategory);

  // Display Logic: AI Result > Original Image
  const displayImage = aiResultImage || currentUserImage;

  const resetAllSelections = () => {
    setSelectedProduct(null);
    setAiResultImage('');
  };

  // --- 1. Demo Image Loader ---
  const handleLoadDemoImage = async () => {
    const demoImagePath = "/images/results/example.jpg"; 
    try {
      const response = await fetch(demoImagePath);
      if (!response.ok) throw new Error("Demo image not found");
      
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserImages(prev => {
          const updated = [...prev, result];
          setCurrentImageIndex(updated.length - 1);
          return updated;
        });
        resetAllSelections();
        setIsDemoMode(true); // Enable Demo Mode
        toast.success("Demo Mode Activated");
      };
      reader.readAsDataURL(blob);
    } catch {
      toast.error("Failed to load demo image.");
    }
  };

  // --- 2. Image Upload ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const readers: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          readers.push(ev.target.result as string);
          if (readers.length === files.length) {
            setUserImages(prev => {
              const updated = [...prev, ...readers];
              setCurrentImageIndex(updated.length - 1); 
              return updated;
            });
            resetAllSelections();
            setIsDemoMode(false); // Switch to Real AI Mode
            toast.success(`Uploaded! Switching to Real AI.`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const deleteCurrentImage = () => {
    setUserImages(prev => {
      const newList = prev.filter((_, i) => i !== currentImageIndex);
      const newIndex = newList.length > 0 ? Math.min(currentImageIndex, newList.length - 1) : 0;
      setCurrentImageIndex(newIndex);
      return newList;
    });
    resetAllSelections();
  };

  const prevImage = () => {
    if (userImages.length <= 1) return;
    setCurrentImageIndex(prev => (prev - 1 + userImages.length) % userImages.length);
    resetAllSelections();
  };

  const nextImage = () => {
    if (userImages.length <= 1) return;
    setCurrentImageIndex(prev => (prev + 1) % userImages.length);
    resetAllSelections();
  };

  // --- 3. Core Try-On Logic ---
  const handleProductSelect = async (product: any) => {
    if (!currentUserImage) return toast.error("Please upload a photo first!");

    setIsGeneratingAiTryOn(true);
    setAiResultImage(''); 
    setSelectedProduct(product);
    
    // A. Demo Mode Logic
    if (isDemoMode) {
        toast.info(`Generating preview...`);
        setTimeout(() => {
            setAiResultImage(product.resultImage);
            setIsGeneratingAiTryOn(false);
            toast.success("Try-On Successful! (Demo)");
        }, 1500);
        return;
    }

    // B. Real AI Logic
    toast.info(`Designing your look with AI... (Wait ~30s)`);

    try {
      // 🔥 Determine Backend URL based on Environment
      const API_BASE = import.meta.env.DEV 
          ? 'http://localhost:3001' 
          : 'https://silk-garden-api.onrender.com';

      const userBlob = await (await fetch(currentUserImage)).blob();
      const formData = new FormData();
      formData.append('human_img', userBlob, 'human.jpg');
      formData.append('garm_img_url', product.image);

      let prompt = "silk clothing";
      let category = "upper_body";
      if (product.name.includes("Dress") || product.name.includes("Robe")) {
        prompt = product.name.toLowerCase();
        category = "dresses";
      }
      formData.append('prompt', prompt);
      formData.append('category', category);

      console.log(`Sending request to ${API_BASE}/api/try-on...`);

      const res = await fetch(`${API_BASE}/api/try-on`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server Error: ${res.status}`);

      let url = Array.isArray(data.resultUrl) ? data.resultUrl[0] : data.resultUrl;
      if (!url) throw new Error('Backend returned no image URL/Data.');

      // Handle relative paths (prepend API_BASE)
      if (url.startsWith('/')) {
        url = `${API_BASE}${url}`;
      }
      
      // Handle caching for remote URLs
      if (url.startsWith('http')) {
         url = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      }

      // Preload Image
      const img = new Image();
      img.onload = () => {
        setAiResultImage(url);
        setIsGeneratingAiTryOn(false);
        toast.success("Look generated successfully!");
      };
      img.onerror = () => {
        setAiResultImage(url); 
        setIsGeneratingAiTryOn(false);
        toast.error("Image generated but display failed.");
      };
      img.src = url;

    } catch (err: any) {
      console.error("Process Failed:", err);
      toast.error("Generation failed. Please try again.");
      setIsGeneratingAiTryOn(false);
    }
  };

  const saveImage = () => {
    if (!aiResultImage) return;
    const link = document.createElement('a');
    link.href = aiResultImage;
    link.download = `silk-garden-look-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Saved to device");
  };

  return (
    <div className="font-serif min-h-screen bg-[#f9f7f3] text-[#333] pt-24 pb-16">
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            title="Back to Home"
            className="text-gray-600 hover:text-[#8b6e4f] flex items-center gap-2 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Virtual Fitting Room</h1>
            <p className="text-gray-500 mt-1">Experience our silk collection on you, instantly.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT: CANVAS AREA --- */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-shadow hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-[#8b6e4f]" size={20}/> 
                  Try-On Result {isDemoMode && <span className="text-xs bg-[#8b6e4f] text-white px-2 py-0.5 rounded-full">DEMO</span>}
                </h2>
                <button
                  onClick={handleLoadDemoImage}
                  title="Use Demo Photo (Fast Mode)"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isDemoMode 
                    ? 'bg-[#8b6e4f] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-[#8b6e4f] hover:text-white'
                  }`}
                >
                  <ImageIcon size={16} /> Demo Photo
                </button>
              </div>
              
              {/* CANVAS CONTAINER */}
              <div 
                className={`relative w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 transition-all duration-500 ${!currentUserImage ? 'h-[500px] bg-gray-50' : 'border-none bg-black'}`}
              >
                {!currentUserImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-[#8b6e4f]/10 p-6 rounded-full mb-6">
                        <Upload size={48} className="text-[#8b6e4f]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upload Your Photo</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Best results with good lighting and clear body view.</p>
                    <label 
                      className="bg-[#8b6e4f] hover:bg-[#6d573a] text-white px-10 py-4 rounded-full cursor-pointer shadow-lg text-lg font-semibold transition-transform hover:scale-105 active:scale-95"
                      title="Upload Photo"
                    >
                      Select Image
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full flex justify-center items-center overflow-hidden group">
                    
                    {/* Background Blur */}
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center blur-xl opacity-50 scale-110"
                        style={{ backgroundImage: `url(${displayImage})` }}
                    ></div>

                    {/* Main Image */}
                    <AnimatePresence mode='wait'>
                        <motion.img 
                            key={displayImage} 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={displayImage} 
                            alt="Result" 
                            className="relative z-10 w-auto h-auto max-w-full max-h-[75vh] object-contain shadow-2xl rounded-lg"
                        />
                    </AnimatePresence>

                    {/* Loading Overlay */}
                    {isGeneratingAiTryOn && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white" style={styles.backdrop}>
                        <RefreshCw className="animate-spin mb-4" size={56} />
                        <p className="text-2xl font-bold tracking-wide">Generating...</p>
                        <p className="opacity-80 mt-2 text-sm font-light">
                            {isDemoMode ? "Loading Demo Result..." : "AI Magic in progress (~30s)"}
                        </p>
                      </div>
                    )}

                    {/* Hover Controls */}
                    {!isGeneratingAiTryOn && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl" style={styles.backdrop}>
                            {userImages.length > 1 && (
                                <>
                                <button onClick={prevImage} title="Previous" className="text-white hover:text-[#8b6e4f] transition-colors"><ChevronLeft size={24} /></button>
                                <span className="text-white font-mono text-sm">{currentImageIndex + 1} / {userImages.length}</span>
                                <button onClick={nextImage} title="Next" className="text-white hover:text-[#8b6e4f] transition-colors"><ChevronRight size={24} /></button>
                                <div className="w-px h-6 bg-white/30 mx-2"></div>
                                </>
                            )}
                            <button onClick={deleteCurrentImage} title="Delete" className="text-white hover:text-red-400 transition-colors"><Trash2 size={22} /></button>
                        </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer Buttons */}
              {currentUserImage && (
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={saveImage}
                    disabled={!aiResultImage}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-semibold shadow-md transition-all ${
                        aiResultImage 
                        ? 'bg-[#8b6e4f] hover:bg-[#6d573a] text-white hover:-translate-y-1' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Download size={20} /> Save Result
                  </button>
                  <button 
                    onClick={() => toast.info("Sharing is coming soon!")}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <Share2 size={20} /> Share
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* --- RIGHT: PRODUCT SELECTOR --- */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
              <h2 className="text-xl font-bold mb-6">Select Outfit</h2>
              
              <div className="flex overflow-x-auto gap-3 pb-4 mb-4" style={styles.noScroll}>
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                        selectedCategory === cat 
                        ? 'bg-[#333] text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4 pr-2" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', ...styles.noScroll }}>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className={`flex border rounded-xl overflow-hidden p-2 transition-all duration-300 ${
                        selectedProduct?.id === product.id 
                        ? 'border-[#8b6e4f] ring-2 ring-[#8b6e4f]/20 bg-[#8b6e4f]/5' 
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-28 h-32 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
                      <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                            <p className="text-gray-500 text-xs uppercase tracking-wide">{product.category}</p>
                        </div>
                        <span className="font-bold text-lg text-[#8b6e4f]">${product.price}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleProductSelect(product)} 
                        disabled={isGeneratingAiTryOn && selectedProduct?.id === product.id}
                        className={`mt-auto w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
                            selectedProduct?.id === product.id 
                                ? (isGeneratingAiTryOn ? 'bg-gray-800 text-white cursor-wait' : 'bg-green-600 hover:bg-green-700 text-white shadow-md')
                                : 'bg-white border-2 border-[#8b6e4f] text-[#8b6e4f] hover:bg-[#8b6e4f] hover:text-white'
                        }`}
                      >
                        {isGeneratingAiTryOn && selectedProduct?.id === product.id ? (
                            <>Processing...</>
                        ) : aiResultImage && selectedProduct?.id === product.id ? (
                            <>Redo Try-On <RotateCcw size={18}/></>
                        ) : (
                            <>Try On Now <Sparkles size={18}/></>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITryOnPage;