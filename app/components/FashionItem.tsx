'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

interface FashionItemProps {
  item: {
    id: string;
    title: string;
    imageUrls: string[];
    likes: number;
    isLiked: boolean;
    description: string;
    timestamp: string;
    price?: string;
    comments: Comment[];
    userId: string;
    userName: string;
  };
  onLike: (id: string) => void;
}

export default function FashionItem({ item, onLike }: FashionItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Here you would typically make an API call to save the comment
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        <div>
          <p className="font-semibold">{item.userName}</p>
          <p className="text-sm text-gray-500">{formatDate(item.timestamp)}</p>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative aspect-square">
        <Image
          src={item.imageUrls[currentImageIndex]}
          alt={item.title}
          fill
          className="object-cover"
        />
        {item.imageUrls.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev < item.imageUrls.length - 1 ? prev + 1 : prev))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
              disabled={currentImageIndex === item.imageUrls.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {item.imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => onLike(item.id)}
            className={`flex items-center space-x-1 ${
              item.isLiked ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            <Heart className={`w-6 h-6 ${item.isLiked ? 'fill-current' : ''}`} />
            <span>{item.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500"
          >
            <MessageCircle className="w-6 h-6" />
            <span>{item.comments.length}</span>
          </button>
          <button className="text-gray-500">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">{item.title}</h3>
          {item.price && (
            <p className="text-gray-600 mb-2">Price: {item.price}</p>
          )}
          <p className="text-gray-700">{item.description}</p>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4">
            <div className="space-y-3 mb-4">
              {item.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold text-sm">{comment.userId}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 