import { useEffect, useState } from "react";
import UploadWidget from "./UploadWidget";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    countInStock: "",
    images: [],
    description: "",
    category: "Whiskey",
    alcoholPercentage: "",
    volumeMl: "",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     PREFILL (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price ?? "",
        countInStock: product.countInStock ?? "",
        images: Array.isArray(product.images)
          ? product.images
          : [],
        description: product.description || "",
        category: product.category || "Whiskey",
        alcoholPercentage:
          product.alcoholPercentage ?? "",
        volumeMl: product.volumeMl ?? "",
        isFeatured: product.isFeatured || false,
      });
    }
  }, [product]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.countInStock ||
      !form.images.length ||
      !form.category
    ) {
      return toast.error(
        "Please fill all required fields"
      );
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        images: form.images,
        category: form.category,
        alcoholPercentage:
          form.alcoholPercentage !== ""
            ? Number(form.alcoholPercentage)
            : undefined,
        volumeMl:
          form.volumeMl !== ""
            ? Number(form.volumeMl)
            : undefined,
        isFeatured: Boolean(form.isFeatured),
      };

      if (product?._id) {
        await api.put(
          `/admin/products/${product._id}`,
          payload
        );
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Product created");
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Save product error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-amber-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-amber-700">
            {product
              ? "Edit Product"
              : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full border border-amber-300 rounded-lg px-4 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-amber-300 rounded-lg px-4 py-2"
          >
            <option value="Whiskey">Whiskey</option>
            <option value="Vodka">Vodka</option>
            <option value="Wine">Wine</option>
            <option value="Gin">Gin</option>
            <option value="Rum">Rum</option>
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (KES)"
              className="w-full border border-amber-300 rounded-lg px-4 py-2"
            />

            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              placeholder="Stock quantity"
              className="w-full border border-amber-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Optional product details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="alcoholPercentage"
              type="number"
              value={form.alcoholPercentage}
              onChange={handleChange}
              placeholder="Alcohol % (optional)"
              className="w-full border border-amber-300 rounded-lg px-4 py-2"
            />

            <input
              name="volumeMl"
              type="number"
              value={form.volumeMl}
              onChange={handleChange}
              placeholder="Volume (ml)"
              className="w-full border border-amber-300 rounded-lg px-4 py-2"
            />
          </div>

          <UploadWidget
            currentImage={form.images[0]}
            onUpload={(url) =>
              setForm({
                ...form,
                images: [url],
              })
            }
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            rows={4}
            className="w-full border border-amber-300 rounded-lg px-4 py-2"
          />

          {/* Featured */}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured product
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border text-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-amber-600 text-white font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving…"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
