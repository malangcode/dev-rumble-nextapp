// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[80vh] px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-4">
        Welcome to SmartCanteen 🍽️
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-8">
        A modern, efficient, and smart canteen management system designed for colleges to manage orders, stock, and payments seamlessly.
      </p>

      <div className="space-x-4">
        <Link href="/menu">
          <Button size="lg">Order Now</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">Login</Button>
        </Link>
      </div>

      <div className="mt-10 text-sm text-gray-400">
        Built with ❤️ by Rahish Sheikh | Powered by Next.js + Tailwind
      </div>
    </section>
  );
}
