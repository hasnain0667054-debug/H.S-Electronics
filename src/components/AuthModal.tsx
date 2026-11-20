import React, {useState} from 'react';
import {X} from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  userName: string | null;
  onClose: () => void;
  onSignIn: (name: string) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  userName,
  onClose,
  onSignIn,
  onSignOut,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      mode === 'signup' && name.trim()
        ? name.trim()
        : email.split('@')[0] || 'Shopper';
    onSignIn(displayName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account Access"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-black/10 p-6 z-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center text-[#616161] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {userName ? (
          <div className="space-y-4 py-2">
            <h2 className="font-display text-xl font-bold text-[#212121]">
              Signed in as {userName}
            </h2>
            <p className="text-sm text-[#6E6E6E]">
              Your wishlist, cart items, and express delivery preferences are active for this session.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold cursor-pointer"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="px-4 h-10 rounded-lg border border-black/15 text-sm font-semibold text-[#212121] hover:bg-[#F5F5F5] cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#212121]">
                {mode === 'login' ? 'Welcome back' : 'Create your H.S Electronics account'}
              </h2>
              <p className="text-sm text-[#6E6E6E] mt-1">
                Track orders, save favorites, and check out faster.
              </p>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-lg bg-[#F5F5F5]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'login' ? 'bg-white text-[#212121] shadow-sm' : 'text-[#6E6E6E]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-[#212121] shadow-sm' : 'text-[#6E6E6E]'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-[#212121] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="w-full h-10 px-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#F85606]"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-[#212121] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#212121] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
