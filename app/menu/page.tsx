"use client";

import { useEffect, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { FoodCard } from "@/components/FoodCard";
import { FoodCardSkeleton } from "@/components/FoodCardSkeleton";
import PopupMessage from "@/components/PopupMessage";

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

  const addToCart = async (productId: number) => {
    try {
      const response = await axiosWithCsrf.post("/api/cart/add/", {
        product_id: productId,
        quantity: 1,
      });

      const data = response.data;

      if (data.status === "exists") {
        setPopup({
          message: `"${data.product}" is already in your cart (Qty: ${data.quantity}).`,
          type: "info",
        });
      } else if (data.status === "success") {
        setPopup({
          message: `"${data.product}" added to cart successfully!`,
          type: "success",
        });
      } else {
        setPopup({
          message: "Unexpected response from server.",
          type: "error",
        });
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
        {[1, 2, 3].map((i) => (
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
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 pt-5">
        {products.map((product) => (
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
