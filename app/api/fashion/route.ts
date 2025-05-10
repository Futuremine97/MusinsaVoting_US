import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import FashionItem from '@/models/FashionItem';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

interface ShoppingLink {
  title: string;
  url: string;
  price: string;
  platform: string;
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
  shoppingLinks?: ShoppingLink[];
}

// 임시 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let fashionItems: FashionItem[] = [];

// 임시 쇼핑 링크 생성 함수 (실제로는 이미지 분석 API를 사용해야 합니다)
function generateShoppingLinks(title: string): ShoppingLink[] {
  const platforms = [
    {
      name: 'Musinsa',
      url: 'https://www.musinsa.com/search/musinsa/goods?q=',
      domain: 'musinsa.com'
    },
    {
      name: '29CM',
      url: 'https://www.29cm.co.kr/search?keyword=',
      domain: '29cm.co.kr'
    },
    {
      name: 'W Concept',
      url: 'https://www.wconcept.co.kr/Search?keyword=',
      domain: 'wconcept.co.kr'
    },
    {
      name: 'SSENSE',
      url: 'https://www.ssense.com/en-us/search?q=',
      domain: 'ssense.com'
    },
    {
      name: 'ZARA',
      url: 'https://www.zara.com/kr/ko/search?searchTerm=',
      domain: 'zara.com'
    },
    {
      name: 'H&M',
      url: 'https://www2.hm.com/ko_kr/search-results.html?q=',
      domain: 'hm.com'
    }
  ];
  
  const links: ShoppingLink[] = [];
  
  platforms.forEach(platform => {
    links.push({
      title: `${title} on ${platform.name}`,
      url: `${platform.url}${encodeURIComponent(title)}`,
      price: `${Math.floor(Math.random() * 200000) + 100000}원`,
      platform: platform.name
    });
  });
  
  return links;
}

function generateInitialItems(): FashionItem[] {
  const items = [];
  const fashionImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  ];

  const sampleComments: Comment[] = [
    { id: '1', userId: 'user1', content: 'What a beautiful coat!', timestamp: new Date().toISOString() },
    { id: '2', userId: 'user2', content: 'The price is a bit high', timestamp: new Date().toISOString() },
    { id: '3', userId: 'user3', content: 'I love the color', timestamp: new Date().toISOString() },
  ];

  const coatTitles = [
    'Classic Double Coat',
    'Oversized Trench Coat',
    'Wool Blend Long Coat',
    'Cashmere Blend Coat',
    'Basic Single Coat',
    'Check Pattern Coat',
    'Light Weight Coat',
    'Crop Coat',
    'Hooded Coat',
    'Padded Coat'
  ];

  for (let i = 1; i <= 5; i++) {
    const imageIndex = (i - 1) % fashionImages.length;
    const titleIndex = (i - 1) % coatTitles.length;
    const title = coatTitles[titleIndex];
    items.push({
      id: `item-${i}`,
      title,
      imageUrls: [fashionImages[imageIndex], fashionImages[(imageIndex + 1) % fashionImages.length]],
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      description: 'Stylish coat for your winter collection',
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      price: `${Math.floor(Math.random() * 200000) + 100000}원`,
      comments: [...sampleComments],
      userId: `user${i}`,
      userName: `User ${i}`,
      shoppingLinks: generateShoppingLinks(title)
    });
  }
  return items;
}

// 초기 데이터 생성
fashionItems = generateInitialItems();

export async function GET() {
  try {
    return NextResponse.json(fashionItems);
  } catch (error) {
    console.error('Error in fashion API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fashion items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    await connectDB();
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('images') as File[];

    if (!userId || !userName || !description || files.length === 0) {
      return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 });
    }

    if (!userId || !userName || !description || files.length === 0) {
      return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 });
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const blob = await put(`fashion/${uuidv4()}-${file.name}`, file, { access: 'public' });
        return blob.url;
      })
    );

    const shoppingLinks = generateLinks(description);

    const newItem = new FashionItem({
      userId,
      userName,
      imageUrls,
      description,
      comments: [],
      shoppingLinks,
    });

    await newItem.save();
    return NextResponse.json(newItem);
  }
