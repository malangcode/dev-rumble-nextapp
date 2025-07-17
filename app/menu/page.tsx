"use client";

import { useEffect, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { FoodCard } from "@/components/FoodCard";
import { FoodCardSkeleton } from "@/components/FoodCardSkeleton";
import PopupMessage from "@/components/PopupMessage";
import { useNotification } from "@/context/messageContext";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  desc: string;
  image: string;
  price: string;
  category: number;
};

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(500);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosWithCsrf.get("/api/categories/");
        setCategories(res.data); // [{ id: 1, name: 'Pizza' }, ...]
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosWithCsrf.get<Product[]>("/api/products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchPrice = parseFloat(p.price) <= maxPrice;
    return matchName && matchCategory && matchPrice;
  });

  const addToCart = async (productId: number) => {
    try {
      const response = await axiosWithCsrf.post("/api/cart/add/", {
        product_id: productId,
        quantity: 1,
      });

      const data = response.data;

      if (data.status === "exists") {
        showNotification(
          "error",
          `"${data.product}" is already in your cart (Qty: ${data.quantity}).`
        );
        router.push("/cart");
      } else if (data.status === "success") {
        showNotification(
          "success",
          `"${data.product}" has been added to your cart.`
        );
      } else {
        showNotification("error", "Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setPopup({
        message: "Failed to add to cart. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(products.length || 6)].map((_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="p-6 text-center text-gray-600">
        No products available.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 pb-6 bg-[var(--bg-card)] rounded-xl shadow-md border border-[var(--border-color)] p-4">
        {/* 🔍 Search Bar */}
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-secondary)]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </span>
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search delicious dishes..."
            className="w-full pl-10 pr-4 py-2 text-[var(--text-secondary)] border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />
        </div>

        {/* 📂 Category Selector */}
        <div className="relative w-full md:w-1/4">
          <div className="relative">
            <select
              value={selectedCategory ?? ""}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="appearance-none w-full bg-[var(--bg-card)] px-4 py-2  border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            >
              <option  value="">All Categories</option>
              {categories.map((cat) => (
                <option className="text-[var(--text-secondary)]" key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--text-secondary)]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 💰 Price Filter */}
        <div className="w-full md:w-1/4">
          <label className="block text-[var(--text-secondary] text-sm mb-1 ml-1">
            Max Price:{" "}
            <span className="font-semibold text-[var(--color-primary)]">Rs {maxPrice}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)] cursor-pointer"
          />
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="p-2 pt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <FoodCard
              key={product.id}
              imageSrc={product.image}
              name={product.name}
              description={product.desc}
              price={parseFloat(product.price)}
              onAddToCart={() => addToCart(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No items found matching your filters.
        </div>
      )}

      {popup && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
