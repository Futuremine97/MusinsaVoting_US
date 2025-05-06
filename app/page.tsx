import { Suspense } from 'react';
import FashionGrid from './components/FashionGrid';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Musinsa Fashion Voting</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <FashionGrid />
      </Suspense>
    </main>
  );
} 