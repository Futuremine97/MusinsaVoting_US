// components/MusinsaTicker.tsx
"use client";
import React, { useRef, useEffect } from "react";

const musinsaRanks = [
  { rank: 1, keyword: "반팔티" },
  { rank: 2, keyword: "슬랙스" },
  { rank: 3, keyword: "셔츠" },
  { rank: 4, keyword: "반바지" },
  { rank: 5, keyword: "청바지" },
  { rank: 6, keyword: "운동화" },
  { rank: 7, keyword: "모자" },
  { rank: 8, keyword: "맨투맨" },
  { rank: 9, keyword: "후드티" },
  { rank: 10, keyword: "샌들" },
];

export default function MusinsaTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
    let animationId: number;
    let left = 0;

    function animate() {
      left -= 1;
      if (ticker.scrollWidth + left < ticker.parentElement!.offsetWidth) {
        left = 0;
      }
      ticker.style.transform = `translateX(${left}px)`;
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        background: "#222",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
        width: "100%",
        borderBottom: "2px solid #444",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div ref={tickerRef} style={{ display: "inline-block" }}>
        {musinsaRanks.map((item) => (
          <span
            key={item.rank}
            style={{
              display: "inline-block",
              marginRight: "2rem",
              color: "#ffd700",
            }}
          >
            {item.rank}위 <span style={{ color: "#fff" }}>{item.keyword}</span>
          </span>
        ))}
        {/* 무한 반복 효과를 위해 한 번 더 출력 */}
        {musinsaRanks.map((item) => (
          <span
            key={item.rank + "-repeat"}
            style={{
              display: "inline-block",
              marginRight: "2rem",
              color: "#ffd700",
            }}
          >
            {item.rank}위 <span style={{ color: "#fff" }}>{item.keyword}</span>
          </span>
        ))}
      </div>
    </div>
  );
}