'use client';

import { useEffect, useState } from 'react';
import { FoodCard } from '@/components/FoodCard';
import { FoodCardSkeleton } from '@/components/FoodCardSkeleton';

export default function Menu() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (foodName: string) => {
    console.log(`${foodName} added to cart`);
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
      <FoodCard
        imageSrc="/images/pizza.jpg"
        name="Margherita Pizza"
        description="Classic pizza with tomato, mozzarella, and basil."
        price={299}
        onAddToCart={() => handleAddToCart('Margherita Pizza')}
      />
      <FoodCard
        imageSrc="/images/burger.jpg"
        name="Cheeseburger"
        description="Juicy burger with cheese, lettuce, and tomato."
        price={199}
        onAddToCart={() => handleAddToCart('Cheeseburger')}
      />
      <FoodCard
        imageSrc="/images/pasta.jpg"
        name="Penne Alfredo"
        description="Creamy Alfredo pasta with mushrooms."
        price={249}
        onAddToCart={() => handleAddToCart('Penne Alfredo')}
      />
      <FoodCard
        imageSrc="/images/sample.jpg"
        name="Penne Alfredo"
        description="Creamy Alfredo pasta with mushrooms."
        price={249}
        onAddToCart={() => handleAddToCart('Penne Alfredo')}
      />
      <FoodCard
        imageSrc="/images/sample.jpg"
        name="Penne Alfredo"
        description="Creamy Alfredo pasta with mushrooms."
        price={249}
        onAddToCart={() => handleAddToCart('Penne Alfredo')}
      />
    </div>
  );
}
