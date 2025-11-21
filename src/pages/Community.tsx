import React, { useState, useEffect, useContext } from 'react';
import { Search, Filter, TrendingUp, Clock, PlusCircle, Image as ImageIcon, Tag, ChevronDown, X, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import CommunityPost, { CommentInterface } from '@/components/CommunityPost';
import { CommunityPostInterface as CommunityPostType } from '@/components/CommunityPost';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';

// Mock comments data
const mockComments: Record<string, CommentInterface[]> = {
  '1': [
    {
      id: 'c1',
      user: {
        id: 'user4',
        name: 'Olivia Martinez',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20fashionable%20woman%20smiling&sign=77d2a267a5accb9aa1f2f053b71aaa0e'
      },
      content: 'These scarves look absolutely stunning! I love the colors and patterns. Which one is your favorite?',
      createdAt: '2025-11-10T11:45:00Z'
    },
    {
      id: 'c2',
      user: {
        id: 'user1',
        name: 'Emma Thompson',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20elegant%20woman&sign=dcba919c7d7a8cdef0d4287609a18e7b'
      },
      content: 'Thank you! The burgundy one with floral pattern is my favorite. It matches perfectly with my fall coat.',
      createdAt: '2025-11-10T12:10:00Z'
    }
  ],
  '2': [
    {
      id: 'c3',
      user: {
        id: 'user5',
        name: 'Robert Johnson',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20businessman%20confident&sign=a3be4e721b1d0063662d6c54e8d1786f'
      },
      content: 'How long have you been using these silk sheets? I\'m considering investing in a set myself.',
      createdAt: '2025-11-08T15:30:00Z'
    },
    {
      id: 'c4',
      user: {
        id: 'user2',
        name: 'James Wilson',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20sophisticated%20man&sign=93b4bcc7c3903b45fea318086112ec63'
      },
      content: 'I\'ve been using them for about 3 months now and they\'re still as soft as day one. Definitely worth the investment!',
      createdAt: '2025-11-08T16:05:00Z'
    }
  ],
  '3': []
};

// Mock community posts data
const mockCommunityPosts: CommunityPostType[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Emma Thompson',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20elegant%20woman&sign=dcba919c7d7a8cdef0d4287609a18e7b'
    },
    content: 'Just received my new silk scarf collection and I am absolutely in love! The quality is exceptional and the colors are even more beautiful in person. Perfect for the upcoming fall season!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Luxury%20silk%20scarf%20collection&sign=35eec5c23fcde3ad9d8b28e7a4cf3fec',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20on%20woman%27s%20neck&sign=55835803c8f5d7dfa6da1b630d697c49',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20detail%20pattern&sign=4efba56d7e408d8746205e67f8479605'
    ],
    tags: ['SilkScarf', 'FallFashion', 'LuxuryAccessories'],
    likes: 128,
    comments: 2,
    commentList: mockComments['1'],
    isLiked: false,
    isSaved: false,
    createdAt: '2025-11-10T10:30:00Z',
    relatedProducts: ['prod1', 'prod2', 'prod3']
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'James Wilson',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20sophisticated%20man&sign=93b4bcc7c3903b45fea318086112ec63'
    },
    content: 'My experience with Silk Garden\'s silk bed sheets has been incredible. The fabric is so soft and comfortable, I\'ve never slept better. Highly recommend to anyone looking for a luxury sleep experience!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Luxury%20silk%20bed%20sheets%20on%20bed&sign=d8f990a51423a243828df1694ec47ecf',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Elegant%20bedroom%20with%20silk%20bedding&sign=7a3144ff9ed1c2f7218f39bb07b043fd'
    ],
    tags: ['SilkBedding', 'LuxurySleep', 'HomeComfort'],
    likes: 96,
    comments: 2,
    commentList: mockComments['2'],
    isLiked: true,
    isSaved: false,
    createdAt: '2025-11-08T14:45:00Z',
    relatedProducts: ['prod4', 'prod5']
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Sophia Chen',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20fashionable%20young%20woman&sign=5a4d150d3a7e8b426241dc29be186fbb'
    },
    content: 'I had my silk dress custom made for a special occasion and it turned out absolutely stunning! The craftsmanship is impeccable and the fabric feels amazing against my skin. Worth every penny!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Elegant%20silk%20dress%20on%20mannequin&sign=170839d0a0274ee36cc0dd4b5e3aa0fd',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20dress%20fashion%20model%20wearing&sign=8946c5c06916c8b5611d4ad38502d8b0',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20dress%20fabric%20detail&sign=7ac53100229f18a3173f9389af8a034c'
    ],
    tags: ['CustomSilk', 'EveningGown', 'SpecialOccasion'],
    likes: 215,
    comments: 0,
    commentList: mockComments['3'],
    isLiked: false,
    isSaved: true,
    createdAt: '2025-11-05T09:15:00Z',
    relatedProducts: ['prod6', 'prod7']
  },
  {
    id: '4',
    user: {
      id: 'user6',
      name: 'Olivia Wang',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20beautiful%20asian%20woman&sign=8abf6cec5daab753713c510f914a792f'
    },
    content: 'The silk pajama set I purchased last month has completely transformed my sleep quality. The fabric is so smooth and breathable, perfect for all seasons. I love how it feels against my skin!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Luxury%20silk%20pajama%20set%20on%20bed&sign=063eac2b05a21a6b6f922aa7895fdb00',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20pajamas%20fabric%20detail%20texture&sign=77860ee624bba6e9b3de989a5526b78e'
    ],
    tags: ['SilkPajamas', 'Sleepwear', 'LuxuryLoungewear'],
    likes: 178,
    comments: 3,
    commentList: [],
    isLiked: true,
    isSaved: false,
    createdAt: '2025-11-12T20:30:00Z',
    relatedProducts: ['prod8', 'prod9']
  },
  {
    id: '5',
    user: {
      id: 'user7',
      name: 'David Kim',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20stylish%20asian%20man&sign=dd466675918910c1aa40f207a5c8221f'
    },
    content: 'Sharing some tips on how to properly care for your silk scarves to keep them looking beautiful for years. Always hand wash with mild detergent and air dry flat to maintain the fabric quality!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20scarf%20care%20instructions&sign=e44eb2a40919a1f18d22b41d90473bb2',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Hand%20washing%20silk%20scarf%20carefully&sign=f27a092b8131ed2a49cff11f93df05b1',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Folding%20silk%20scarf%20properly%20storage&sign=d416bfe763ec06f616f22500f46030c6'
    ],
    tags: ['SilkCare', 'SilkScarf', 'FashionTips'],
    likes: 143,
    comments: 5,
    commentList: [],
    isLiked: false,
    isSaved: true,
    createdAt: '2025-11-11T15:45:00Z',
    relatedProducts: ['prod10', 'prod11', 'prod12']
  },
  {
    id: '6',
    user: {
      id: 'user8',
      name: 'Isabella Garcia',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Portrait%20of%20fashionable%20hispanic%20woman&sign=443256f2a04dae6c258701516fb7ecc1'
    },
    content: 'My silk shirt collection has become my go-to for both professional and casual occasions. Here are some of my favorite ways to style them - from pairing with blazers for work to dressing down with jeans for weekends!',
     images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20shirt%20professional%20work%20outfit&sign=9c31aedfefb1d6dee97d2772c90f4272',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20shirt%20casual%20weekend%20style&sign=218d073b369bd1a5a996067f7d686476',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Silk%20shirt%20collection%20display&sign=112fcfd940659416f1af902d70c3bfec'
    ],
    tags: ['SilkShirt', 'FashionStyling', 'WardrobeEssentials'],
    likes: 201,
    comments: 4,
    commentList: [],
    isLiked: false,
    isSaved: false,
    createdAt: '2025-11-09T18:20:00Z',
    relatedProducts: ['prod13', 'prod14']
  }
];

