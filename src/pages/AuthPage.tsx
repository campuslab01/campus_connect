import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { Heart, Mail, Lock, User, GraduationCap, AlertCircle, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "/images/loginscreen.jpeg";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../contexts/AuthContext";
import { validateRegistrationForm, validateLoginForm, UserFormData } from "../utils/validation";

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
    gender: "",
    year: ""
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Array<{ msg: string; param?: string }>>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rememberMe');
      return stored ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  // Simple popup alert state
  const [popup, setPopup] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setServerErrors([]);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Validate login form
        const loginValidation = validateLoginForm(formData.email, formData.password);
        if (!loginValidation.isValid) {
          setValidationErrors(loginValidation.errors);
          return;
        }
        console.log('[AUTH PAGE] Submitting login:', { email: formData.email, password: formData.password });
        const result = await login(formData.email, formData.password);
        console.log('[AUTH PAGE] Login result:', result);
        if (result.success) {
          setPopup({ type: 'success', message: 'Logged in successfully!' });
          try {
            localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
            if (rememberMe) {
              localStorage.setItem('rememberedEmail', formData.email);
              localStorage.setItem('rememberedPassword', formData.password);
            } else {
              localStorage.removeItem('rememberedEmail');
              localStorage.removeItem('rememberedPassword');
            }
          } catch {}
          onAuth();
          navigate("/discover");
        } else {
          setError(result.message);
          setPopup({ type: 'error', message: result.message || 'Login failed' });
          if (result.errors) setServerErrors(result.errors);
        }
      } else {
        // Validate registration form
        if (!termsAccepted) {
          setError("Please accept the Terms & Conditions to continue.");
          return;
        }
        const registrationData: UserFormData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          gender: (formData.gender || '').toLowerCase(),
          college: formData.college,
          department: formData.department,
          year: formData.year,
          profileImage: profileImage || '',
          photos: profileImage ? [profileImage] : []
        };

        const registrationValidation = validateRegistrationForm(registrationData);
        if (!registrationValidation.isValid) {
          setValidationErrors(registrationValidation.errors);
          return;
        }
        // Log payload to be sent
        console.log('[AUTH PAGE] Submitting registration:', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          gender: (formData.gender || '').toLowerCase(),
          college: formData.college,
          department: formData.department,
          year: formData.year,
          profileImage: profileImage || '',
          photos: profileImage ? [profileImage] : []
        });
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          gender: (formData.gender || '').toLowerCase(),
          college: formData.college,
          department: formData.department,
          year: formData.year,
          profileImage: profileImage || '',
          photos: profileImage ? [profileImage] : []
        });
        console.log('[AUTH PAGE] Registration result:', result);
        if (result?.success) {
          setPopup({ type: 'success', message: 'Registration successful!' });
          onAuth();
          navigate("/discover");
        } else {
          setError(result?.message || "Registration failed. Please try again.");
          setPopup({ type: 'error', message: result?.message || 'Registration failed' });
          if (result.errors) setServerErrors(result.errors);
        }
      }

    } catch (error: any) {
      const msg = error.message || 'An error occurred';
      setError(msg);
      setPopup({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
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

    console.log("📄 Fetching Terms & Conditions from:", termsPath);

    fetch(termsPath) // works in dev and on subpath deployments
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load terms");
        return res.text();
      })
      .then((rawHtml) => {
        console.log("Raw terms HTML:", rawHtml.slice(0, 200));
        const clean = DOMPurify.sanitize(rawHtml);
        setTermsHtml(clean);
      })
      .catch((err) => {
        console.error(err);
        setTermsError("Could not load terms. Please try again.");
      })
      .finally(() => setTermsLoading(false));
  }, [showTerms]);

  // Prefill saved credentials on mount (login)
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('rememberedEmail') || '';
      const savedPassword = localStorage.getItem('rememberedPassword') || '';
      if (savedEmail || savedPassword) {
        setFormData((prev) => ({ ...prev, email: savedEmail, password: savedPassword }));
      }
    } catch {}
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur[1.3px]"></div>

      {/* Back to Landing Button */}
      <motion.button
        onClick={() => navigate('/landing')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-sm border border-white/30 
                   rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300
                   hover:scale-110 shadow-lg"
        title="Back to Landing Page"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

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
            <div className="relative w-24 h-24 mx-auto mb-2">
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

                  {/* Optional: small pulsing ring */}
                  <span className="absolute -inset-[1px] rounded-full border-2 border-white/50 animate-ping"></span>
                </motion.label>
              )}
            </div>

            {/* Add Profile text (only on Signup) */}
            {!isLogin && (
              <div className="relative w-full flex justify-center mt-2">
                <p
                  className="text-white/70 text-[0.7rem] font-bold select-none tracking-wider"
                  style={{
                    fontFamily: "'Cursive', sans-serif", // pick any arched/curved font
                    textShadow: "0 0 6px rgba(255,255,255,0.5)",
                  }}
                >
                  Add Profile
                </p>
              </div>
            )}

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

            <p className="text-gray-200 text-sm">
              {" "}
              {isLogin
                ? "Sign in to continue your journey"
                : "Create your account to get started"}{" "}
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
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-300 ${
                        validationErrors.name ? 'border-red-400' : 'border-white/30'
                      }`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* College Dropdown */}
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white
               placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent
               appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        Select College
                      </option>
                      <option value="Medicaps University">Medicaps University</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white
               placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent
               appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
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

                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white
               placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent
               appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        Department
                      </option>
                      <option value="B.Com">B.Com</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                      <option value="LLB">LLB</option>
                      <option value="LLM">LLM</option>
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="B.Tech IT">B.Tech IT</option>
                      <option value="B.Tech ME">B.Tech ME</option>
                      <option value="B.Tech CE">B.Tech CE</option>
                      <option value="B.Tech EE">B.Tech EE</option>
                      <option value="B.Tech ECE">B.Tech ECE</option>
                      <option value="B.Sc Physics">B.Sc Physics</option>
                      <option value="B.Sc Chemistry">B.Sc Chemistry</option>
                      <option value="B.Sc Maths">B.Sc Maths</option>
                      <option value="B.Sc Biotech">B.Sc Biotech</option>
                      <option value="B.Sc Forensic">B.Sc Forensic</option>
                      <option value="B.Pharm">B.Pharm</option>
                      <option value="M.Pharm">M.Pharm</option>
                      <option value="B.Sc Agri">B.Sc Agri</option>
                      <option value="BA Eng/Hindi">BA Eng/Hindi</option>
                      <option value="BA Social Sci">BA Social Sci</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white
               placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent
               appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">
                        Academic Year
                      </option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                    </select>
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
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-300 ${
                  validationErrors.email ? 'border-red-400' : 'border-white/30'
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-300 ${
                  validationErrors.password ? 'border-red-400' : 'border-white/30'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
              )}
            </motion.div>

            {/* Terms checkbox (only Signup) */}
            {!isLogin && (
              <div className="flex items-center space-x-3 text-white text-sm mt-2">
                {/* Checkbox only controls acceptance */}
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-lg border-2 cursor-pointer
                  ${
                    termsAccepted
                      ? "bg-gradient-to-tr from-purple-500 to-blue-500 border-transparent"
                      : "border-white/40 bg-white/10"
                  } 
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

                {/* Text + modal trigger */}
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
              </div>
            )}

            {/* Remember me (only Login) */}
            {isLogin && (
              <div className="flex items-center justify-between mt-2 text-white text-sm">
                <label className="inline-flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-purple-500 cursor-pointer"
                  />
                  <span>Remember me</span>
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
                  <Lock className="h-4 w-4" />{" "}
                  {/* Key icon alternative: you can use Key instead of Lock */}
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {(error || Object.keys(validationErrors).length > 0 || serverErrors.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
              >
                {error && (
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
                {/* Backend field errors */}
                {serverErrors.length > 0 && (
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-sm">
                    {serverErrors.map((e, idx) => (
                      <li key={idx}>
                        {e.param ? <strong className="mr-1">{e.param}:</strong> : null}
                        {e.msg}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Client-side validation errors */}
                {Object.keys(validationErrors).length > 0 && (
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-sm">
                    {Object.entries(validationErrors).map(([field, msg]) => (
                      <li key={field}>
                        <strong className="mr-1">{field}:</strong>{msg}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            {/* Submit */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.08 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className="relative m-4 px-12 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
              >
                <span className={`${isSubmitting || isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  {isLogin ? "Sign In" : "Create Account"}
                </span>
                {(isSubmitting || isLoading) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </span>
                )}
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
      {/* Popup Alert */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${popup.type === 'success' ? 'bg-green-500/20 border-green-400/40 text-green-200' : 'bg-red-500/20 border-red-400/40 text-red-200'}`}
            role="alert"
          >
            <div className="flex items-center gap-2">
              {popup.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">{popup.message}</span>
              <button onClick={() => setPopup(null)} className="ml-3 text-white/70 hover:text-white text-xs">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
