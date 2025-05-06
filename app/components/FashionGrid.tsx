'use client';

import { useState, useEffect } from 'react';
import FashionItem from './FashionItem';

interface FashionItem {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  description: string;
  timestamp: string;
}

export default function FashionGrid() {
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/fashion');
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fashion items:', error);
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {items.map((item) => (
        <FashionItem
          key={item.id}
          item={item}
          onLike={handleLike}
        />
      ))}
    </div>
  );
} 