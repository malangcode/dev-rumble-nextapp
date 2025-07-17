"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useNotification } from "@/context/messageContext";
import { Loader2, Save, X, Camera } from "lucide-react";

// Types
interface ProductEditPopupProps {
  productId: number | string;
  onClose: () => void;
}

interface ProductData {
  id: number;
  name: string;
  desc: string;
  price: string;
  category: number | null;
  is_active: boolean;
  is_featured: boolean;
  image: string;
}

export default function ProductEditPopup({
  productId,
  onClose,
}: ProductEditPopupProps) {
  const { showNotification } = useNotification();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [formData, setFormData] = useState<Omit<ProductData, "id" | "image">>({
    name: "",
    desc: "",
    price: "",
    category: null,
    is_active: true,
    is_featured: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  // Fetch product details on mount
  useEffect(() => {
    if (productId) fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await axiosWithCsrf.get("/api/categories/");
      setCategories(res.data); // Make sure your API returns [{ id, name }]
    } catch (error) {
      showNotification("error", "Failed to fetch categories");
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axiosWithCsrf.get(`/api/admin/products/${productId}/`);
      const data = res.data;

      setProduct(data);
      setFormData({
        name: data.name,
        desc: data.desc,
        price: data.price,
        category: data.category,
        is_active: data.is_active,
        is_featured: data.is_featured,
      });
      setImagePreview(data.image);
    } catch (err) {
      showNotification("error", "Failed to fetch product");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "category"
          ? parseInt(value)
          : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("desc", formData.desc);
      data.append("price", formData.price);
      if (formData.category !== null) {
        data.append("category", formData.category.toString());
      }
      data.append("is_active", formData.is_active ? "true" : "false");
      data.append("is_featured", formData.is_featured ? "true" : "false");
      if (image) {
        data.append("image", image);
      }

      await axiosWithCsrf.put(`/api/admin/products/${productId}/`, data);

      showNotification("success", "Product updated successfully");
      onClose();
    } catch (error) {
      showNotification("error", "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 bg-opacity-30 flex items-center justify-center">
      <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-x-auto h-150">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Edit Product #{product.id}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium">Price (Rs)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <select
              name="category"
              value={formData.category ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>

          <div>
            <label className="block font-medium">Current Image</label>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2 rounded"
              />
            ) : (
              <p className="text-sm text-[var(--text-secondary)] ">No image uploaded</p>
            )}
            <div className="mt-2 p-3 bg-[var(--bg-component)] w-fit rounded-lg shadow-md">
              <input
                type="file"
                name="image"
                id="imageUpload"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="w-24 h-24 flex items-center justify-center border-2 shadow-sm border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition"
              >
                {/* Camera icon SVG (you can use Heroicons, Lucide, or any SVG) */}
                 <Camera className="w-6 h-6 text-[var(--text-secondary)] " />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
