'use client';

import Image from 'next/image';
import { useState } from 'react';

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
    imageUrl: string;
    likes: number;
    isLiked: boolean;
    description: string;
    timestamp: string;
    price: string;
    comments: Comment[];
  };
  onLike: (id: string) => void;
}

export default function FashionItem({ item, onLike }: FashionItemProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [likes, setLikes] = useState(item.likes);
  const [imageError, setImageError] = useState(false);
  const [comments, setComments] = useState<Comment[]>(item.comments);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike(item.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      content: newComment,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  // Format timestamp to a simple date string
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      {/* Header */}
      <div className="p-4 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-xs text-gray-500">
            {formatDate(item.timestamp)}
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        {!imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">이미지를 불러올 수 없습니다</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <button
            onClick={handleLike}
            className="mr-4 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isLiked ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <span className="font-semibold">{likes.toLocaleString()} likes</span>
        </div>
        <p className="text-sm mb-2">
          <span className="font-semibold mr-2">{item.title}</span>
          {item.description}
        </p>
        <p className="text-sm font-semibold text-gray-800 mb-4">{item.price}</p>

        {/* Comments Section */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">댓글 {comments.length}개</h4>
          <div className="space-y-2 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.userId}</span>
                {comment.content}
              </div>
            ))}
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              게시
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 