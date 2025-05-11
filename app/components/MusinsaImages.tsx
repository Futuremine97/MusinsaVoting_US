"use client";
import React, { useEffect, useState } from "react";

export default function MusinsaImages({ keyword = "반팔티" }: { keyword?: string }) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/musinsa-images?keyword=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(data => setImages(data.images));
  }, [keyword]);

  return (
    <div>
      {images.map((img, idx) => (
        <img key={idx} src={img} alt="무신사 상품" style={{ width: 120, marginRight: 8 }} />
      ))}
    </div>
  );
}