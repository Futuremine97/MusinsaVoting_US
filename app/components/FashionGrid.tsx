'use client';

import { useState, useEffect } from 'react';
import FashionItem from './FashionItem';
import UploadForm from './UploadForm';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

interface FashionItem {
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
  shoppingLinks?: {
    title: string;
    url: string;
    price: string;
    platform: string;
  }[];
}

export default function FashionGrid() {
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/fashion');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLike = async (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked,
            }
          : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <UploadForm />
      <div className="space-y-8">
        {items.map(item => (
          <FashionItem
            key={item.id}
            item={item}
            onLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
} 