import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
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
}

// 임시 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let fashionItems: FashionItem[] = [];

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
    items.push({
      id: `item-${i}`,
      title: coatTitles[titleIndex],
      imageUrls: [fashionImages[imageIndex], fashionImages[(imageIndex + 1) % fashionImages.length]],
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      description: 'Stylish coat for your winter collection',
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      price: `${Math.floor(Math.random() * 200000) + 100000}원`,
      comments: [...sampleComments],
      userId: `user${i}`,
      userName: `User ${i}`
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
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const files = formData.getAll('images') as File[];

    if (!title || !description || files.length === 0) {
      return NextResponse.json(
        { error: 'Title, description, and at least one image are required' },
        { status: 400 }
      );
    }

    // Upload images to Vercel Blob Storage
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const blob = await put(`fashion/${uuidv4()}-${file.name}`, file, {
          access: 'public',
        });
        return blob.url;
      })
    );

    // Here you would typically save the post data to your database
    // For now, we'll just return the uploaded image URLs
    return NextResponse.json({
      success: true,
      imageUrls,
      title,
      description,
      price,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Error uploading images' },
      { status: 500 }
    );
  }
} 