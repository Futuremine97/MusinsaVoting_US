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

  const images: { src: string; name: string }[] = [];
  $(".li_box").each((_, el) => {
    const img = $(el).find(".list_img img");
    const name = $(el).find(".article_info .list_info a").text().trim();
    const src = img.attr("data-original") || img.attr("src");
    if (src && name && name.includes(keyword)) {
      images.push({ src, name });
    }
  });

  // 만약 연관 상품이 너무 적으면, 키워드 포함 여부와 상관없이 상위 5개를 추가로 보충
  if (images.length < 5) {
    $(".li_box .list_img img").each((_, el) => {
      const src = $(el).attr("data-original") || $(el).attr("src");
      if (src && !images.find(i => i.src === src)) {
        images.push({ src, name: "" });
      }
    });
  }

  // 이미지 URL만 반환
  return images.slice(0, 5).map(i => i.src);
}