import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface AdminLoginProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export function AdminLogin({ onLogin, onNavigate }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (password === '1234') {
        onLogin();
      } else {
        setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-white flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 gradient-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 gradient-primary opacity-10 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#b08a57]/30 overflow-hidden">
          {/* Header */}
          <div className="gradient-secondary text-white p-8 text-center relative overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
                <Shield size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Admin-Bereich</h1>
              <p className="text-[#c8a96e]">Bitte melden Sie sich an</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#77756f] mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#77756f]">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                      error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#b08a57]/30 focus:border-[#b08a57]'
                    }`}
                    placeholder="Geben Sie Ihr Passwort ein"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#77756f] hover:text-[#b08a57] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && (
                  <motion.p
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>⚠️</span> {error}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !password}
                className={`w-full gradient-secondary text-white py-6 text-lg font-semibold transition-all duration-300 ${
                  isLoading || !password
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-xl hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Wird überprüft...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={20} />
                    <span>Anmelden</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <motion.div
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#b08a57]/10 to-transparent border-l-4 border-[#b08a57]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-[#77756f]">
                <strong>Hinweis:</strong> Dieser Bereich ist nur für autorisierte Administratoren zugänglich.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Back Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => onNavigate('home')}
            className="text-[#77756f] hover:text-[#b08a57] transition-colors duration-300 text-sm"
          >
            ← Zurück zur Startseite
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
