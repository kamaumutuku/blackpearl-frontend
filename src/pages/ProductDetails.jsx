import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import api from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, isInCart, loadingCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setActiveImage(data?.images?.[0] || "");
      } catch (err) {
        console.error(err);
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const inCart = useMemo(() => {
    if (!product || loadingCart) return false;
    return isInCart(product._id);
  }, [product, loadingCart, isInCart]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!inCart) {
      addToCart(product);
      toast.success("Added to cart");
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-gray-500">
        Loading product…
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://via.placeholder.com/600x600?text=No+Image"];

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>{product.name} | The Black Pearl</title>
        <meta
          name="description"
          content="Explore luxurious, handcrafted selections at The Black Pearl. Shop premium products, securely and elegantly."
        />
      </Helmet>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="border border-amber-200 rounded-2xl overflow-hidden bg-white">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-[420px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-xl p-1 min-w-[72px] ${
                    activeImage === img
                      ? "border-amber-500"
                      : "border-amber-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-amber-800">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-gray-900">
            Ksh {Number(product.price || 0).toLocaleString()}
          </p>

          <p className="text-sm text-gray-600">
            Stock:{" "}
            <span
              className={
                product.countInStock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {product.countInStock > 0 ? "Available" : "Out of stock"}
            </span>
          </p>

          {product.description && (
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Actions */}
          <button
            onClick={handleAddToCart}
            disabled={inCart || product.countInStock === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              inCart
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : product.countInStock === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            <ShoppingCart size={20} />
            {inCart
              ? "Already in Cart"
              : product.countInStock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
