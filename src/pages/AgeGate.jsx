import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import logo from "../assets/blackpearl-logo.png";

export default function AgeGate() {
  const [birthDate, setBirthDate] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!birthDate) {
      setError("Please select your date of birth.");
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    const finalAge = hasBirthdayPassed ? age : age - 1;

    if (finalAge < 18) {
      setError("Sorry, you must be at least 18 years old to enter.");
    } else {
      localStorage.setItem("blackpearl-age-verified", "true");
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-amber-50 text-gray-900 px-4">
      <Helmet>
        <title>My Age | The Black Pearl</title>
        <meta
          name="description"
          content="You must be 18 years or older to access The Black Pearl website."
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl border border-amber-200 w-full max-w-md p-8 md:p-10 text-center"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Black Pearl Logo"
            className="h-16 w-auto mb-3 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to <span className="text-amber-700">BlackPearl</span>
          </h1>
          <p className="text-gray-500 mt-2">
            You must be <span className="font-semibold">18 years or older</span> to
            access this website.
          </p>
        </div>

        {/* Date Picker */}
        <DatePicker
          selected={birthDate}
          onChange={(date) => {
            setBirthDate(date);
            setError("");
          }}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={150}
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
          placeholderText="Select your date of birth"
          className="w-full p-3 rounded-lg border border-amber-300 bg-white text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
        />

        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

        {/* Verify Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="mt-6 w-full bg-amber-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          Enter
        </motion.button>

        <p className="text-xs text-gray-400 mt-5">
          BlackPearl promotes responsible drinking. Please confirm your age to continue.
        </p>
      </motion.div>
    </div>
  );
}
