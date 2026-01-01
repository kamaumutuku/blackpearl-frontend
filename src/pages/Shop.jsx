import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet";
import api from "../utils/axiosInstance";
import { Search } from "lucide-react";

const LIMIT = 12;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: {
          page,
          limit: LIMIT,
          search,
        },
      });

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  /* Reset page when searching */
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-amber-100 px-6 py-10">
      <Helmet>
        <title>Shop | The Black Pearl</title>
      </Helmet>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-800">
          Shop Our Collection
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Discover timeless craftsmanship.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 text-amber-700" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg"
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-600">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-12 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-5 py-2 bg-amber-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-semibold text-amber-800">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 bg-amber-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
