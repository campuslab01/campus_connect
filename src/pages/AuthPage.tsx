import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { Heart, Mail, Lock, User, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "/images/loginscreen.jpeg";
import { TypeAnimation } from "react-type-animation";



interface AuthPageProps {
  onAuth: () => void;
} 

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    department: "",
    age: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !termsAccepted) {
      alert("Please accept the Terms & Conditions to continue.");
      return;
    }
    onAuth();
    navigate("discover");
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [termsHtml, setTermsHtml] = useState<string | null>(null);
const [termsLoading, setTermsLoading] = useState(false);
const [termsError, setTermsError] = useState<string | null>(null);

useEffect(() => {
  if (!showTerms) return; // only load when modal opens
  setTermsLoading(true);
  setTermsError(null);

  const termsPath = `${import.meta.env.BASE_URL}terms.html`;

  console.log("📄 Fetching Terms & Conditions from:", termsPath); // 👈 debug log


  fetch(termsPath) // works in dev and on subpath deployments
  
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load terms");
      return res.text();
    })
    .then((rawHtml) => {
      const clean = DOMPurify.sanitize(rawHtml);
      setTermsHtml(clean);
    })
    .catch((err) => {
      console.error(err);
      setTermsError("Could not load terms. Please try again.");
    })
    .finally(() => setTermsLoading(false));
}, [showTerms]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur[1.3px]"></div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl 
             w-full max-w-sm shadow-2xl z-10 
             flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Tabs */}
        <div className="flex-shrink-0 px-4 pt-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-lg font-semibold relative ${
              isLogin ? "text-white" : "text-gray-300"
            }`}
          >
            Login
            {isLogin && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              />
            )}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-lg font-semibold relative  ${
              !isLogin ? "text-white" : "text-gray-300"
            }`}
          >
            Signup
            {!isLogin && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              />
            )}
          </button>
        </div>

        {/* Content scrolls inside */}
        <div className="flex-1 pt-3 px-10 pb-6 overflow-y-auto scrollbar-glass overscroll-contain touch-pan-y">
          <motion.div
            key={isLogin ? "login-header" : "signup-header"}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            {/* Profile Section */}
