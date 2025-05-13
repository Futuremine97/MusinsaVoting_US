import { Suspense } from 'react';
import FashionGrid from './components/FashionGrid';
import MusinsaTicker from "./components/MusinsaTicker";
import MusinsaImages from "./components/MusinsaImages";
import NasdaqScatterChart from "./components/NasdaqScatterChart";


export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">K-fashion Archieve</h1>
      <MusinsaTicker />
      <Suspense fallback={<div>Loading...</div>}>
        <FashionGrid />
      </Suspense>
      <h2>무신사 인기 상품</h2>
      <MusinsaImages keyword="남자 코트" />
      <NasdaqScatterChart />
    </main>
  );
} 