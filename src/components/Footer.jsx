// frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amber-50 text-gray-700 py-10 border-t border-amber-200">
      <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-4">
        {/* Logo / Name */}
        <h2 className="text-2xl font-extrabold text-amber-700 tracking-wide">
          Black Pearl
        </h2>

        <h3 className="text-2xl font-extrabold text-amber-700 tracking-wide">
          Call - 0799071982       
        </h3>

        <p className="text-sm text-gray-500 max-w-md">
          Discover refined luxury and timeless elegance — crafted with passion in
          Nairobi, Kenya.
        </p>

        {/* Navigation */}
        <div className="flex gap-6 mt-2 text-sm font-medium">
          <Link to="/shop" className="hover:text-amber-700 transition-colors">
            Shop
          </Link>
          <Link to="/profile" className="hover:text-amber-700 transition-colors">
            Profile
          </Link>
          <Link to="/cart" className="hover:text-amber-700 transition-colors">
            Cart
          </Link>
        </div>

        {/* Socials */}
        <div className="flex gap-5 mt-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-700 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-700 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-700 transition-colors"
          >
            <Twitter size={20} />
          </a>
        </div>

        <div className="h-px bg-amber-200 w-2/3 mt-5" />

        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()}{" "}
          <span className="text-amber-700 font-semibold">Black Pearl</span> — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
