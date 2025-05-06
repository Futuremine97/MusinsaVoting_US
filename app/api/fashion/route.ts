import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://www.musinsa.com/brands/musinsastandard', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const items = $('.li_box').map((_, element) => {
      const $element = $(element);
      const title = $element.find('.item_title').text().trim();
      const imageUrl = $element.find('.list_img img').attr('data-original') || 
                      $element.find('.list_img img').attr('src') || '';
      const id = $element.attr('data-goods-no') || Math.random().toString();

      // Skip items without proper data
      if (!title || !imageUrl) {
        return null;
      }

      return {
        id,
        title,
        imageUrl: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
        votes: Math.floor(Math.random() * 100), // Placeholder for votes
      };
    }).get().filter(Boolean); // Remove null items

    if (items.length === 0) {
      console.error('No items found in the response');
      return NextResponse.json({ error: 'No items found' }, { status: 404 });
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching fashion items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch fashion items', details: errorMessage },
      { status: 500 }
    );
  }
} 