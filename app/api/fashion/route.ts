import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function scrapeMusinsaItems() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 코트 카테고리 URL
    const coatUrl = 'https://www.musinsa.com/categories/item/005';
    await page.goto(coatUrl, { waitUntil: 'networkidle0' });

    // 상품 정보 수집
    const items = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.li_box');
      return Array.from(productElements).map((element, index) => {
        const imgElement = element.querySelector('img');
        const titleElement = element.querySelector('.list_info a');
        const priceElement = element.querySelector('.price');
        
        return {
          id: `coat-${index + 1}`,
          title: titleElement?.textContent?.trim() || `Coat Item ${index + 1}`,
          imageUrl: imgElement?.getAttribute('src') || '',
          likes: Math.floor(Math.random() * 1000),
          isLiked: false,
          description: 'Trendy coat for this season',
          timestamp: new Date().toISOString(),
          price: priceElement?.textContent?.trim() || '가격 정보 없음'
        };
      }).slice(0, 20); // 상위 20개 아이템만 가져오기
    });

    return items;
  } catch (error) {
    console.error('Error scraping Musinsa:', error);
    return [];
  } finally {
    await browser.close();
  }
}

export async function GET() {
  try {
    const items = await scrapeMusinsaItems();
    
    if (items.length === 0) {
      // 스크래핑 실패 시 임시 데이터 반환
      return NextResponse.json(generateMockItems());
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in fashion API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fashion items' },
      { status: 500 }
    );
  }
}

// 임시 데이터 생성 함수 (폴백용)
function generateMockItems() {
  const items = [];
  const fashionImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  ];

  for (let i = 1; i <= 20; i++) {
    const imageIndex = (i - 1) % fashionImages.length;
    items.push({
      id: `item-${i}`,
      title: `Trendy Coat ${i}`,
      imageUrl: fashionImages[imageIndex],
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      description: 'Stylish coat for your winter collection',
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      price: `${Math.floor(Math.random() * 200000) + 100000}원`
    });
  }
  return items;
} 