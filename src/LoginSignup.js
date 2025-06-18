import React, { useState } from 'react';
import './LoginSignup.css';

function LoginSignup({ onLogin, onBackHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '', newPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setIsForgot(false);
    setError('');
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (isLogin) {
      const matchedEmail = users.find(user => user.email === formData.email);

      if (!matchedEmail) {
        setError('Account does not exist');
      } else if (matchedEmail.password !== formData.password) {
        setError('Incorrect password');
      } else {
        setError('');
        onLogin();
      }

    } else {
      const alreadyExists = users.some((user) => user.email === formData.email);
      if (alreadyExists) {
        setError('User already exists');
      } else {
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login now.');
        toggleMode();
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex((user) => user.email === forgotData.email);

    if (index !== -1) {
      users[index].password = forgotData.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setMessage('Password updated successfully. You can now log in.');
      setError('');
      setForgotData({ email: '', newPassword: '' });
    } else {
      setError('Email not found');
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      {isForgot ? (
        <>
          <h2>Reset Password</h2>
          <form onSubmit={handleForgotSubmit}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={forgotData.email}
                onChange={handleForgotChange}
                required
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={forgotData.newPassword}
                onChange={handleForgotChange}
                required
              />
            </label>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="submit">Reset Password</button>
          </form>
          <p>
            Remembered password?{' '}
            <span className="toggle" onClick={() => { setIsForgot(false); }}>
              Back to Login
            </span>
          </p>
        </>
      ) : (
        <>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <label>
              Email:
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>

          {isLogin && (
            <p>
              <span className="toggle" onClick={() => { setIsForgot(true); setError(''); }}>
                Forgot Password?
              </span>
            </p>
          )}

          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span className="toggle" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </>
      )}


    </div>
  );
}

export default LoginSignup;
