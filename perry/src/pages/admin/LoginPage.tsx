import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.scss';
import { updateTokens, initializeTokens } from '../../utils/authToken';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('LoginPage mounted - initializing tokens');
    initializeTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    e.preventDefault();
    try {
      console.log('Preparing login request...');
      let deviceId = localStorage.getItem('deviceId');
      
      if (!deviceId) {
        console.log('No deviceId found, generating new one');
        deviceId = uuidv4();
        localStorage.setItem('deviceId', deviceId);
      } else {
        console.log('Using existing deviceId:', deviceId);
      }

      const loginUrl = 'https://amazonkiller-api.greenriver-0a1c5aba.westeurope.azurecontainerapps.io/api/auth/login';
      console.log('Sending login request to:', loginUrl);

      const requestBody = { email, password, deviceId };
      console.log('Request body (without password):', { ...requestBody, password: '***' });

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed. Server response:', errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Login successful, received tokens');
      console.log('Access token length:', data.accessToken?.length);
      console.log('Refresh token length:', data.refreshToken?.length);
      
      updateTokens(data.accessToken, data.refreshToken);

      const from = location.state?.from?.pathname || '/admin/users';
      console.log('Navigating to:', from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1 className="login-page__title">Welcome to admin panel</h1>
          <p className="login-page__subtitle">Login into your account</p>
        </div>
        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="login-page__input-group">
            <div className="login-page__input-wrapper">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                className={`login-page__input ${(focusedInput === 'email' || email) ? 'login-page__input--active' : ''}`}
                required 
              />
              <div className={`login-page__input-label ${(focusedInput === 'email' || email) ? 'login-page__input-label--active' : ''}`}>
                Email
              </div>
            </div>
          </div>
          <div className="login-page__input-group">
            <div className="login-page__input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                className={`login-page__input ${(focusedInput === 'password' || password) ? 'login-page__input--active' : ''}`}
                required 
              />
              <div className={`login-page__input-label ${(focusedInput === 'password' || password) ? 'login-page__input-label--active' : ''}`}>
                Password
              </div>
              <button
                type="button"
                className="login-page__eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12C3 12 6.27273 5 12 5C17.7273 5 21 12 21 12C21 12 17.7273 19 12 19C6.27273 19 3 12 3 12Z" stroke="#0E2042" strokeWidth="1.5"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#0E2042" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 11.2207H21" stroke="#0E2042" strokeWidth="1.5"/>
                    <path d="M12 16.4102V13.5302" stroke="#0E2042" strokeWidth="1.5"/>
                    <path d="M18.3418 14.16L16.3418 14.16" stroke="#0E2042" strokeWidth="1.5"/>
                    <path d="M5.63672 14.16L3.63672 14.16" stroke="#0E2042" strokeWidth="1.5"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="login-page__submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}; 