<div className="relative w-24 h-24 mx-auto mb-4">
  {profileImage ? (
    <motion.img
      src={profileImage}
      alt="Profile Preview"
      className="w-full h-full rounded-full object-cover border-2 border-purple-400 shadow-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
    />
  ) : (
    <motion.div
      className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center w-full h-full"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Heart className="h-12 w-12 text-white animate-pulse" />
    </motion.div>
  )}

  {!isLogin && (
    <motion.label
      className="absolute -bottom-2 -right-2 bg-purple-500 p-3 rounded-full cursor-pointer shadow-lg hover:bg-purple-600 transition transform hover:scale-110"
      whileHover={{ scale: 1.2, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
      title="Add Profile Picture"
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileUpload}
      />
      <User className="h-5 w-5 text-white" />
{/* Optional: small pulsing ring around the icon */}
<span className="absolute -inset-[1px] rounded-full border-2 border-white/50 animate-ping"></span>
    </motion.label>
  )}
</div>


            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
              {isLogin ? (
                <TypeAnimation
                  sequence={[
                    "Welcome Back!",
                    2000,
                    "Sign in to continue",
                    2000,
                  ]}
                  cursor={true}
                  repeat={Infinity}
                  style={{ display: "inline-block" }}
                />
              ) : (
                <TypeAnimation
                  sequence={[
                    "Join Campus Connection",
                    2000,
                    "Create your account",
                    2000,
                  ]}
                  cursor={true}
                  repeat={Infinity}
                  style={{ display: "inline-block" }}
                />
              )}
            </h2>

            <p className="text-gray-200 text-sm"> {isLogin ? "Sign in to continue your journey" : "Create your account to get started"} </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                    <input
                      type="text"
                      name="college"
                      placeholder="College/University"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
  <select
    name="department"
    value={formData.department}
    onChange={handleInputChange}
    className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white
               placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent
               appearance-none" // remove default arrow styling for consistency
    required
  >
    <option value="" disabled className="text-gray-400">
      Department
    </option>
    <option value="Computer Science" className="text-white bg-white/10">
      Computer Science
    </option>
    <option value="Engineering" className="text-white bg-white/10">
      Engineering
    </option>
    <option value="Business" className="text-white bg-white/10">
      Business
    </option>
    <option value="Arts" className="text-white bg-white/10">
      Arts
    </option>
    <option value="Medicine" className="text-white bg-white/10">
      Medicine
    </option>
    <option value="Law" className="text-white bg-white/10">
      Law
    </option>
  </select>

  <input
    type="number"
    name="age"
    placeholder="Age"
    value={formData.age}
    onChange={handleInputChange}
    className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white 
               placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    min="18"
    max="30"
    required
  />
</div>


                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <motion.div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="College Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-black placeholder-gray-300"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300"
                required
              />
            </motion.div>

            {/* Terms checkbox (only Signup) */}
{!isLogin && (
  <div className="flex items-center space-x-3 text-white text-sm mt-2">
  <label className="flex items-center cursor-pointer select-none">
    <div
      className={`w-5 h-5 flex items-center justify-center rounded-lg border-2 
                  ${termsAccepted ? 'bg-gradient-to-tr from-purple-500 to-blue-500 border-transparent' 
                                  : 'border-white/40 bg-white/10'} 
                  transition-all duration-300`}
      onClick={() => setTermsAccepted(!termsAccepted)}
    >
      {termsAccepted && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="ml-2 text-white text-sm">
      I accept the{" "}
      <button
        type="button"
        onClick={() => setShowTerms(true)}
        className="text-blue-400 underline font-semibold hover:text-purple-400 transition-colors duration-300"
      >
        Terms & Conditions
      </button>
    </span>
  </label>
</div>

)}


            {/* Forgot password (only Login) */}
{isLogin && (
  <div className="text-right mt-2">
    <button
      type="button"
      onClick={() => setShowForgot(true)}
      className="inline-flex items-center gap-2 text-blue-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
    >
      <Lock className="h-4 w-4" /> {/* Key icon alternative: you can use Key instead of Lock */}
      Forgot Password?
    </button>
  </div>
)}


            {/* Submit */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="m-4 px-12 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Terms Modal */}
      <AnimatePresence>
  {showTerms && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 
                   rounded-2xl p-6 max-w-lg w-full sm:max-w-md md:max-w-lg shadow-2xl text-gray-200"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center sm:text-left">
          Terms & Conditions
        </h3>
        <div
          className="max-h-[60vh] overflow-y-auto pr-2 text-sm text-gray-300 space-y-3
                     scrollbar-thin scrollbar-thumb-purple-500/60 scrollbar-track-white/10 rounded-lg"
        >
          {termsLoading && <p>Loading terms...</p>}
          {termsError && <p className="text-red-400">{termsError}</p>}
          {termsHtml && (
            <div
              dangerouslySetInnerHTML={{ __html: termsHtml }}
              className="prose prose-invert max-w-none"
            />
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => setShowTerms(false)}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 
                       text-white rounded-lg shadow-md hover:shadow-lg 
                       transition-all duration-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


{/* Forgot Password Modal */}
<AnimatePresence>
  {showForgot && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 
                   rounded-2xl p-6 max-w-md w-full sm:max-w-sm md:max-w-md shadow-2xl text-gray-200"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center sm:text-left">
          Reset Password
        </h3>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-6 px-4 py-3 bg-white/10 border border-white/30 
                     rounded-xl text-white placeholder-gray-400 focus:ring-2 
                     focus:ring-purple-400 focus:border-transparent"
        />

        <div className="flex justify-center gap-4">
          {/* Send Reset Link Button */}
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white rounded-xl shadow-md hover:shadow-lg 
                       transition-all duration-300 font-semibold"
          >
            Send Reset Link
          </button>

          {/* Cancel Button with Glass Style */}
          <button
            onClick={() => setShowForgot(false)}
            className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 
                       text-white rounded-xl hover:bg-white/30 hover:scale-105 
                       transition-all duration-300 font-semibold shadow-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>





    </div>
  );
};

export default AuthPage;
