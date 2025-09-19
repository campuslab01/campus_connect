import React, { useState } from "react";
import { Heart, Mail, Lock, User, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "/images/login.jpeg";
import { TypeAnimation } from 'react-type-animation';


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
    window.location.href = "/onboarding/discover";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
        className="relative bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-4 w-full max-w-sm shadow-2xl z-10"
      >
        {/* Tabs */}
        <div className="flex justify-center mb-6 relative">
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

        {/* Header */}
        <motion.div
          key={isLogin ? "login-header" : "signup-header"}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 w-fit mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
  {isLogin ? (
    <TypeAnimation
      sequence={[
        'Welcome Back!', 2000,   // show for 2s
        'Sign in to continue', 2000, // show for 2s
      ]}
      cursor={true}
      repeat={Infinity}  // loop forever
      style={{ display: 'inline-block' }}
    />
  ) : (
    <TypeAnimation
      sequence={[
        'Join Campus Connection', 2000, // show for 2s
        'Create your account', 2000,   // show for 2s
      ]}
      cursor={true}
      repeat={Infinity}  // loop forever
      style={{ display: 'inline-block' }}
    />
  )}
</h2>


          <p className="text-gray-200 text-sm">
            {isLogin
              ? "Sign in to continue your journey"
              : "Create your account to get started"}
          </p>
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
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <select
  name="department"
  value={formData.department}
  onChange={handleInputChange}
  className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none" // added appearance-none
  required
>
  <option value="" className="bg-black/50 text-white">Department</option>
  <option value="Computer Science" className="bg-black/50 text-white">Computer Science</option>
  <option value="Engineering" className="bg-black/50 text-white">Engineering</option>
  <option value="Business" className="bg-black/50 text-white">Business</option>
  <option value="Arts" className="bg-black/50 text-white">Arts</option>
  <option value="Medicine" className="bg-black/50 text-white">Medicine</option>
  <option value="Law" className="bg-black/50 text-white">Law</option>
</select>


                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    min="18"
                    max="30"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <input
              type="email"
              name="email"
              placeholder="College Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              required
            />
          </motion.div>

          {/* Submit */}
<div className="flex justify-center">
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    type="submit"
    className="m-4 px-12 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md 
               hover:shadow-xl hover:from-purple-600 hover:to-blue-500 
               transition-all duration-300 ease-in-out 
               backdrop-blur-md bg-opacity-80 border border-white/20"
  >
    {isLogin ? "Sign In" : "Create Account"}
  </motion.button>
</div>


        </form>
      </motion.div>
    </div>
  ); 
};

export default AuthPage;
