'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/Button';

interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
}

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";

export default function ProductCard({ item }: { item: Item }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || DEFAULT_FALLBACK_IMAGE);

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/40 transition-all group h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image 
            src={imgSrc} 
            alt={item.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
        />
        {item.category && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border shadow-xs">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-5 space-y-2 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors" title={item.name}>
            {item.name}
          </h3>
          <span className="font-bold text-lg text-primary whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
          {item.description}
        </p>
        <Link href={`/items/${item._id}`} className="block mt-4 pt-2">
          <Button className="w-full rounded-xl" variant="secondary">View Details</Button>
        </Link>
      </div>
    </div>
  );
}
