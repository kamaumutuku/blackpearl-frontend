import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import api from "../utils/axiosInstance";
import ProductFormModal from "../components/admin/ProductFormModal";

const PAGE_SIZE = 9;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* =========================
     SEARCH
  ========================= */
  const [search, setSearch] = useState("");

  /* =========================
     PAGINATION
  ========================= */
  const [page, setPage] = useState(1);

  /* =========================
     FILTERED PRODUCTS
  ========================= */
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const q = search.toLowerCase();

    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     DELETE PRODUCT
  ========================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Products | Black Pearl</title>
      </Helmet>

      <div className="p-6 md:p-8 bg-amber-50 min-h-screen space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-700">
            Products
          </h1>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setPage(1); // ✅ reset pagination
                setSearch(e.target.value);
              }}
              placeholder="Search by name or category…"
              className="w-full pl-9 pr-3 py-2 border border-amber-300 rounded-md"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {filteredProducts.length} product(s) found
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500">Loading products…</p>
        ) : paginatedProducts.length === 0 ? (
          <p className="text-gray-600">
            No products match your search.
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {product.category}
                  </p>
                  <p className="text-amber-700 font-semibold mt-1">
                    Ksh {Number(product.price || 0).toLocaleString()}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      Stock: {product.countInStock}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg border border-amber-300
                                   text-amber-700 hover:bg-amber-100"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-lg border border-red-300
                                   text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* PRODUCT MODAL */}
      {showModal && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSaved={fetchProducts}
        />
      )}
    </>
  );
}
