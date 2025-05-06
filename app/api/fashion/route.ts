import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// 임시 데이터 생성 함수
function generateMockItems() {
  const items = [];
  for (let i = 1; i <= 100; i++) {
    items.push({
      id: `item-${i}`,
      title: `Fashion Item ${i}`,
      imageUrl: `https://picsum.photos/seed/${i}/800/800`, // 랜덤 이미지
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      description: `Stylish fashion item ${i} for your collection`,
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  }
  return items;
}

export async function GET() {
  try {
    const items = generateMockItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error generating fashion items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate fashion items', details: errorMessage },
      { status: 500 }
    );
  }
} 