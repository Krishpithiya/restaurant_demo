'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_HINTS = [
  { role: 'Admin',  email: 'admin@gmail.com',  password: 'admin123',  color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { role: 'Chef',   email: 'chef@gmail.com',   password: 'chef123',   color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { role: 'Waiter', email: 'waiter@gmail.com', password: 'waiter123', color: 'bg-green-50 border-green-200 text-green-800' },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, currentUser } = useStore();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (currentUser) router.replace(`/${currentUser.role}`);
  }, [currentUser, router]);

  function fillDemo(e: string, p: string) {
    setEmail(e); setPassword(p); setError(''); setFieldErrors({});
  }

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim())                          errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))      errs.email    = 'Enter a valid email address';
    if (!password)                              errs.password = 'Password is required';
    else if (password.length < 6)              errs.password = 'Password must be at least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));
    const result = loginWithEmail(email.trim(), password);
    setLoading(false);
    if (result.success) {
      // redirect handled by useEffect
    } else {
      setError(result.error || 'Something went wrong. Try again.');
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col lg:flex-row relative overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-brown via-brand-brown-light to-brand-orange relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-brand-orange blur-3xl" />
        </div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="relative text-center">
          <div className="text-7xl mb-6">🍛</div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Anna Kitchen</h1>
          <p className="text-white/70 text-lg leading-relaxed">Premium South Indian Restaurant<br />Management System</p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {['Order Management','Kitchen Queue','Staff Control','Revenue Insights'].map(f => (
              <div key={f} className="bg-white/10 rounded-xl px-4 py-2.5 text-white/80 text-center border border-white/10">{f}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-3">🍛</div>
            <h1 className="font-display text-3xl font-bold text-brand-brown">Anna Kitchen</h1>
            <p className="text-brand-brown-muted text-sm mt-1">Management System</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card border border-brand-cream-dark p-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-brand-brown">Welcome back</h2>
              <p className="text-brand-brown-muted text-sm mt-1">Sign in to your account to continue</p>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1.5">Email address</label>
                <input
                  type="email" value={email} onChange={e => { setEmail(e.target.value); setFieldErrors(f => ({...f, email: undefined})); setError(''); }}
                  placeholder="you@example.com" autoComplete="email"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-brown placeholder:text-brand-brown-muted bg-brand-cream/40 outline-none transition-all ${fieldErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-brand-cream-dark focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10'}`}
                />
                {fieldErrors.email && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setFieldErrors(f => ({...f, password: undefined})); setError(''); }}
                    placeholder="Enter your password" autoComplete="current-password"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm text-brand-brown placeholder:text-brand-brown-muted bg-brand-cream/40 outline-none transition-all ${fieldErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-brand-cream-dark focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10'}`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown-muted hover:text-brand-brown transition-colors p-1">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : <><LogIn className="w-4 h-4" />Sign In</>}
              </button>
            </form>

            {/* Demo hints */}
            <div className="mt-6 pt-5 border-t border-brand-cream-dark">
              <p className="text-xs text-brand-brown-muted mb-3 text-center font-medium">Demo accounts — click to fill</p>
              <div className="space-y-2">
                {DEMO_HINTS.map(h => (
                  <button key={h.role} onClick={() => fillDemo(h.email, h.password)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs transition-all hover:opacity-80 ${h.color}`}>
                    <span className="font-bold">{h.role}</span>
                    <span className="opacity-70">{h.email}</span>
                    <span className="font-mono opacity-60">{h.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
