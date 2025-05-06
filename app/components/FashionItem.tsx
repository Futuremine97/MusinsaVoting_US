'use client';

import Image from 'next/image';

interface FashionItemProps {
  item: {
    id: string;
    title: string;
    imageUrl: string;
    votes: number;
  };
  onVote: () => void;
}

export default function FashionItem({ item, onVote }: FashionItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Votes: {item.votes}</span>
          <button
            onClick={onVote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
} 