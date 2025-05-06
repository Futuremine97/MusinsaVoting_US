import { NextResponse } from 'next/server';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

interface FashionItem {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  description: string;
  timestamp: string;
  price: string;
  comments: Comment[];
}

function generateMockItems(): FashionItem[] {
  const items = [];
  const fashionImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  ];

  const sampleComments = [
    { id: '1', userId: 'user1', content: '정말 예쁜 코트네요!', timestamp: new Date().toISOString() },
    { id: '2', userId: 'user2', content: '가격이 좀 비싸네요', timestamp: new Date().toISOString() },
    { id: '3', userId: 'user3', content: '색상이 마음에 들어요', timestamp: new Date().toISOString() },
  ];

  const coatTitles = [
    '클래식 더블 코트',
    '오버사이즈 트렌치 코트',
    '울 블렌디드 롱 코트',
    '캐시미어 블렌드 코트',
    '베이직 싱글 코트',
    '체크 패턴 코트',
    '라이트 웨이트 코트',
    '크롭 코트',
    '후드 코트',
    '패딩 코트'
  ];

  for (let i = 1; i <= 20; i++) {
    const imageIndex = (i - 1) % fashionImages.length;
    const titleIndex = (i - 1) % coatTitles.length;
    items.push({
      id: `item-${i}`,
      title: coatTitles[titleIndex],
      imageUrl: fashionImages[imageIndex],
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      description: 'Stylish coat for your winter collection',
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      price: `${Math.floor(Math.random() * 200000) + 100000}원`,
      comments: [...sampleComments]
    });
  }
  return items;
}

export async function GET() {
  try {
    const items = generateMockItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in fashion API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fashion items' },
      { status: 500 }
    );
  }
} 