import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { Card } from '../components/ui/Card';

export const Login: React.FC = () => {
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

        <Card className="w-full max-w-md border-gray-100 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">LMS Platform</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField label="Email" required>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-[#3c65f5] focus:ring-[#3c65f5] focus:ring-2"
              />
            </FormField>

            <FormField label="Password" required>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-[#3c65f5] focus:ring-[#3c65f5] focus:ring-2"
              />
            </FormField>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full mb-4 bg-[#3c65f5] hover:bg-[#2d4ec7] focus:ring-[#3c65f5] focus:ring-2 focus:ring-offset-2 transition-all duration-200 relative group"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#43b65d] group-focus:w-16 transition-all duration-300"></span>
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Demo Users:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Admin:</strong> admin@example.com / demo123</p>
                <p><strong>Manager:</strong> manager@example.com / demo123</p>
                <p><strong>Employee:</strong> employee@example.com / demo123</p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
