import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { Card } from '../components/ui/Card';

type AuthTab = 'login' | 'register' | 'reset';

export const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authService.login({ email, password });

    if (user) {
      const redirectPath = authService.getRedirectPath(user.role);
      navigate(redirectPath);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero Panel - Diagonal Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#3c65f5] via-[#3c65f5] to-[#43b65d]">
        {/* Decorative Glow Dots */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-32 w-40 h-40 bg-[#43b65d]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        {/* Logo in Top-Left */}
        <div className="absolute top-8 left-8 flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-[#3c65f5] font-bold text-xl">L</span>
          </div>
          <span className="text-white text-xl font-bold">LMS Platform</span>
        </div>
      </div>

      {/* Right Auth Card Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white">
        {/* Mobile Logo - Only shown on small screens */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#3c65f5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-gray-900 text-xl font-bold">LMS Platform</span>
        </div>

        <Card className="w-full max-w-md border-gray-100 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'login' && 'Sign in to your account'}
              {activeTab === 'register' && 'Create a new account'}
              {activeTab === 'reset' && 'Reset your password'}
            </p>
          </div>

          {/* Tab Navigation - Pill Style */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-full mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-[#3c65f5] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-[#3c65f5] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reset')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'reset'
                  ? 'bg-[#3c65f5] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reset
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleSubmit}>
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              >
                Sign In
              </Button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField label="Full Name" required>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="Create a password"
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <Button 
                type="submit" 
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                disabled
              >
                Create Account
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">Registration feature coming soon</p>
            </form>
          )}

          {/* Reset Password Form */}
          {activeTab === 'reset' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <p className="text-sm text-gray-600 mb-6">
                We'll send you a link to reset your password to the email address associated with your account.
              </p>

              <Button 
                type="submit" 
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                disabled
              >
                Send Reset Link
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">Password reset feature coming soon</p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
