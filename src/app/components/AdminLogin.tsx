import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, LogIn, Mail, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const LOGIN_ERROR = 'E-Mail-Adresse oder Passwort ist nicht korrekt oder der Zugriff ist nicht freigegeben.';

interface AdminLoginProps {
  onLogin: () => boolean | void | Promise<boolean | void>;
  onNavigate: (page: string) => void;
  accessMessage?: string;
}

export function AdminLogin({ onLogin, onNavigate, accessMessage }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(accessMessage ?? '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError(accessMessage ?? '');
  }, [accessMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Der Admin-Login ist erst nach der Supabase-Konfiguration verfügbar.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) throw new Error(LOGIN_ERROR);

      const allowed = await onLogin();

      if (allowed === false) {
        await supabase.auth.signOut();
        throw new Error(LOGIN_ERROR);
      }
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : LOGIN_ERROR;
      setError(message === LOGIN_ERROR ? LOGIN_ERROR : 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const loginDisabled = isLoading || !isSupabaseConfigured || !email.trim() || !password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-white flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-[#b08a57]/25 overflow-hidden">
          <div className="gradient-secondary text-white p-6 md:p-8 text-center">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
              <Shield size={34} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin-Bereich</h1>
            <p className="text-[#c8a96e]">Bitte melden Sie sich an</p>
          </div>

          <div className="p-5 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#77756f] mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77756f]">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#b08a57]/30 focus:border-[#b08a57] transition-colors duration-200 focus:outline-none"
                    placeholder="admin@example.com"
                    required
                    autoComplete="username"
                    autoFocus
                    disabled={!isSupabaseConfigured}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#77756f] mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77756f]">
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
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-colors duration-200 focus:outline-none ${
                      error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#b08a57]/30 focus:border-[#b08a57]'
                    }`}
                    placeholder="Geben Sie Ihr Passwort ein"
                    required
                    autoComplete="current-password"
                    disabled={!isSupabaseConfigured}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#77756f] hover:text-[#b08a57] transition-colors"
                    aria-label={showPassword ? 'Passwort ausblenden' : 'Passwort anzeigen'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && (
                  <motion.p
                    className="text-red-600 text-sm mt-2"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginDisabled}
                className={`w-full gradient-secondary text-white py-6 text-lg font-semibold transition-all duration-200 ${
                  loginDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
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

            <motion.div
              className="mt-6 p-4 rounded-xl bg-[#f8f7f3] border border-[#b08a57]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-[#77756f]">
                <strong>Hinweis:</strong>{' '}
                {isSupabaseConfigured
                  ? 'Admin-Konten werden in Supabase angelegt und serverseitig freigegeben.'
                  : 'Supabase ist noch nicht konfiguriert. Der Adminbereich bleibt deshalb gesperrt.'}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => onNavigate('home')}
            className="text-[#77756f] hover:text-[#b08a57] transition-colors duration-200 text-sm"
          >
            Zurück zur Startseite
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
