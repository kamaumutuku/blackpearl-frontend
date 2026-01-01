import { useCart } from "../context/CartContext";
import { useAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart, isInCart, loadingCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const inCart = useMemo(() => {
    if (loadingCart) return false;
    return isInCart(product._id);
  }, [loadingCart, isInCart, product._id]);

  const handleAdd = (e) => {
    e.stopPropagation(); // ✅ prevent card click
    if (!user) {
      navigate("/login");
      return;
    }
    if (!inCart) addToCart(product);
  };

  const handleNavigate = () => {
    navigate(`/products/${product._id}`); // ✅ ALWAYS use _id
  };

  const imageUrl =
    product.image ||
    product.images?.[0] ||
    "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div
      onClick={handleNavigate}
      className="
        cursor-pointer
        flex flex-col bg-white rounded-2xl
        border border-amber-200 shadow-md
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover"
      />

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between p-4 text-black">
        <div>
          <h2 className="text-lg font-semibold truncate text-amber-900">
            {product.name}
          </h2>
          <p className="text-gray-700 text-sm mt-1">
            Ksh {Number(product.price || 0).toLocaleString()}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={inCart}
          className={`flex justify-center items-center gap-2 w-full py-2 mt-4 rounded-lg font-medium transition-all ${
            inCart
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          <ShoppingCart size={18} />
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
