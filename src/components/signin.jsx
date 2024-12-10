import { useState } from 'react';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  // Background molecule animation components
  const AnimatedBackground = () => {
    const shapes = [
      { size: 'w-20 h-20', color: 'bg-blue-200', animationDelay: 'delay-200' },
      { size: 'w-24 h-24', color: 'bg-indigo-200', animationDelay: 'delay-500' },
      { size: 'w-16 h-16', color: 'bg-purple-200', animationDelay: 'delay-300' },
      { size: 'w-32 h-32', color: 'bg-blue-100', animationDelay: 'delay-700' }
    ];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, index) => (
          <div
            key={index}
            className={`absolute ${shape.size} ${shape.color} opacity-20 rounded-full 
              animate-molecule-float ${shape.animationDelay}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 30 + 20}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="w-full max-w-md px-4 z-10 relative">
        <div className="bg-gray-50 shadow-xl rounded-2xl p-8 space-y-6 w-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Login to Data Genei
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                           rounded-md shadow-sm text-sm font-medium text-white 
                           bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account? {' '}
              <a 
                href="/signup" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;