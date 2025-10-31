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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [resetEmail, setResetEmail] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        const redirectPath = authService.getRedirectPath(data.user.role);
        navigate(redirectPath);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const nameParts = registerData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName,
          lastName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        const redirectPath = authService.getRedirectPath(data.user.role);
        navigate(redirectPath);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/auth/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('If an account exists with this email, you will receive password reset instructions.');
        setResetEmail('');
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <FormField label="Full Name" required>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="Create a password (min 8 characters)"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* Reset Password Form */}
          {activeTab === 'reset' && (
            <form onSubmit={handlePasswordReset}>
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#43b65d] focus:ring-[#43b65d] focus:ring-2"
                />
              </FormField>

              <p className="text-sm text-gray-600 mb-6">
                We'll send you a link to reset your password to the email address associated with your account.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#43b65d] focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
