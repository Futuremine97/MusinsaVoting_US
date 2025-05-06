import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://www.musinsa.com/brands/musinsastandard');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const items = $('.list-item').map((_, element) => {
      const $element = $(element);
      return {
        id: $element.attr('data-goods-no') || Math.random().toString(),
        title: $element.find('.list_info a').text().trim(),
        imageUrl: $element.find('.list_img img').attr('data-original') || '',
        votes: Math.floor(Math.random() * 100), // Placeholder for votes
      };
    }).get();

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching fashion items:', error);
    return NextResponse.json({ error: 'Failed to fetch fashion items' }, { status: 500 });
  }
} 