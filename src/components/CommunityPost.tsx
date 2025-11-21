import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, ThumbsUp, User, Send, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Helper function to get related product images based on post tags
const getRelatedProductImage = (tag: string, index: number): string => {
  // Map tag to specific image categories
  const tagImageMap: Record<string, string[]> = {
    'SilkScarf': [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20scarf%20on%20display&sign=e15947533c5e5f1c3ec8ba01fad94b3d',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20silk%20scarf%20collection&sign=e52fea390d593a29f2174ae2ebeea5c9',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20scarf%20pattern%20detail&sign=9983fbbe843f70be8db9692d5476a95b'
    ],
    'SilkBedding': [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20bed%20sheets%20set&sign=31d48a8732e771a9a7257887cda62891',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20pillowcase%20on%20white%20background&sign=fa935bd8386d7ca6dd9dd309f9db1d6f',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20eye%20mask%20on%20display&sign=d635d8baf887bd88ce951c57e25676ec'
    ],
    'CustomSilk': [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Elegant%20silk%20dress&sign=7deff2a6c822129eddfff8cf8c763fed',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20robe%20hanging%20elegantly&sign=25de1940705efc844f0a5f5bd4f6a715',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20blouse%20on%20display&sign=6c82442e4ad0afbe09fa5d8bd6d9597a'
    ]
  };
  
  // Default images if tag not found
  const defaultImages = [
    'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20product%20display&sign=e6cea3ed9ef5a162f9e6ef59fafe2375',
    'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Luxury%20silk%20fabric&sign=9e8d8854e9f19e27167950d42375ef10',
    'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Silk%20accessories%20collection&sign=46e1af86f4063e9a553794e7034f8f1f'
  ];
  
  // Get images for the tag or use default
  const images = tagImageMap[tag] || defaultImages;
  
  // Return image based on index, with wrap-around if index exceeds array length
  return images[index % images.length];
};

// Comment interface
export interface CommentInterface {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

// Community post interface
export interface CommunityPostInterface {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  commentList: CommentInterface[];
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  relatedProducts?: string[];
}

interface CommunityPostProps {
  post: CommunityPostInterface;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onDeletePost: (postId: string) => void;
  currentUserId: string | null;
}

const CommunityPost: React.FC<CommunityPostProps> = ({ post, onLike, onSave, onAddComment, onDeleteComment, onDeletePost, currentUserId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
    >
      {/* Post header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={post.user.avatar} 
            alt={post.user.name} 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h4 className="font-semibold">{post.user.name}</h4>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="relative group">
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={20} />
          </button>
          {/* Delete post button (only visible to post owner) */}
          {post.user.id === currentUserId && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    onDeletePost(post.id);
                  }
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-2">
        <p className={`text-gray-700 mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {post.content}
        </p>
        {post.content.length > 150 && (
          <button 
            className="text-[#8b6e4f] text-sm font-medium mb-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {/* Post images */}
        {post.images.length > 0 && (
          <div className={`grid gap-1 mb-4 ${
            post.images.length === 1 ? 'grid-cols-1' : 
            post.images.length === 2 ? 'grid-cols-2' : 
            'grid-cols-3'
          }`}>
            {post.images.map((image, index) => (
              <div 
                key={index} 
                className="aspect-square overflow-hidden rounded-md"
              >
                <img 
                  src={image} 
                  alt={`Post image ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* Post tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-[#f9f7f3] text-[#8b6e4f] text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post actions */}
        <div className="flex justify-between py-2 border-t border-gray-100">
          <button 
            className="flex items-center text-gray-600 hover:text-[#8b6e4f] transition-colors"
            onClick={() => onLike(post.id)}
          >
            <Heart 
              size={18} 
              className={cn("mr-1", post.isLiked ? "fill-[#8b6e4f] text-[#8b6e4f]" : "")} 
            />
            <span>{post.likes}</span>
          </button>
          <button 
            className="flex items-center text-gray-600 hover:text-[#8b6e4f] transition-colors"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={18} className="mr-1" />
            <span>{post.comments}</span>
          </button>
          <button 
            className="flex items-center text-gray-600 hover:text-[#8b6e4f] transition-colors"
            onClick={() => onSave(post.id)}
          >
            <Bookmark 
              size={18} 
              className={cn("mr-1", post.isSaved ? "fill-[#8b6e4f] text-[#8b6e4f]" : "")} 
            />
            <span>Save</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-[#8b6e4f] transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 border-t border-gray-100"
        >
          {/* Comment input */}
          <div className="flex gap-3 mb-4">
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20profile%20avatar%20placeholder&sign=0f1555ad786b0010ca77f58852180db9" 
              alt="Your avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8b6e4f] focus:border-transparent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
            </div>
            <button 
              className="text-[#8b6e4f] hover:text-[#6d573a] p-2"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Send size={20} className={!commentText.trim() ? "opacity-50" : ""} />
            </button>
          </div>

          {/* Comments list */}
          {post.commentList.length > 0 ? (
            <div className="space-y-4">
              {post.commentList.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name} 
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {new Date(comment.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => onDeleteComment(post.id, comment.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No comments yet. Be the first to comment!
            </div>
          )}
        </motion.div>
      )}

      {/* Related products preview */}
      {post.relatedProducts && post.relatedProducts.length > 0 && !showComments && (
        <div className="px-4 pb-4">
          <h5 className="text-sm font-medium text-gray-500 mb-2">Related Products</h5>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {post.relatedProducts.slice(0, 3).map((productId, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-16 h-16 rounded-md bg-[#f9f7f3] overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img 
                  src={getRelatedProductImage(post.tags[0], index)} 
                  alt={`Related product ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityPost;