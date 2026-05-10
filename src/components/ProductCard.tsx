import { Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
import { brl } from "@/lib/format";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string | null;
  images?: string[];
};

export function ProductCard({ p }: { p: ProductCardData }) {
<<<<<<< HEAD
  const images =
    p.images && p.images.length > 0
      ? p.images
      : p.image
      ? [p.image]
      : [];
=======
  const images = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
<<<<<<< HEAD
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
=======
    const offset = Math.floor(Math.random() * 1500);
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3000 + offset);
    return () => clearInterval(t);
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
  }, [images.length]);

  return (
    <Link
      to="/produto/$id"
      params={{ id: p.id }}
      className={
        "group block bg-card rounded-2xl overflow-hidden " +
        "shadow-card hover:shadow-soft transition-all hover:-translate-y-1 min-w-0"
      }
    >
<<<<<<< HEAD
      <div className="aspect-square bg-gradient-blossom overflow-hidden relative">
=======
      <div className="relative aspect-square bg-gradient-blossom overflow-hidden">
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
        {images.length > 0 ? (
          <>
            {images.map((src, i) => (
              <img
<<<<<<< HEAD
                key={i}
                src={src}
                alt={p.name}
                className={
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 " +
=======
                key={src + i}
                src={src}
                alt={p.name}
                className={
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 " +
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
                  (i === idx ? "opacity-100" : "opacity-0")
                }
                loading="lazy"
              />
            ))}
            {images.length > 1 && (
<<<<<<< HEAD
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
=======
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={
<<<<<<< HEAD
                      "block h-1.5 rounded-full transition-all duration-300 " +
=======
                      "block h-1.5 rounded-full transition-all " +
>>>>>>> 6fb586b1ee87f81d33a4714d692640778326094c
                      (i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60")
                    }
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground/50 font-script text-2xl sm:text-3xl">
            sem foto
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 min-w-0">
        <h3 className="font-display text-base sm:text-lg text-foreground line-clamp-2 leading-tight break-words">
          {p.name}
        </h3>
        <p className="text-primary font-medium mt-1 text-sm sm:text-base truncate">
          {brl(Number(p.price))}
        </p>
      </div>
    </Link>
  );
}
