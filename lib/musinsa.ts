// lib/musinsa.ts
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function getMusinsaImages(keyword: string) {
  const url = `https://www.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(keyword)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  const images: string[] = [];
  $(".li_box .list_img img").each((_, el) => {
    const src = $(el).attr("data-original") || $(el).attr("src");
    if (src) images.push(src);
  });

  return images.slice(0, 5);
}