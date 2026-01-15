import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);

  // Reset state when switching between login and signup
  useEffect(() => {
    setEmail('');
    setPassword('');
    setUsername('');
    setMessage(null);
    setSignupComplete(false);
  }, [isLogin]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // No success message needed here; the onAuthStateChange listener in App.tsx will handle the UI transition.
      } else {
        // Best practice: Pass metadata during sign-up, let a DB trigger handle profile creation.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        setSignupComplete(true);
        setMessage({ type: 'success', text: 'Success! Please check your email to verify your account.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 from-gray-900 to-gray-800">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-gray-700/50 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-800/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Enter your credentials to access your crop data.' : 'Join CropMate AI to start diagnosing your crops.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-8">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || signupComplete}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900/50 outline-none transition-all bg-gray-700/50 text-white placeholder-gray-400 shadow-inner shadow-black/20"
              placeholder="you@example.com"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-8">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || signupComplete}
                required
                minLength={3}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900/50 outline-none transition-all bg-gray-700/50 text-white placeholder-gray-400 shadow-inner shadow-black/20 disabled:opacity-50"
                placeholder="FarmerJohn"
              />
            </div>
          )}

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-8">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || signupComplete}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900/50 outline-none transition-all bg-gray-700/50 text-white placeholder-gray-400 shadow-inner shadow-black/20 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || signupComplete}
            className="w-full py-3.5 bg-gradient-to-br from-emerald-500 to-teal-400 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-800/20 hover:shadow-2xl hover:shadow-emerald-800/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm font-medium text-center ${
              message.type === 'success'
                ? 'bg-green-900/30 text-green-300 border border-green-800'
                : 'bg-red-900/30 text-red-300 border border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {!signupComplete && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors"
              >
                {isLogin ? 'Sign up now' : 'Log in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