// Available tags for filtering
const availableTags = [
  'SilkScarf', 'SilkDress', 'SilkBedding', 'SilkAccessories', 
  'CustomSilk', 'LuxuryFashion', 'HomeDecor', 'FallFashion', 
  'SummerStyle', 'GiftIdeas'
];

const Community: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState<CommunityPostType[]>(mockCommunityPosts);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPostType[]>(mockCommunityPosts);
  const [sortBy, setSortBy] = useState<'trending' | 'latest'>('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentUserId] = useState('current-user'); // Mock current user ID
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    tags: [] as string[]
  });

  // Apply filters and sorting
  useEffect(() => {
    let result = [...posts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }
    
    // Apply sorting
    if (sortBy === 'trending') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    setFilteredPosts(result);
  }, [posts, searchTerm, selectedTags, sortBy]);

  // Handle like post
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            } 
          : post
      )
    );
  };

  // Handle save post
  const handleSavePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved } 
          : post
      )
    );
  };

  // Handle delete post
  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  // Handle add comment
  const handleAddComment = (postId: string, content: string) => {
    const newComment: CommentInterface = {
      id: `comment-${Date.now()}`,
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20profile%20avatar%20placeholder&sign=0f1555ad786b0010ca77f58852180db9'
      },
      content: content,
      createdAt: new Date().toISOString()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: post.comments + 1,
              commentList: [newComment, ...post.commentList]
            } 
          : post
      )
    );
  };

  // Handle delete comment
  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: Math.max(0, post.comments - 1),
              commentList: post.commentList.filter(comment => comment.id !== commentId)
            } 
          : post
      )
    );
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag) 
        : [...prevTags, tag]
    );
  };

  // Handle image upload for new post
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      const remainingSlots = 9 - newPost.images.length;
      const imagesToAdd = newImages.slice(0, remainingSlots);
      
      // Create image previews
      const previews = imagesToAdd.map(file => URL.createObjectURL(file));
      
      setNewPost(prev => ({
        ...prev,
        images: [...prev.images, ...imagesToAdd],
        imagePreviews: [...prev.imagePreviews, ...previews]
      }));
    }
  };

  // Handle remove image from new post
  const handleRemoveImage = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  // Handle new post tag input
  const handleNewPostTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      if (!newPost.tags.includes(tag)) {
        setNewPost(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  // Handle remove tag from new post
  const handleRemoveNewPostTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle create new post
  const handleCreatePost = () => {
    if (!newPost.content.trim() && newPost.images.length === 0) {
      return;
    }

    const postToAdd: CommunityPostType = {
      id: `new-${Date.now()}`,
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20profile%20avatar%20placeholder&sign=0f1555ad786b0010ca77f58852180db9'
      },
      content: newPost.content,
      images: newPost.imagePreviews, // In a real app, these would be uploaded to a server
      tags: newPost.tags,
      likes: 0,
      comments: 0,
      commentList: [],
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [postToAdd, ...prev]);
    
    // Reset new post form
    setNewPost({
      content: '',
      images: [],
      imagePreviews: [],
      tags: []
    });
    
    setShowCreatePostModal(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#f9f7f3] text-[#333]'}`}>
      {/* Community Header */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Silk Community</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Share your silk experiences, styling tips, and product reviews with our community
          </p>
        </div>
      </div>

      {/* Community Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, users, or tags..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* Filter dropdown */}
                {showFilterMenu && (
                  <div className="absolute z-50 mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          className={`px-3 py-1 text-sm rounded-full ${
                            selectedTags.includes(tag)
                              ? 'bg-[#8b6e4f] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button 
                          className="text-sm text-[#8b6e4f] font-medium"
                          onClick={() => setSelectedTags([])}
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sort button */}
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                onClick={() => setSortBy(prev => prev === 'trending' ? 'latest' : 'trending')}
              >
                {sortBy === 'trending' ? <TrendingUp size={18} /> : <Clock size={18} />}
                <span>{sortBy === 'trending' ? 'Trending' : 'Latest'}</span>
              </button>
              
               {/* Create post button (only visible to authenticated users) */}
               {isAuthenticated ? (
                 <button 
                   className="flex items-center gap-2 px-4 py-2 bg-[#8b6e4f] text-white rounded-lg hover:bg-[#6d573a] transition-colors"
                   onClick={() => setShowCreatePostModal(true)}
                 >
                   <PlusCircle size={18} />
                   <span>Post</span>
                 </button>
               ) : (
                 <button 
                   className="flex items-center gap-2 px-4 py-2 bg-[#8b6e4f] text-white rounded-lg hover:bg-[#6d573a] transition-colors"
                   onClick={() => {
                     alert('Please log in to create a post');
                   }}
                 >
                   <PlusCircle size={18} />
                   <span>Log in to Post</span>
                 </button>
               )}
            </div>
          </div>
          
          {/* Active filters display */}
          {selectedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <div 
                  key={tag} 
                  className="flex items-center gap-1 bg-[#8b6e4f] bg-opacity-10 text-[#8b6e4f] px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button 
                    className="ml-1 hover:text-[#6d573a]"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
               <CommunityPost 
                 key={post.id} 
                 post={post} 
                 onLike={handleLikePost} 
                 onSave={handleSavePost}
                 onAddComment={handleAddComment}
                 onDeleteComment={handleDeleteComment}
                 onDeletePost={handleDeletePost}
                 currentUserId={isAuthenticated ? currentUserId : null}
               />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No posts found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Create New Post</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCreatePostModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Content input */}
              <div className="mb-6">
                <textarea
                  placeholder="Share your silk experience..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent min-h-[120px]"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              
              {/* Image upload */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Add photos (max 9)
                </label>
                <div className="flex flex-wrap gap-2">
                  {/* Image previews */}
                  {newPost.imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button 
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload button */}
                  {newPost.images.length < 9 && (
                    <label className="w-24 h-24 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                      <ImageIcon size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add photos</span>
                    </label>
                  )}
                </div>
                {newPost.images.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    {newPost.images.length} of 9 photos added
                  </p>
                )}
              </div>
              
              {/* Tags */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Add tags (press Enter to add)
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {newPost.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-[#8b6e4f] bg-opacity-10 text-[#8b6e4f] px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                      <button 
                        className="ml-1 hover:text-[#6d573a]"
                        onClick={() => handleRemoveNewPostTag(tag)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 max-w-xs px-4 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent"
                    onKeyDown={handleNewPostTagInput}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowCreatePostModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-[#8b6e4f] text-white rounded-lg hover:bg-[#6d573a] transition-colors"
                onClick={handleCreatePost}
                disabled={!newPost.content.trim() && newPost.images.length === 0}
              >
                Share Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;