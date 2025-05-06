'use client';

interface SortControlsProps {
  sortBy: 'votes' | 'newest';
  onSortChange: (sort: 'votes' | 'newest') => void;
}

export default function SortControls({ sortBy, onSortChange }: SortControlsProps) {
  return (
    <div className="mb-6 flex justify-end">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'votes' | 'newest')}
        className="border rounded px-3 py-2"
      >
        <option value="votes">Most Voted</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
} 