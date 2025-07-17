'use client';

import Image from 'next/image';

interface FoodCardProps {
  imageSrc: string;
  name: string;
  description: string;
  price: number;
  onAddToCart: () => void;
}

export function FoodCard({ imageSrc, name, description, price, onAddToCart }: FoodCardProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-[var(--bg-card)] flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover rounded-t"
          priority
        />
      </div>
      <div className="px-4 py-4 flex-grow flex flex-col">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className="text-[var(--text-secondary)] text-base flex-grow">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-green-700">Rs {price.toFixed(2)}</span>
          <button
            onClick={onAddToCart}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-[var(--color-primary)] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
