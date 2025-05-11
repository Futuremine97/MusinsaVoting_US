import { Suspense } from 'react';
import FashionGrid from './components/FashionGrid';
import MusinsaTicker from "@/components/MusinsaTicker";


export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">K-fashion Archieve</h1>
      <MusinsaTicker />
      <Suspense fallback={<div>Loading...</div>}>
        <FashionGrid />
      </Suspense>
    </main>
  );
} 