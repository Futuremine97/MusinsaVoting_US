'use client';

import { useState, useEffect } from 'react';
import FashionItem from './FashionItem';
import SortControls from './SortControls';

interface FashionItem {
  id: string;
  title: string;
  imageUrl: string;
  votes: number;
}

export default function FashionGrid() {
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');

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

  const handleVote = async (id: string) => {
    try {
      const response = await fetch(`/api/fashion/${id}/vote`, {
        method: 'POST',
      });
      if (response.ok) {
        setItems(items.map(item =>
          item.id === id ? { ...item, votes: item.votes + 1 } : item
        ));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes;
    }
    return 0; // Add more sorting logic as needed
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item) => (
          <FashionItem
            key={item.id}
            item={item}
            onVote={() => handleVote(item.id)}
          />
        ))}
      </div>
    </div>
  );
} 