import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, X } from 'lucide-react';
import { setUser } from '../store/slices/authSlice';
import { LoginCredentials, SignupCredentials } from '../types';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState<LoginCredentials | SignupCredentials>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login logic
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
          dispatch(setUser({
            id: '1',
            email: credentials.email,
            name: 'Admin User',
            role: 'admin'
          }));
          navigate('/admin');
        } else if (credentials.email === 'user@example.com' && credentials.password === 'user') {
          dispatch(setUser({
            id: '2',
            email: credentials.email,
            name: 'Regular User',
            role: 'user'
          }));
          navigate('/');
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Signup logic
        // In a real app, you would call your signup API here
        // For demo, we'll just log the user in directly
        dispatch(setUser({
          id: '3',
          email: credentials.email,
          name:'New User',
          role: 'user'
        }));
        navigate('/');
      }
   
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Error creating account. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setCredentials({
      email: '',
      password: '',
      name: '',
    });
  };

  return (
    <>
     

      
     <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50 p-4">
     <div className="w-full max-w-md mx-auto">

            <div className="p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? 'Welcome Back!' : 'Create an Account'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      //value={credentials.name}
                      onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        // Add your forgot password logic here
                        alert('Password reset link will be sent to your email!');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={toggleAuthMode}
                >
                  {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </button>
              </div>

         
            </div>
          </div>
        </div>
     
    </>
  );
};

export default LoginForm;


