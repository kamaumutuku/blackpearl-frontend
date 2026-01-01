import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import heroImage from "../assets/blackpearl-hero.jpg"; // optional hero background image

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-amber-50 to-amber-100 overflow-hidden flex items-center justify-center">
      <Helmet>
        <title>BlackPearl | Luxury Spirits & Lifestyle</title>
        <meta
          name="description"
          content="Discover fine wines, premium spirits, and timeless indulgence at BlackPearl — your destination for refined taste."
        />
      </Helmet>

      {/* Background Image (optional) */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-serif font-bold text-amber-900 mb-6 tracking-tight"
        >
          Welcome to <span className="text-amber-700">BlackPearl</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Explore a curated collection of premium liquors, fine wines, and
          signature accessories crafted for those with exceptional taste.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/shop"
            className="px-8 py-4 bg-amber-600 text-white font-semibold text-lg rounded-full shadow-md hover:bg-amber-700 hover:shadow-xl transition-all duration-300"
          >
            Enter the Collection
          </Link>
        </motion.div>

        {/* Decorative accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 w-40 h-1 bg-amber-400 rounded-full"
        ></motion.div>
      </div>
    </div>
  );
};

export default Home;
